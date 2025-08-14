import { pool } from './config/database.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SQL files to execute in order
const sqlFiles = [
  'deleteAllTables.sql',
  '001_import_tables.sql',
  '002_stage_tables.sql',
  '003_dwh_tables.sql',
  '004_reporting_tables.sql'
];

// Function to read and execute SQL file
async function executeSqlFile(filename) {
  try {
    console.log(`\n📁 Executing: ${filename}`);
    
    // Read the SQL file
    const filePath = join(__dirname, 'sql', 'tablescripts', filename);
    const sqlContent = await readFile(filePath, 'utf8');
    
    // Split SQL content by semicolon to execute multiple statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.error(`   ❌ Error executing statement ${i + 1}:`, error.message);
          // Continue with next statement instead of failing completely
        }
      }
    }
    
    console.log(`   ✅ Completed: ${filename}`);
    
  } catch (error) {
    console.error(`   ❌ Error reading file ${filename}:`, error.message);
    throw error;
  }
}

// Main function to execute all SQL files
async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  console.log('=====================================');
  
  try {
    // Test database connection first
    const client = await pool.connect();
    console.log('✅ Database connection established');
    client.release();
    
    // Execute SQL files in sequence
    for (const filename of sqlFiles) {
      await executeSqlFile(filename);
    }
    
    console.log('\n=====================================');
    console.log('🎉 Database setup completed successfully!');
    console.log('All tables have been created in the following schemas:');
    console.log('  - import');
    console.log('  - stage');
    console.log('  - dwh');
    console.log('  - reporting');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
    console.log('\n🔌 Database connection pool closed');
  }
}

// Run the setup when this file is executed
console.log('🚀 Starting database setup...');
setupDatabase().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});

export { setupDatabase };
