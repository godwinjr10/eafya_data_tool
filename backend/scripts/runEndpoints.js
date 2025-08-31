import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the datasets data
import datasets from './datasets.js';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust this to your backend URL

async function addDatasets() {
  try {
    console.log('🚀 Starting to add datasets...');
    console.log(`📊 Found ${datasets.length} datasets to add`);

    // Make POST request to bulk create datasets
    const response = await fetch(`${API_BASE_URL}/datasets/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datasets)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ Successfully added datasets!');
    console.log(`📈 Added ${result.length} datasets:`);
    
    result.forEach((dataset, index) => {
      console.log(`  ${index + 1}. ${dataset.dataset_name} (${dataset.dataset_id})`);
      console.log(`     Sections: ${dataset.sections.length}`);
    });

  } catch (error) {
    console.error('❌ Error adding datasets:', error.message);
    process.exit(1);
  }
}

// Run the script
addDatasets();