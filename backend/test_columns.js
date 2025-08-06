import { pool } from "./config/database.js";

async function testColumns() {
  try {
    const query = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'reporting' 
      AND table_name = 'dhis2_mapping_details'
      ORDER BY column_name;
    `;
    
    const { rows } = await pool.query(query);
    console.log("Available columns:");
    rows.forEach(row => console.log(row.column_name));
    
    await pool.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

testColumns();
