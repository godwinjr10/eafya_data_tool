const axios = require('axios');
const fs = require('fs');
const path = require('path');

// DHIS2 Configuration
const DHIS2_BASE_URL = 'https://customization.health.go.ug/hmis/api';
const USERNAME = 'eafya_integration';
const PASSWORD = 'Inte4fy@d';

// Create axios instance with auth
const dhis2Api = axios.create({
    baseURL: DHIS2_BASE_URL,
    auth: {
        username: USERNAME,
        password: PASSWORD
    },
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

async function fetchAllDHIS2Data() {
    console.log('Fetching complete DHIS2 data...');
    
    try {
        // Fetch all data elements
        console.log('Fetching data elements...');
        const dataElementsResponse = await dhis2Api.get('/dataElements.json?fields=id,code,name,shortName,categoryCombo[id]&paging=false');
        const dataElements = dataElementsResponse.data.dataElements || [];
        console.log(`Found ${dataElements.length} data elements`);

        // Fetch all datasets
        console.log('Fetching datasets...');
        const datasetsResponse = await dhis2Api.get('/dataSets.json?fields=id,name,dataSetElements[dataElement[id]]&paging=false');
        const datasets = datasetsResponse.data.dataSets || [];
        console.log(`Found ${datasets.length} datasets`);

        // Fetch all category option combos
        console.log('Fetching category option combos...');
        const categoryOptionCombosResponse = await dhis2Api.get('/categoryOptionCombos.json?fields=id,name,categoryCombo[id]&paging=false');
        const categoryOptionCombos = categoryOptionCombosResponse.data.categoryOptionCombos || [];
        console.log(`Found ${categoryOptionCombos.length} category option combos`);

        // Create mapping of dataElement to dataset
        const dataElementToDataset = {};
        datasets.forEach(dataset => {
            if (dataset.dataSetElements) {
                dataset.dataSetElements.forEach(dse => {
                    if (dse.dataElement) {
                        dataElementToDataset[dse.dataElement.id] = dataset.name;
                    }
                });
            }
        });

        // Create mapping of category combo to option combos
        const categoryComboToOptionCombos = {};
        categoryOptionCombos.forEach(coc => {
            if (coc.categoryCombo && coc.categoryCombo.id) {
                if (!categoryComboToOptionCombos[coc.categoryCombo.id]) {
                    categoryComboToOptionCombos[coc.categoryCombo.id] = [];
                }
                categoryComboToOptionCombos[coc.categoryCombo.id].push(coc);
            }
        });

        // Generate comprehensive mapping data
        const mappingData = [];
        let hmisId = 1;

        dataElements.forEach(dataElement => {
            const dataset = dataElementToDataset[dataElement.id] || '';
            const categoryComboId = dataElement.categoryCombo ? dataElement.categoryCombo.id : '';
            const optionCombos = categoryComboToOptionCombos[categoryComboId] || [{ id: '', name: '' }];

            // Extract section info from code/name patterns
            let sectionId = '';
            let sectionName = '';
            let hmisCode = dataElement.code || '';
            
            // Parse section from code patterns like "105-EP01A", "108-EP02A", etc.
            if (hmisCode) {
                const codeMatch = hmisCode.match(/^(\d+)-(.+)/);
                if (codeMatch) {
                    const formNumber = codeMatch[1];
                    const itemCode = codeMatch[2];
                    
                    // Determine section based on form patterns
                    if (formNumber === '105') {
                        if (itemCode.startsWith('EP')) {
                            sectionId = '1.3.1';
                            sectionName = 'Epidemic-Prone Diseases';
                        } else if (itemCode.startsWith('TB')) {
                            sectionId = '1.3.3';
                            sectionName = 'Tuberculosis';
                        } else if (itemCode.startsWith('HIV')) {
                            sectionId = '1.3.4';
                            sectionName = 'HIV/AIDS';
                        } else if (itemCode.startsWith('NUT')) {
                            sectionId = '1.3.5';
                            sectionName = 'Nutrition';
                        }
                    } else if (formNumber === '108') {
                        if (itemCode.startsWith('EP')) {
                            sectionId = '1.3.1';
                            sectionName = 'Epidemic-Prone Diseases';
                        }
                    } else if (formNumber.startsWith('2')) {
                        sectionId = '2.0';
                        sectionName = 'MCH Services';
                    } else if (formNumber.startsWith('10')) {
                        sectionId = '10.0';
                        sectionName = 'Laboratory Tests';
                    } else if (formNumber.startsWith('6')) {
                        sectionId = '6.0';
                        sectionName = 'Commodities';
                    }
                }
            }

            // If no section determined from code, try from name
            if (!sectionId && dataElement.name) {
                const name = dataElement.name.toLowerCase();
                if (name.includes('malaria') || name.includes('cholera') || name.includes('measles')) {
                    sectionId = '1.3.1';
                    sectionName = 'Epidemic-Prone Diseases';
                } else if (name.includes('tuberculosis') || name.includes('tb ')) {
                    sectionId = '1.3.3';
                    sectionName = 'Tuberculosis';
                } else if (name.includes('hiv') || name.includes('aids')) {
                    sectionId = '1.3.4';
                    sectionName = 'HIV/AIDS';
                } else if (name.includes('nutrition') || name.includes('malnutrition')) {
                    sectionId = '1.3.5';
                    sectionName = 'Nutrition';
                } else if (name.includes('antenatal') || name.includes('maternity') || name.includes('postnatal')) {
                    sectionId = '2.0';
                    sectionName = 'MCH Services';
                } else if (name.includes('laboratory') || name.includes('test')) {
                    sectionId = '10.0';
                    sectionName = 'Laboratory Tests';
                } else if (name.includes('commodity') || name.includes('stock')) {
                    sectionId = '6.0';
                    sectionName = 'Commodities';
                }
            }

            // Create entries for each category option combo
            optionCombos.forEach(optionCombo => {
                mappingData.push({
                    hmis_id: hmisId++,
                    hmis_code: hmisCode,
                    hmis_name: dataElement.name || '',
                    hmis_section: sectionName,
                    hmis_section_id: sectionId,
                    dhis2_dataElement_id: dataElement.id,
                    dhis2_code: dataElement.code || '',
                    dhis2_name: dataElement.name || '',
                    dhis2_shortName: dataElement.shortName || '',
                    dhis2_dataset: dataset,
                    dhis2_categoryCombo_id: categoryComboId,
                    dhis2_categoryOptionCombo_id: optionCombo.id || '',
                    dhis2_categoryOptionCombo_name: optionCombo.name || ''
                });
            });
        });

        console.log(`Generated ${mappingData.length} mapping records`);

        // Write to CSV
        const csvPath = path.join(__dirname, '../backend/models/dhis2_mapping_details_complete.csv');
        const csvHeader = 'hmis_id,hmis_code,hmis_name,hmis_section,hmis_section_id,dhis2_dataElement_id,dhis2_code,dhis2_name,dhis2_shortName,dhis2_dataset,dhis2_categoryCombo_id,dhis2_categoryOptionCombo_id,dhis2_categoryOptionCombo_name\n';
        
        let csvContent = csvHeader;
        mappingData.forEach(row => {
            const csvRow = [
                row.hmis_id,
                `"${(row.hmis_code || '').replace(/"/g, '""')}"`,
                `"${(row.hmis_name || '').replace(/"/g, '""')}"`,
                `"${(row.hmis_section || '').replace(/"/g, '""')}"`,
                `"${(row.hmis_section_id || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_dataElement_id || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_code || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_name || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_shortName || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_dataset || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_categoryCombo_id || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_categoryOptionCombo_id || '').replace(/"/g, '""')}"`,
                `"${(row.dhis2_categoryOptionCombo_name || '').replace(/"/g, '""')}"`
            ].join(',');
            csvContent += csvRow + '\n';
        });

        fs.writeFileSync(csvPath, csvContent);
        console.log(`Complete CSV written to: ${csvPath}`);
        console.log(`Total records: ${mappingData.length}`);

        // Show section breakdown
        const sectionBreakdown = {};
        mappingData.forEach(row => {
            const section = row.hmis_section_id || 'Unknown';
            sectionBreakdown[section] = (sectionBreakdown[section] || 0) + 1;
        });

        console.log('\nSection breakdown:');
        Object.entries(sectionBreakdown).forEach(([section, count]) => {
            console.log(`  ${section}: ${count} records`);
        });

    } catch (error) {
        console.error('Error fetching DHIS2 data:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

// Run the script
fetchAllDHIS2Data()
    .then(() => {
        console.log('\nDHIS2 data fetch completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });