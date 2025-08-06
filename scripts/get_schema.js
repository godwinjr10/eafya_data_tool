import { pool } from "../backend/config/database.js";

const schemaQuery = `
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name, ordinal_position;
`;

pool.query(schemaQuery, (err, result) => {
  if (err) {
    console.error("Error executing query:", err);
    process.exit(1);
  }
  console.log(JSON.stringify(result.rows, null, 2));
  process.exit(0);
});
