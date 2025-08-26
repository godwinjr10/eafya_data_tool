import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LabTestMigrationService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '..', 'sql', 'uploads');
    this.results = [];
    this.errors = [];
  }

  /**
   * Ensure reporting schema exists
   */
  async ensureReportingSchema() {
    try {
      const createSchemaSQL = `
        CREATE SCHEMA IF NOT EXISTS reporting;
      `;
      await pool.query(createSchemaSQL);
      console.log('✅ Reporting schema ensured');
      return true;
    } catch (error) {
      console.error('Error creating reporting schema:', error);
      throw error;
    }
  }

  /**
   * Ensure eafya_mappings table exists
   */
  async ensureEafyaMappingsTable() {
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS reporting.eafya_mappings (
          id BIGSERIAL PRIMARY KEY,
          hmis_dataelement_code VARCHAR(255) NOT NULL,
          hmis_dataelement_name VARCHAR(500) NOT NULL,
          dataelement_id VARCHAR(255),
          dataset_code VARCHAR(50) NOT NULL,
          section_id VARCHAR(50),
          eafya_item_id BIGINT NOT NULL,
          eafya_item_name VARCHAR(500) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      await pool.query(createTableSQL);
      console.log('✅ eafya_mappings table ensured');
      return true;
    } catch (error) {
      console.error('Error creating eafya_mappings table:', error);
      throw error;
    }
  }

  /**
   * Parse labtests CSV file
   */
  async parseLabTestsCSV() {
    const csvPath = path.join(this.uploadsDir, 'dhis_eafya_mapping_labtests.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error('Lab tests CSV file not found');
    }

    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Migrate lab tests data to eafya_mappings
   */
  async migrateLabTests() {
    try {
      console.log('🚀 Starting lab tests migration...');
      
      // Ensure schema and table exist
      await this.ensureReportingSchema();
      await this.ensureEafyaMappingsTable();

      // Parse CSV data
      const csvData = await this.parseLabTestsCSV();
      console.log(`📊 Found ${csvData.length} lab test records to migrate`);

      // Clear existing lab test mappings for section 10.2.1
      await pool.query(
        'DELETE FROM reporting.eafya_mappings WHERE section_id = $1',
        ['10.2.1']
      );
      console.log('🗑️ Cleared existing lab test mappings');

      // Insert new mappings
      let insertedCount = 0;
      for (const record of csvData) {
        if (record.eafya_labtest_id && record.hmis_code && record.hmis_name) {
          try {
            await pool.query(
              `INSERT INTO reporting.eafya_mappings (
                hmis_dataelement_code,
                hmis_dataelement_name,
                dataelement_id,
                dataset_code,
                section_id,
                eafya_item_id,
                eafya_item_name,
                created_at,
                updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
              [
                record.hmis_code,
                record.hmis_name,
                record.dhis2_data_element_id || null,
                'HMIS_105_10',
                record.section_id,
                parseInt(record.eafya_labtest_id),
                record.eafya_labtest_name || record.hmis_name
              ]
            );
            insertedCount++;
          } catch (error) {
            console.error(`Error inserting record ${record.hmis_code}:`, error.message);
            this.errors.push({
              hmis_code: record.hmis_code,
              error: error.message
            });
          }
        }
      }

      console.log(`✅ Successfully migrated ${insertedCount} lab test records`);
      
      // Also create parent section 10.2 mappings if they don't exist
      await this.createParentSectionMappings();

      return {
        total: csvData.length,
        inserted: insertedCount,
        errors: this.errors.length
      };

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Create parent section 10.2 mappings
   */
  async createParentSectionMappings() {
    try {
      // Check if parent section mappings exist
      const existingMappings = await pool.query(
        'SELECT COUNT(*) FROM reporting.eafya_mappings WHERE section_id = $1',
        ['10.2']
      );

      if (parseInt(existingMappings.rows[0].count) === 0) {
        // Create a parent section mapping that aggregates all 10.2.1 data
        await pool.query(
          `INSERT INTO reporting.eafya_mappings (
            hmis_dataelement_code,
            hmis_dataelement_name,
            dataelement_id,
            dataset_code,
            section_id,
            eafya_item_id,
            eafya_item_name,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [
            '10.2',
            'Laboratory Tests',
            null,
            'HMIS_105_10',
            '10.2',
            0, // Special ID for parent section
            'Laboratory Tests Section'
          ]
        );
        console.log('✅ Created parent section 10.2 mapping');
      }
    } catch (error) {
      console.error('Error creating parent section mappings:', error);
    }
  }

  /**
   * Print migration summary
   */
  printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 LAB TESTS MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Total records processed: ${results.total}`);
    console.log(`✅ Successfully migrated: ${results.inserted}`);
    console.log(`❌ Errors: ${results.errors}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => {
        console.log(`  📝 ${error.hmis_code}: ${error.error}`);
      });
    }
    
    console.log('='.repeat(60));
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migrationService = new LabTestMigrationService();
  
  migrationService.migrateLabTests()
    .then(results => {
      migrationService.printSummary(results);
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default LabTestMigrationService;
