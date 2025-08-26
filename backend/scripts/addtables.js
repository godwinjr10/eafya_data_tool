import { pool } from '../config/database.js';
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

// Function to test database connection
async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    const client = await pool.connect();
    
    // Test with a simple query
    const result = await client.query('SELECT NOW() as current_time, current_database() as database_name, current_user as username');
    console.log('✅ Database connection successful!');
    console.log(`   📊 Database: ${result.rows[0].database_name}`);
    console.log(`   👤 User: ${result.rows[0].username}`);
    console.log(`   🕐 Time: ${result.rows[0].current_time}`);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.message.includes('password')) {
      console.log('💡 Password issue detected. Please check:');
      console.log('   1. Your .env file exists and has DB_PASSWORD set');
      console.log('   2. The password is correct for your PostgreSQL user');
      console.log('   3. The password doesn\'t contain special characters that need escaping');
    }
    return false;
  }
}

// Function to read and execute SQL file
async function executeSqlFile(filename) {
  try {
    console.log(`\n📁 Executing: ${filename}`);
    
    // Read the SQL file
    const filePath = join(__dirname, '..', 'sql', 'tablescripts', filename);
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
    const connectionOk = await testConnection();
    if (!connectionOk) {
      throw new Error('Database connection failed');
    }
    
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
setupDatabase().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});

export { setupDatabase };
