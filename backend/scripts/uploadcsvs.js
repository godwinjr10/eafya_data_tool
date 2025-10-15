import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import csvParser from "csv-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, "..", ".env") });

// Simple CLI parsing
const argv = process.argv.slice(2);
const opts = {
	dir: null,
	delimiter: ",",
	dryRun: false,
		force: true, // drop existing table by default to avoid duplicate insert errors
		yes: false,
		truncate: false,
		inferTypes: false,
		schema: "reporting",
};

for (let i = 0; i < argv.length; i++) {
	const a = argv[i];
	if (a === "--dir" && argv[i + 1]) {
		opts.dir = argv[++i];
	} else if (a === "--delimiter" && argv[i + 1]) {
		opts.delimiter = argv[++i];
	} else if (a === "--dry-run") {
		opts.dryRun = true;
		} else if (a === "--force") {
			opts.force = true;
		} else if (a === "--no-drop") {
			opts.force = false;
		} else if (a === "--yes") {
			opts.yes = true;
		} else if (a === "--truncate") {
			opts.truncate = true;
	} else if (a === "--infer-types") {
		opts.inferTypes = true;
	} else if (a === "--schema" && argv[i + 1]) {
		opts.schema = argv[++i];
	} else if (a === "--help" || a === "-h") {
		console.log(`Usage: node uploadcsvs.js [--dir <uploads_dir>] [--delimiter ,] [--dry-run] [--force] [--infer-types] [--schema <schema>]\n`);
		process.exit(0);
	}
}

const defaultUploads = path.resolve(__dirname, "..", "sql", "uploads");
const uploadsDir = opts.dir ? path.resolve(opts.dir) : defaultUploads;

function sanitizeName(name) {
	return name
		.toString()
		.trim()
		.replace(/\.[^.]+$/, "")
		.replace(/[^a-zA-Z0-9_]/g, "_")
		.replace(/__+/g, "_")
		.replace(/^_+|_+$/g, "")
		.toLowerCase();
}

function guessType(values) {
	// Basic inference: integer, float, boolean, timestamptz, text
	let hasFloat = false;
	let hasInt = true;
	let hasBool = true;
	let hasDate = true;

	for (const v of values) {
		const s = (v ?? "").toString().trim();
		if (s === "") continue;
		if (!/^[-+]?\d+$/.test(s)) hasInt = false;
		if (!/^[-+]?\d*\.\d+$/.test(s)) hasFloat = hasFloat || /^[-+]?\d*\.\d+$/.test(s);
		if (!/^(true|false)$/i.test(s)) hasBool = false;
		if (!/^\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:?\d{0,2}(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(s)) hasDate = false;
	}

	if (hasInt) return "BIGINT";
	if (hasFloat) return "DOUBLE PRECISION";
	if (hasBool) return "BOOLEAN";
	if (hasDate) return "TIMESTAMPTZ";
	return "TEXT";
}

async function processFile(filePath) {
	const fileName = path.basename(filePath);
	const tableBase = sanitizeName(fileName);
	const tableName = `${opts.schema}.${tableBase}`;

	console.log(`\nProcessing ${fileName} -> table ${tableName}`);

	const headers = [];
	const rows = [];

	// Read and parse CSV
	await pipeline(
		fs.createReadStream(filePath),
		csvParser({ separator: opts.delimiter, skipLines: 0, mapHeaders: ({ header }) => header }) ,
		async function* (source) {
			for await (const record of source) {
				if (headers.length === 0) {
					for (const h of Object.keys(record)) {
						headers.push(h);
					}
				}
				rows.push(record);
			}
		}
	);

	if (headers.length === 0) {
		console.log(`Skipping ${fileName}: no headers found`);
		return;
	}

	const columnNames = headers.map((h) => sanitizeName(h) || "col");

	// Build CREATE TABLE
	let columnsSql = [];
	if (opts.inferTypes) {
		// gather sample values per column
		const samples = columnNames.map(() => []);
		for (const r of rows.slice(0, 1000)) {
			for (let i = 0; i < headers.length; i++) {
				const raw = r[headers[i]];
				samples[i].push(raw);
			}
		}
		for (let i = 0; i < columnNames.length; i++) {
			const t = guessType(samples[i]);
			columnsSql.push(`"${columnNames[i]}" ${t}`);
		}
	} else {
		for (const c of columnNames) {
			columnsSql.push(`"${c}" TEXT`);
		}
	}

		const createTableSql = `CREATE SCHEMA IF NOT EXISTS "${opts.schema}";\nCREATE TABLE IF NOT EXISTS ${tableName} ( ${columnsSql.join(", ")} );`;

	const client = await pool.connect();
	try {
		if (opts.dryRun) {
			console.log(`[dry-run] Would execute: ${createTableSql.split('\n').join(' ' )}`);
			console.log(`[dry-run] Would insert ${rows.length} rows into ${tableName}`);
			return;
		}

		if (opts.force) {
			console.log(`Dropping table if exists ${tableName}`);
			await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
		}

		console.log(`Creating table ${tableName}`);
		await client.query(createTableSql);

		if (rows.length === 0) {
			console.log(`No data rows found in ${fileName}`);
			return;
		}

			if (opts.truncate) {
				console.log(`Truncating table ${tableName}`);
				await client.query(`TRUNCATE TABLE ${tableName};`);
			}

		// Insert rows in batches
		const batchSize = 500;
		let inserted = 0;
		for (let i = 0; i < rows.length; i += batchSize) {
			const batch = rows.slice(i, i + batchSize);
			const valuesSql = [];
			const params = [];
			let paramIdx = 1;

			for (const r of batch) {
				const rowParams = [];
				for (let j = 0; j < headers.length; j++) {
					const val = r[headers[j]];
					// treat empty strings as null
					if (val === "") {
						params.push(null);
					} else if (val === undefined) {
						params.push(null);
					} else {
						params.push(val);
					}
					rowParams.push(`$${paramIdx++}`);
				}
				valuesSql.push(`(${rowParams.join(",")})`);
			}

			// Use ON CONFLICT DO NOTHING to skip rows that violate unique/PK constraints
			const insertSql = `INSERT INTO ${tableName} (${columnNames.map((c) => `"${c}"`).join(",")}) VALUES ${valuesSql.join(",")} ON CONFLICT DO NOTHING RETURNING 1;`;
			await client.query('BEGIN');
			try {
				const res = await client.query(insertSql, params);
				await client.query('COMMIT');
				inserted += res.rowCount || batch.length;
			} catch (err) {
				await client.query('ROLLBACK');
				console.error(`Error inserting batch starting at ${i}:`, err.message);
				throw err;
			}
		}

		console.log(`Inserted ${inserted} rows into ${tableName}`);
	} finally {
		client.release();
	}
}

async function main() {
	console.log(`Uploads directory: ${uploadsDir}`);
	if (!fs.existsSync(uploadsDir)) {
		console.error(`Uploads directory not found: ${uploadsDir}`);
		process.exit(1);
	}

	const files = fs.readdirSync(uploadsDir).filter((f) => f.toLowerCase().endsWith('.csv')).sort();
	if (files.length === 0) {
		console.log('No CSV files found.');
		return;
	}

	// Dropping tables is enabled by default when --force is set (no interactive prompt).

	for (const f of files) {
		const fp = path.join(uploadsDir, f);
		try {
			await processFile(fp);
		} catch (err) {
			console.error(`Failed processing ${f}:`, err.message);
		}
	}

	// close pool
	await pool.end();
	console.log('\nAll done');
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
