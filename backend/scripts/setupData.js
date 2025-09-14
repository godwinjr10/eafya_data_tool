import bcrypt from "bcrypt";
import { pool } from "../config/database.js";

// Configuration
const datasets = [
  {
    dataset_id: "HMIS_105_01",
    dataset_name:
      "HMIS 105:01 - OPD Monthly Report (Attendances, Referrals, Conditions)",
    sections: [
      { section_id: "1.1", section_name: "Attendance and Referral" },
      { section_id: "1.3.1", section_name: "Epidemic Prone Diseases" },
      {
        section_id: "1.3.2",
        section_name: "Other Infectious / Communicable Diseases",
      },
      { section_id: "1.3.3", section_name: "Neonatal Diseases" },
      { section_id: "1.3.4", section_name: "Non-Communicable Diseases" },
      { section_id: "1.3.5", section_name: "Oral Diseases" },
      { section_id: "1.3.6", section_name: "ENT Conditions" },
      { section_id: "1.3.7", section_name: "Eye Conditions" },
      { section_id: "1.3.8", section_name: "Mental Health" },
      { section_id: "1.3.9", section_name: "Neurological Disorders" },
      { section_id: "1.3.10", section_name: "Chronic Respiratory" },
      { section_id: "1.3.11", section_name: "Cancers" },
      { section_id: "1.3.12", section_name: "Palliative" },
      { section_id: "1.3.14", section_name: "Disabilities" },
      { section_id: "1.3.15", section_name: "Cardiovascular Diseases" },
      { section_id: "1.3.16", section_name: "Renal Diseases" },
      { section_id: "1.3.17", section_name: "Liver Diseases" },
      { section_id: "1.3.18", section_name: "Endocrine Metabolic Disorders" },
      { section_id: "1.3.19", section_name: "Injuries" },
      { section_id: "1.3.20", section_name: "Minor Operations OPD" },
      { section_id: "1.3.21", section_name: "Neglected Tropical Diseases" },
      { section_id: "1.3.22", section_name: "Maternal Conditions" },
      { section_id: "1.3.24", section_name: "Deaths in OPD" },
      { section_id: "1.3.25", section_name: "Emergency Medical Services" },
      { section_id: "1.3.26", section_name: "TB Screening" },
      { section_id: "1.3.27", section_name: "Leprosy Services" },
      { section_id: "1.3.28", section_name: "Nutrition Services" },
      { section_id: "1.3.29", section_name: "Gender Based Violence Services" },
    ],
  },
  {
    dataset_id: "HMIS_105_02",
    dataset_name: "HMIS 105:02 - OPD Monthly Report (MCH, FP, EPI)",
    sections: [
      { section_id: "2.1", section_name: "Antenatal" },
      { section_id: "2.2", section_name: "Maternity" },
      { section_id: "2.3", section_name: "Postnatal" },
      { section_id: "2.4.1", section_name: "Family Planning" },
      { section_id: "2.6", section_name: "Child Health Services" },
      { section_id: "2.6.2", section_name: "Tetanus Vaccination" },
      { section_id: "2.6.3", section_name: "Child Immunization" },
      { section_id: "2.6.4", section_name: "Vaccine Availability" },
    ],
  },
  {
    dataset_id: "HMIS_105_06",
    dataset_name: "HMIS 105:06 - OPD Monthly Report (Essential Medicines)",
    sections: [
      {
        section_id: "6.1",
        section_name: "Essential Medicines and Health Supplies",
      },
    ],
  },
  {
    dataset_id: "HMIS_105_10",
    dataset_name: "HMIS 105:10 - OPD Monthly Report (Laboratory)",
    sections: [
      { section_id: "10.1", section_name: "Total Laboratory Client Visits" },
      { section_id: "10.1.2", section_name: "Specimen Collected" },
      { section_id: "10.2.1", section_name: "Laboratory Routine Tests" },
    ],
  },
  {
    dataset_id: "HMIS_108",
    dataset_name: "HMIS 108 - Inpatient Monthly Report",
    sections: [
      { section_id: "1", section_name: "Census Information" },
      { section_id: "2", section_name: "Referrals" },
      { section_id: "3", section_name: "Surgical Procedures" },
      { section_id: "4", section_name: "Blood Transfusion Services" },
      { section_id: "5", section_name: "Radiology and Imaging" },
      { section_id: "6", section_name: "Admissions Deaths by Diagnosis" },
      { section_id: "7", section_name: "Mental Health, Risk Behaviour TB" },
      { section_id: "10", section_name: "Nutrition" },
      { section_id: "11", section_name: "Rehabilitation" },
    ],
  },
];

const defaultUsers = [
  {
    username: "admin",
    role: "admin",
    password: "admin1234",
    firstname: "System",
    lastname: "Administrator",
    phoneNo: "+254700000000",
    module: "all",
  },
  {
    username: "user",
    role: "user",
    password: "user1234",
    firstname: "Regular",
    lastname: "User",
    phoneNo: "+254700000001",
    module: "reports",
  },
];

