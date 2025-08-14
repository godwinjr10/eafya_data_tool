import { pool } from './config/database.js';

async function testSchema() {
  try {
    console.log('🧪 Testing reporting schema creation...');
    
    // Create the reporting schema
    const createSchemaSQL = `CREATE SCHEMA IF NOT EXISTS reporting;`;
    await pool.query(createSchemaSQL);
    console.log('✅ Reporting schema created/verified');
    
    // Check if schema exists
    const checkSchemaSQL = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'reporting';
    `;
    const schemaResult = await pool.query(checkSchemaSQL);
    
    if (schemaResult.rows.length > 0) {
      console.log('✅ Reporting schema exists in database');
    } else {
      console.log('❌ Reporting schema not found');
    }
    
    // List all schemas
    const listSchemasSQL = `
      SELECT schema_name 
      FROM information_schema.schemata 
      ORDER BY schema_name;
    `;
    const schemasResult = await pool.query(listSchemasSQL);
    console.log('📋 Available schemas:', schemasResult.rows.map(row => row.schema_name));
    
    console.log('✅ Schema test completed');
    
  } catch (error) {
    console.error('❌ Error testing schema:', error);
  } finally {
    await pool.end();
  }
}

testSchema();
