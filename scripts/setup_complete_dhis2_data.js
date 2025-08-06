const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Setting up complete DHIS2 data...\n');

// Step 1: Fetch complete DHIS2 data
console.log('Step 1: Fetching complete DHIS2 data from API...');
exec('node fetch_complete_dhis2_data.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error fetching DHIS2 data:', error);
        return;
    }
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    // Step 2: Populate database
    console.log('\nStep 2: Populating database with complete data...');
    exec('node populate_dhis2_mapping_details.js', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error populating database:', error);
            return;
        }
        
        console.log(stdout);
        if (stderr) console.error(stderr);
        
        console.log('\n✅ Complete DHIS2 data setup finished!');
        console.log('Your mapping system now has ALL DHIS2 data available.');
    });
});