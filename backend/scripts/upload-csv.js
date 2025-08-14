#!/usr/bin/env node

import CSVUploadService from '../uploads.js';

/**
 * CLI script for CSV upload service
 * Usage: node scripts/upload-csv.js [filename]
 * 
 * If no filename is provided, uploads all CSV files
 * If filename is provided, uploads only that specific file
 */

async function main() {
  const uploadService = new CSVUploadService();
  
  // Get command line arguments
  const args = process.argv.slice(2);
  const specificFile = args[0];
  
  console.log('🚀 EAFYA CSV Upload Service');
  console.log('=' .repeat(50));
  
  try {
    if (specificFile) {
      console.log(`📁 Uploading specific file: ${specificFile}`);
      console.log(`📂 Uploads directory: ${uploadService.uploadsDir}`);
      
      const result = await uploadService.uploadSpecificFile(specificFile);
      
      if (result) {
        console.log(`\n✅ File ${specificFile} uploaded successfully!`);
      } else {
        console.log(`\n❌ Failed to upload file ${specificFile}`);
        process.exit(1);
      }
    } else {
      console.log('📁 Uploading all CSV files from uploads directory');
      console.log(`📂 Uploads directory: ${uploadService.uploadsDir}`);
      
      await uploadService.uploadAllCSVFiles();
    }
    
    // Print summary
    uploadService.printSummary();
    
    // Exit with success
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error during upload process:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main();
