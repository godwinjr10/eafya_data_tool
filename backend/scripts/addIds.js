import { pool } from "../config/database.js";

const addIds = async () => {
  const materializedViewIds = [
    { name: "Maternity Ward", category: "Wards" },
    { name: "Postnantal Ward", category: "Wards" },
    { name: "Main Store", category: "Stores" },
    { name: "HPV Vaccine", category: "Vaccines" },
    { name: "Antenatal Clinic", category: "Clinics" },
    { name: "Major Theatre", category: "Theatres" },
  ];

  try {
    // Check if table exists first
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = 'materialized_view_ids'
      );
    `;
    
    const tableExists = await pool.query(checkTableQuery);
    const tableAlreadyExists = tableExists.rows[0].exists;

    // Create the table if it doesn't exist
    if (!tableAlreadyExists) {
      const createTableQuery = `
        CREATE TABLE reporting.materialized_view_ids (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(255),
          mapping_id INTEGER,
          mapping_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(name, mapping_id)
        );
      `;

      await pool.query(createTableQuery);
      console.log("Table 'materialized_view_ids' created successfully");
    } else {
      console.log("Table 'materialized_view_ids' already exists");
    }

    // Insert data using raw SQL with proper conflict handling
    for (const row of materializedViewIds) {
      const insertQuery = `
        INSERT INTO reporting.materialized_view_ids (name, category, mapping_id, mapping_name)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name, mapping_id) DO NOTHING;
      `;
      
      await pool.query(insertQuery, [
        row.name,
        row.category,
        0,
        null
      ]);
    }
    
    console.log("Seeded materialized view names");
  } catch (error) {
    console.log("ERROR", error);
  } finally {
    // Close the pool connection
    await pool.end();
  }
};

addIds();