// Function to create schema and tables if they don't exist
async function createTablesIfNotExists() {
  console.log("🏗️  Ensuring database schema and tables exist...");

  try {
    // Create reporting schema if it doesn't exist
    await pool.query("CREATE SCHEMA IF NOT EXISTS reporting");
    console.log("✅ Reporting schema ensured");

    // Create datasets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reporting.datasets (
        id SERIAL PRIMARY KEY,
        dataset_id VARCHAR(255) NOT NULL,
        dataset_name VARCHAR(255) NOT NULL,
        sections JSONB NOT NULL DEFAULT '[]'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log("✅ Datasets table ensured");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reporting.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        "phoneNo" VARCHAR(255),
        module VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log("✅ Users table ensured");

    return true;
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    return false;
  }
}

// Function to create datasets via direct database insert
async function createDatasets() {
  console.log("🚀 Creating datasets...");

  try {
    // Check if datasets already exist
    const existingDatasets = await pool.query(
      "SELECT dataset_id FROM reporting.datasets WHERE dataset_id = ANY($1)",
      [datasets.map((d) => d.dataset_id)]
    );

    const existingIds = existingDatasets.rows.map((row) => row.dataset_id);
    const newDatasets = datasets.filter(
      (d) => !existingIds.includes(d.dataset_id)
    );

    if (newDatasets.length === 0) {
      console.log("⚠️  All datasets already exist, skipping creation");
      return true;
    }

    // Prepare bulk insert query
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    newDatasets.forEach((dataset) => {
      placeholders.push(
        `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, NOW(), NOW())`
      );
      values.push(
        dataset.dataset_id,
        dataset.dataset_name,
        JSON.stringify(dataset.sections)
      );
      paramIndex += 3;
    });

    const query = `
      INSERT INTO reporting.datasets (dataset_id, dataset_name, sections, "createdAt", "updatedAt") 
      VALUES ${placeholders.join(", ")} 
      RETURNING id, dataset_id, dataset_name
    `;

    const result = await pool.query(query, values);

    console.log("✅ Datasets created successfully!");
    console.log(`📊 Created ${result.rows.length} datasets:`);
    result.rows.forEach((dataset) => {
      console.log(`   - ${dataset.dataset_id}: ${dataset.dataset_name}`);
    });
    return true;
  } catch (error) {
    console.error("❌ Error creating datasets:", error.message);
    return false;
  }
}

// Function to create users directly in database
async function createUsers() {
  console.log("👤 Creating default users...");

  let allCreated = true;

  for (const userData of defaultUsers) {
    try {
      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT id FROM reporting.users WHERE username = $1",
        [userData.username]
      );

      if (existingUser.rows.length > 0) {
        console.log(
          `   ✅ User '${userData.username}' already exists, skipping...`
        );
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Insert user
      const result = await pool.query(
        `INSERT INTO reporting.users (username, role, password, firstname, lastname, "phoneNo", module, "createdAt", "updatedAt") 
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
               RETURNING id, username, role, firstname, lastname`,
        [
          userData.username,
          userData.role,
          hashedPassword,
          userData.firstname,
          userData.lastname,
          userData.phoneNo,
          userData.module,
        ]
      );

      const user = result.rows[0];
      console.log(`   ✅ User '${user.username}' created successfully`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Name: ${user.firstname} ${user.lastname}`);
      console.log(
        `   - Password: ${userData.password} (change this after first login)`
      );
      console.log("");
    } catch (error) {
      console.error(
        `   ❌ Error creating user '${userData.username}':`,
        error.message
      );
      allCreated = false;
    }
  }

  return allCreated;
}

// Main execution function
async function main() {
  console.log("🎯 Starting data setup...\n");

  // Create tables if they don't exist
  const tablesCreated = await createTablesIfNotExists();
  if (!tablesCreated) {
    console.log("❌ Failed to create required tables. Exiting.");
    process.exit(1);
  }
  console.log("");

  // Create datasets
  const datasetsCreated = await createDatasets();
  console.log("");

  // Create users
  const usersCreated = await createUsers();
  console.log("");

  // Summary
  if (tablesCreated && datasetsCreated && usersCreated) {
    console.log("🎉 Setup completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ Database tables ensured");
    console.log("   ✅ Datasets created");
    console.log("   ✅ Default users created");
    console.log("\n🔑 Login credentials:");
    console.log("\n👑 Admin User:");
    console.log(`   Username: ${defaultUsers[0].username}`);
    console.log(`   Password: ${defaultUsers[0].password}`);
    console.log(`   Role: ${defaultUsers[0].role} (Full access)`);
    console.log("\n👤 Regular User:");
    console.log(`   Username: ${defaultUsers[1].username}`);
    console.log(`   Password: ${defaultUsers[1].password}`);
    console.log(`   Role: ${defaultUsers[1].role} (Limited access)`);
    console.log(
      "\n⚠️  Remember to change the default passwords after first login!"
    );
  } else {
    console.log("❌ Setup completed with errors. Please check the logs above.");
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("💥 Fatal error:", error.message);
  process.exit(1);
});
