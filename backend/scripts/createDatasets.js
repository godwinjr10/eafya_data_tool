import axios from 'axios';

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const datasets = [
    {
        "dataset_id": "HMIS_105_01",
        "dataset_name": "HMIS 105:01 - OPD Monthly Report (Attendances, Referrals, Conditions)",
        "sections": [
            {"section_id": "1.1", "section_name": "Attendance and Referral"},
            {"section_id": "1.3.1", "section_name": "Epidemic Prone Diseases"},
            {"section_id": "1.3.2", "section_name": "Other Infectious / Communicable Diseases"},
            {"section_id": "1.3.3", "section_name": "Neonatal Diseases"},
            {"section_id": "1.3.4", "section_name": "Non-Communicable Diseases"},
            {"section_id": "1.3.5", "section_name": "Oral Diseases"},
            {"section_id": "1.3.6", "section_name": "ENT Conditions"},
            {"section_id": "1.3.7", "section_name": "Eye Conditions"},
            {"section_id": "1.3.8", "section_name": "Mental Health"},
            {"section_id": "1.3.9", "section_name": "Neurological Disorders"},
            {"section_id": "1.3.10", "section_name": "Chronic Respiratory"},
            {"section_id": "1.3.11", "section_name": "Cancers"},
            {"section_id": "1.3.12", "section_name": "Palliative"},
            {"section_id": "1.3.14", "section_name": "Disabilities"},
            {"section_id": "1.3.15", "section_name": "Cardiovascular Diseases"},
            {"section_id": "1.3.16", "section_name": "Renal Diseases"},
            {"section_id": "1.3.17", "section_name": "Liver Diseases"},
            {"section_id": "1.3.18", "section_name": "Endocrine Metabolic Disorders"},
            {"section_id": "1.3.19", "section_name": "Injuries"},
            {"section_id": "1.3.20", "section_name": "Minor Operations OPD"},
            {"section_id": "1.3.21", "section_name": "Neglected Tropical Diseases"},
            {"section_id": "1.3.22", "section_name": "Maternal Conditions"},
            {"section_id": "1.3.24", "section_name": "Deaths in OPD"},
            {"section_id": "1.3.25", "section_name": "Emergency Medical Services"},
            {"section_id": "1.3.26", "section_name": "TB Screening"},
            {"section_id": "1.3.27", "section_name": "Leprosy Services"},
            {"section_id": "1.3.28", "section_name": "Nutrition Services"},
            {"section_id": "1.3.29", "section_name": "Gender Based Violence Services"}
        ]
    },
    {
        "dataset_id": "HMIS_105_02",
        "dataset_name": "HMIS 105:02 - OPD Monthly Report (MCH, FP, EPI)",
        "sections": [
            {"section_id": "2.1", "section_name": "Antenatal"},
            {"section_id": "2.2", "section_name": "Maternity"},
            {"section_id": "2.3", "section_name": "Postnatal"},
            {"section_id": "2.4.1", "section_name": "Family Planning Client Visits"},
            {"section_id": "2.4.2", "section_name": "Contraceptives Dispensed"},
            {"section_id": "2.6", "section_name": "Child Health Services"},
            {"section_id": "2.6.2", "section_name": "Tetanus Vaccination"},
            {"section_id": "2.6.3", "section_name": "Child Immunization"},
            {"section_id": "2.6.4", "section_name": "Vaccine Availability"}
        ]
    },
    {
        "dataset_id": "HMIS_105_06",
        "dataset_name": "HMIS 105:06 - OPD Monthly Report (Essential Medicines)",
        "sections": [
            {"section_id": "6.1", "section_name": "Essential Medicines and Health Supplies"}
        ]
    },
    {
        "dataset_id": "HMIS_105_10",
        "dataset_name": "HMIS 105:10 - OPD Monthly Report (Laboratory)",
        "sections": [
            {"section_id": "10.1", "section_name": "Total Laboratory Client Visits"},
            {"section_id": "10.1.2", "section_name": "Specimen Collected"},
            {"section_id": "10.2.1", "section_name": "Laboratory Routine Tests"}
        ]
    }
];

async function createDatasets() {
    console.log("🚀 Creating datasets...");
    
    try {
        const response = await axios.post(`${API_BASE_URL}/datasets/bulk`, datasets);
        console.log("✅ Datasets created successfully!");
        console.log(`📊 Created ${response.data.length} datasets:`);
        response.data.forEach(dataset => {
            console.log(`   - ${dataset.dataset_id}: ${dataset.dataset_name}`);
        });
        return true;
    } catch (error) {
        console.error("❌ Error creating datasets:", error.response?.data || error.message);
        return false;
    }
}

async function checkServer() {
    try {
        await axios.get(`${API_BASE_URL}/datasets`);
        console.log("✅ Server is running and accessible");
        return true;
    } catch (error) {
        console.error("❌ Server is not accessible. Make sure the backend server is running on port 5000");
        return false;
    }
}

async function main() {
    console.log("🎯 Creating datasets...\n");
    
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.log("\n💡 To start the server, run: npm start or node server.js");
        process.exit(1);
    }
    
    console.log("");
    
    const success = await createDatasets();
    
    if (success) {
        console.log("\n🎉 Datasets created successfully!");
    } else {
        console.log("\n❌ Failed to create datasets. Please check the logs above.");
        process.exit(1);
    }
}

main().catch(error => {
    console.error("💥 Fatal error:", error.message);
    process.exit(1);
});
