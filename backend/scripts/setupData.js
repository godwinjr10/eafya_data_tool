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
      { section_id: "3", section_name: "Surgical Procedures" },
      { section_id: "4", section_name: "Utilization of Special Services" },
      { section_id: "5", section_name: "Radiology and Imaging" },
      { section_id: "6", section_name: "Admissions Deaths by Diagnosis" },
      { section_id: "7", section_name: "Mental Health, Risk Behaviour TB" },
      { section_id: "10", section_name: "Nutrition" },
      { section_id: "11", section_name: "Rehabilitation" },
    ],
  },
];

const defaultUser = {
  username: "admin",
  role: "admin",
  password: "admin1234",
  firstname: "System",
  lastname: "Administrator",
  phoneNo: "+254700000000",
  module: "all",
};

// Function to create datasets via direct database insert
async function createDatasets() {
  console.log("🚀 Creating datasets...");

  try {
    // Check if datasets already exist
    const existingDatasets = await pool.query(
      "SELECT dataset_id FROM reporting.datasets WHERE dataset_id = ANY($1)",
      [datasets.map(d => d.dataset_id)]
    );
    
    const existingIds = existingDatasets.rows.map(row => row.dataset_id);
    const newDatasets = datasets.filter(d => !existingIds.includes(d.dataset_id));
    
    if (newDatasets.length === 0) {
      console.log("⚠️  All datasets already exist, skipping creation");
      return true;
    }

    // Prepare bulk insert query
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    newDatasets.forEach((dataset) => {
      placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, NOW(), NOW())`);
      values.push(
        dataset.dataset_id,
        dataset.dataset_name,
        JSON.stringify(dataset.sections)
      );
      paramIndex += 3;
    });

    const query = `
      INSERT INTO reporting.datasets (dataset_id, dataset_name, sections, "createdAt", "updatedAt") 
      VALUES ${placeholders.join(', ')} 
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

// Function to create user directly in database
async function createUser() {
  console.log("👤 Creating default user...");

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM reporting.users WHERE username = $1",
      [defaultUser.username]
    );

    if (existingUser.rows.length > 0) {
      console.log("⚠️  User already exists, skipping creation");
      return true;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(defaultUser.password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO reporting.users (username, role, password, firstname, lastname, "phoneNo", module, "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
             RETURNING id, username, role, firstname, lastname`,
      [
        defaultUser.username,
        defaultUser.role,
        hashedPassword,
        defaultUser.firstname,
        defaultUser.lastname,
        defaultUser.phoneNo,
        defaultUser.module,
      ]
    );

    const user = result.rows[0];
    console.log("✅ User created successfully!");
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Name: ${user.firstname} ${user.lastname}`);
    console.log(
      `   - Password: ${defaultUser.password} (change this after first login)`
    );

    return true;
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    return false;
  }
}



// Main execution function
async function main() {
  console.log("🎯 Starting data setup...\n");

  // Create datasets
  const datasetsCreated = await createDatasets();
  console.log("");

  // Create user
  const userCreated = await createUser();
  console.log("");

  // Summary
  if (datasetsCreated && userCreated) {
    console.log("🎉 Setup completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ Datasets created");
    console.log("   ✅ Default user created");
    console.log("\n🔑 Login credentials:");
    console.log(`   Username: ${defaultUser.username}`);
    console.log(`   Password: ${defaultUser.password}`);
    console.log(
      "\n⚠️  Remember to change the default password after first login!"
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
