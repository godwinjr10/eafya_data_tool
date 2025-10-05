import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixTableId() {
  try {
    console.log('🔧 Fixing hmis_eafya_conditions_mapping table ID structure...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../sql/migrations/003_fix_hmis_conditions_mapping_id.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Successfully fixed table ID structure!');
    console.log('📋 The id column is now:');
    console.log('   - SERIAL (auto-incrementing)');
    console.log('   - PRIMARY KEY');
    console.log('   - Will auto-generate values on INSERT');
    
  } catch (error) {
    console.error('❌ Error fixing table ID structure:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixTableId();
