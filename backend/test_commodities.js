import { pool } from './config/database.js';

async function test() {
  try {
    console.log('Testing commodities table...');
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = 'dhis_eafya_mapping_commodities'
      ) as table_exists
    `);
    
    console.log('Table exists:', tableCheck.rows[0].table_exists);
    
    if (tableCheck.rows[0].table_exists) {
      // Check table structure
      const structure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'reporting' 
        AND table_name = 'dhis_eafya_mapping_commodities'
        ORDER BY ordinal_position
      `);
      
      console.log('\nTable structure:');
      structure.rows.forEach(row => console.log('  ', row.column_name, '-', row.data_type));
      
      // Check sample data
      const sampleData = await pool.query(`
        SELECT hmis_code, hmis_name, section_name 
        FROM reporting.dhis_eafya_mapping_commodities 
        LIMIT 5
      `);
      
      console.log('\nSample data:');
      sampleData.rows.forEach(row => console.log('  ', row));
      
      // Check if hmis_name is NULL
      const nullCheck = await pool.query(`
        SELECT 
          COUNT(*) as total_rows,
          COUNT(hmis_name) as non_null_hmis_name,
          COUNT(*) - COUNT(hmis_name) as null_hmis_name
        FROM reporting.dhis_eafya_mapping_commodities
      `);
      
      console.log('\nhmis_name NULL check:', nullCheck.rows[0]);
      
      // Test the actual query from the endpoint
      const endpointQuery = await pool.query(`
        SELECT 
          distinct hmis_code,
          section_id, 
          section_name,
          hmis_name
        FROM reporting.dhis_eafya_mapping_commodities
        order by hmis_code
        LIMIT 5
      `);
      
      console.log('\nEndpoint query result:');
      endpointQuery.rows.forEach(row => console.log('  ', row));
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

test();
