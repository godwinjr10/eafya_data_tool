import dhis2Api from "../config/dhis2.js";
import fs from "fs";
import path from "path";

/**
 * Script to fetch DHIS2 data elements and update the mapping CSV
 * This will help complete the missing mappings for HMIS 105 form
 */

// HMIS 105 form sections that need mapping
const HMIS_105_SECTIONS = {
  // 1.1 Outpatient Attendance
  OA01: { name: "New attendance", section: "Outpatient Attendance" },
  OA02: { name: "Reattendance", section: "Outpatient Attendance" },

  // 1.2 Outpatient Referrals
  OR01: { name: "Referrals to unit", section: "Outpatient Referrals" },
  OR02: { name: "Referrals from unit", section: "Outpatient Referrals" },

  // 1.3.1 Epidemic-Prone Diseases (already partially mapped)
  EP01a: {
    name: "Suspected Malaria (fever)",
    section: "Epidemic-Prone Diseases",
  },
  EP01b: {
    name: "Malaria Tested (B/s & RDT)",
    section: "Epidemic-Prone Diseases",
  },
  EP01c: {
    name: "Malaria confirmed (B/s & RDT)",
    section: "Epidemic-Prone Diseases",
  },
  EP01d: {
    name: "Confirmed Malaria cases treated",
    section: "Epidemic-Prone Diseases",
  },
  EP01e: {
    name: "Total malaria cases treated",
    section: "Epidemic-Prone Diseases",
  },
  // ... continue with other EP codes

  // 1.3.2 Other Infectious/Communicable Diseases
  CD01: {
    name: "Diarrhoea - Acute",
    section: "Other Infectious/Communicable Diseases",
  },
  CD02: {
    name: "Diarrhoea - Persistent",
    section: "Other Infectious/Communicable Diseases",
  },
  CD03: {
    name: "Urethral discharges",
    section: "Other Infectious/Communicable Diseases",
  },
  // ... continue with other CD codes

  // 1.3.3 Neonatal Diseases
  ND01: { name: "Neonatal Sepsis (0-7days)", section: "Neonatal Diseases" },
  ND02: { name: "Neonatal Sepsis (8-28days)", section: "Neonatal Diseases" },
  // ... continue with other ND codes

  // 1.3.4 Non Communicable Diseases/Conditions
  NC01: { name: "Sickle Cell Anaemia", section: "Non Communicable Diseases" },
  NC02: {
    name: "Other Haemoglobinopathies",
    section: "Non Communicable Diseases",
  },

  // 1.3.5 Oral diseases
  OD01: { name: "Dental Caries", section: "Oral Diseases" },
  OD02: { name: "Gingivitis", section: "Oral Diseases" },
  OD03: { name: "HIV-Oral lesions", section: "Oral Diseases" },
  OD04: { name: "Oral Cancers", section: "Oral Diseases" },
  OD05: { name: "Other Oral Conditions", section: "Oral Diseases" },

  // 1.3.6 ENT Conditions
  EN01: { name: "Otitis media acute and chronic", section: "ENT Conditions" },
  EN02: { name: "Mastoiditis", section: "ENT Conditions" },
  EN03: { name: "Hearing loss", section: "ENT Conditions" },
  // ... continue with other EN codes

  // 1.3.7 Eye conditions
  EC01: { name: "Allergic conjunctivitis", section: "Eye Conditions" },
  EC02: { name: "Bacterial Conjunctivitis", section: "Eye Conditions" },
  EC03: { name: "Ophthalmia neonatorum", section: "Eye Conditions" },
  // ... continue with other EC codes

  // 1.3.8 Mental Health
  MH05: { name: "Brief Psychotic Disorder", section: "Mental Health" },
  MH07: { name: "Schizophrenia", section: "Mental Health" },
  MH08: { name: "Bipolar Affective Disorder", section: "Mental Health" },
  MH09: { name: "Major Depressive Disorder", section: "Mental Health" },
  MH10: { name: "Anxiety - Phobic Disorders", section: "Mental Health" },
  MH11: { name: "Anxiety -Social anxiety Disoders", section: "Mental Health" },
  MH12: { name: "Anxiety - Panic Disorder", section: "Mental Health" },
  MH13: {
    name: "Anxiety - Generalized anxiety Disorder",
    section: "Mental Health",
  },
  MH26: { name: "Alcohol Use Disorders", section: "Mental Health" },
  MH33: { name: "Epilepsy", section: "Mental Health" },
  MH45: { name: "Other Childhood Mental Disorders", section: "Mental Health" },
  MH46: { name: "Other Adult Mental Disorders", section: "Mental Health" },

  // 1.3.9 Neurological Disorders
  NE03: { name: "Parkinson's disease", section: "Neurological Disorders" },
  NE04: { name: "Dementia", section: "Neurological Disorders" },
  NE07: {
    name: "Persons in Coma / Emergency Care",
    section: "Neurological Disorders",
  },
  NE08: { name: "Down Syndrome (DS)", section: "Neurological Disorders" },
  NE09: { name: "CP/PMLD", section: "Neurological Disorders" },
  NE11: { name: "Learning Disability", section: "Neurological Disorders" },
  NE12: {
    name: "Eating disorders (anorexia, Bulimia, other feeding)",
    section: "Neurological Disorders",
  },
  NE15: { name: "Others", section: "Neurological Disorders" },

  // 1.3.10 Chronic respiratory diseases
  CR01: { name: "Asthma", section: "Chronic Respiratory Diseases" },
  CR02: {
    name: "Chronic Obstructive Pulmonary Disease (COPD)",
    section: "Chronic Respiratory Diseases",
  },
  CR03: {
    name: "Other Chronic Respiratory diseases",
    section: "Chronic Respiratory Diseases",
  },

  // 1.3.11 Cancers
  CA01: { name: "Cervical Cancer", section: "Cancers" },
  CA02: { name: "Prostate Cancer", section: "Cancers" },
  CA03: { name: "Breast Cancer", section: "Cancers" },
  CA04: { name: "Lung Cancer", section: "Cancers" },
  CA05: { name: "Liver Cancer", section: "Cancers" },
  CA07: { name: "Colon Cancer", section: "Cancers" },
  CA08: { name: "Kaposis Sarcoma", section: "Cancers" },
  CA19: { name: "Other Cancers", section: "Cancers" },

  // 1.3.12 Palliative Care
  PC01: {
    name: "No. of patients that need palliative care",
    section: "Palliative Care",
  },
  PC02: {
    name: "No. of new patients that received palliative care during the month",
    section: "Palliative Care",
  },
  PC03: {
    name: "No. of patients that received palliative care during the month",
    section: "Palliative Care",
  },
  PC04: {
    name: "No. of patients that received palliative care with a documented WHO performance status during the month",
    section: "Palliative Care",
  },
  PC05: {
    name: "No. of patients that received palliative care and are on oral liquid morphine",
    section: "Palliative Care",
  },
  PC06: {
    name: "No. of patients on palliative care who died during the month",
    section: "Palliative Care",
  },

  // 1.3.14 Disabilities
  DS01: {
    name: "Individuals with Difficulty in seeing",
    section: "Disabilities",
  },
  DS02: { name: "Individuals with Albinism", section: "Disabilities" },
  DS03: {
    name: "Individuals with Difficulty in hearing",
    section: "Disabilities",
  },
  DS04: {
    name: "Individuals with Speech Difficulties",
    section: "Disabilities",
  },
  DS05: {
    name: "Individuals with delayed age specific motor development",
    section: "Disabilities",
  },
  DS06: { name: "Individuals with Dwarfism", section: "Disabilities" },
  DS07: {
    name: "Individuals with Difficulty understanding",
    section: "Disabilities",
  },
  DS08: {
    name: "Individuals with Difficulty in remembering",
    section: "Disabilities",
  },
  DS09: {
    name: "Individuals with Difficulty in reading",
    section: "Disabilities",
  },
  DS10: {
    name: "Individuals with Difficulty in writing",
    section: "Disabilities",
  },
  DS11: {
    name: "Individuals with Difficulty in self-care",
    section: "Disabilities",
  },
  DS12: {
    name: "Individuals with Mentally impairment",
    section: "Disabilities",
  },
  DS13: {
    name: "Individuals with Emotionally impairment",
    section: "Disabilities",
  },

  // 1.3.15 Cardiovascular diseases
  CV01: {
    name: "Stroke/ CardiovascularAccident(CVA)",
    section: "Cardiovascular Diseases",
  },
  CV02: { name: "Hypertension", section: "Cardiovascular Diseases" },
  CV03: { name: "Heart failure", section: "Cardiovascular Diseases" },
  CV04: { name: "Ischemic Heart Diseases", section: "Cardiovascular Diseases" },
  CV05: {
    name: "Rheumatic Heart Diseases",
    section: "Cardiovascular Diseases",
  },
  CV06: {
    name: "Congenital Heart Diseases",
    section: "Cardiovascular Diseases",
  },
  CV07: {
    name: "Other Cardiovascular Diseases",
    section: "Cardiovascular Diseases",
  },

  // 1.3.16 Renal Diseases
  RD01: { name: "Acute Kidney Injury", section: "Renal Diseases" },
  RD02: { name: "Acute glomerulonephritis", section: "Renal Diseases" },
  RD03: { name: "Nephrotic syndrome", section: "Renal Diseases" },
  RD08: { name: "Uncomplicated UTI", section: "Renal Diseases" },
  RD09: { name: "Complicated UTI", section: "Renal Diseases" },

  // 1.3.17 Liver Diseases
  LD01: { name: "Liver Cirrhosis", section: "Liver Diseases" },
  LD02: { name: "Liver Abcess", section: "Liver Diseases" },
  LD06: { name: "Hepatitis A", section: "Liver Diseases" },
  LD07: { name: "Hepatitis B", section: "Liver Diseases" },
  LD08: { name: "Hepatitis C", section: "Liver Diseases" },
  LD09: { name: "Hepatitis D", section: "Liver Diseases" },
  LD10: { name: "Hepatitis E", section: "Liver Diseases" },

  // 1.3.18 Endocrine and Metabolic Disorders
  EM01: {
    name: "Diabetes mellitus",
    section: "Endocrine and Metabolic Disorders",
  },
  EM02: {
    name: "Thyroid Disease",
    section: "Endocrine and Metabolic Disorders",
  },
  EM03: {
    name: "Other Endocrine and Metabolic Diseases",
    section: "Endocrine and Metabolic Disorders",
  },

  // 1.3.19 Injuries
  IN01: { name: "Jaw injuries", section: "Injuries" },
  IN02: { name: "Injuries due to Gender based violence", section: "Injuries" },
  IN03: { name: "Injuries (Trauma due to other causes)", section: "Injuries" },
  IN04: { name: "Animal bites", section: "Injuries" },
  IN05: { name: "Snake bites", section: "Injuries" },
  IN06: { name: "Insect bites", section: "Injuries" },

  // 1.3.20 Minor Operations in OPD
  MN01: { name: "Tooth extractions", section: "Minor Operations in OPD" },
  MN02: { name: "Dental Fillings", section: "Minor Operations in OPD" },
  MN03: { name: "Other Minor Operations", section: "Minor Operations in OPD" },

  // 1.3.21 Neglected Tropical Diseases (NTDs)
  NT01: { name: "Leishmaniasis", section: "Neglected Tropical Diseases" },
  NT02: {
    name: "Lymphatic Filariasis (hydrocele)",
    section: "Neglected Tropical Diseases",
  },
  NT03: {
    name: "Lymphatic Filariasis (Lympoedema)",
    section: "Neglected Tropical Diseases",
  },
  NT04: {
    name: "Urinary Schistosomiasis",
    section: "Neglected Tropical Diseases",
  },
  NT05: {
    name: "Intestinal Schistosomiasis",
    section: "Neglected Tropical Diseases",
  },
  NT06: { name: "Onchocerciasis", section: "Neglected Tropical Diseases" },

  // 1.3.22 Maternal conditions
  MC01: {
    name: "Abortions due to Gender-Based Violence (GBV)",
    section: "Maternal Conditions",
  },
  MC02: {
    name: "Abortions due to other causes",
    section: "Maternal Conditions",
  },
  MC03: { name: "Malaria in pregnancy", section: "Maternal Conditions" },
  MC04: {
    name: "High blood pressure in pregnancy",
    section: "Maternal Conditions",
  },
  MC05: { name: "Diabetes in Pregnancy", section: "Maternal Conditions" },
  MC06: { name: "Obstructed labour", section: "Maternal Conditions" },
  MC07: { name: "Puerperal sepsis", section: "Maternal Conditions" },
  MC08: {
    name: "Psychosis of Postpartum onset",
    section: "Maternal Conditions",
  },
  MC09: {
    name: "Post Traumatic Stress Disorder of Postpartum onset",
    section: "Maternal Conditions",
  },
  MC10: {
    name: "Haemorrhage related to pregnancy (APH)",
    section: "Maternal Conditions",
  },
  MC11: {
    name: "Haemorrhage related to pregnancy (PPH)",
    section: "Maternal Conditions",
  },
  MC12: { name: "Breast cancer", section: "Maternal Conditions" },
  MC13: { name: "Cervical cancer", section: "Maternal Conditions" },

  // 1.3.23 Other OPD conditions
  OP01: { name: "All others", section: "Other OPD Conditions" },

  // 1.3.24 Deaths in OPD
  DT01: { name: "Deaths in OPD", section: "Deaths in OPD" },

  // 1.3.25 Emergency Medical Services
  ES01: {
    name: "No. of emergency cases at the facility",
    section: "Emergency Medical Services",
  },
  ES02: {
    name: "No. of Patients that received care at the scene of emergency",
    section: "Emergency Medical Services",
  },
  ES03: {
    name: "No. of emergency cases that arrived at the facility by",
    section: "Emergency Medical Services",
  },
  ES04: {
    name: "No. of patients accessing care within 1hr in an emergency unit",
    section: "Emergency Medical Services",
  },
  ES05: {
    name: "No. of patients who developed complications within 24 hours of care",
    section: "Emergency Medical Services",
  },
  ES06: {
    name: "No of patients with hypoxemia",
    section: "Emergency Medical Services",
  },
  ES07: {
    name: "No. of patients with external haemorrhages",
    section: "Emergency Medical Services",
  },
  ES08: {
    name: "Road Traffic Injuries",
    section: "Emergency Medical Services",
  },
  ES09: {
    name: "No. of deaths at the emergency unit",
    section: "Emergency Medical Services",
  },
  ES10: {
    name: "No. of Patients who received vaccination for",
    section: "Emergency Medical Services",
  },

  // 1.3.26 TB Screening
  TP01: { name: "No. screened for TB", section: "TB Screening" },
  TP02: { name: "No. screened for TB", section: "TB Screening" },
  TP03: { name: "No. screened for TB", section: "TB Screening" },
  TP04: {
    name: "New and relapse leprosy cases registered",
    section: "TB Screening",
  },

  // 1.3.26 Nutrition Services
  NA01: {
    name: "Total assessed for nutrition status",
    section: "Nutrition Services",
  },
  NA02: { name: "No. of SAM clients in OTC", section: "Nutrition Services" },
  NA03: {
    name: "No. of clients with SAM admitted into OTC",
    section: "Nutrition Services",
  },
  NA04: {
    name: "Total number of days spent at OTC for all clients discharged as cured",
    section: "Nutrition Services",
  },
  NA05: {
    name: "No. of MAM Clients in SFC this month",
    section: "Nutrition Services",
  },
  NA06: {
    name: "No. of clients with MAM admitted into SFC",
    section: "Nutrition Services",
  },
  NA07: {
    name: "Total number of days spent at SFC for all clients discharged as cured",
    section: "Nutrition Services",
  },

  // 1.3.29 Gender Based Violence Services
  GBV01: {
    name: "No. of clients Receiving post GBV clinical care based on minimum package disagregated by violence type",
    section: "Gender Based Violence Services",
  },
  GBV02: {
    name: "No.SGBV survivors eligible for PEP",
    section: "Gender Based Violence Services",
  },
  GBV03: {
    name: "No.SGBV survivors ntiated on PEP",
    section: "Gender Based Violence Services",
  },
  GBV04: {
    name: "No. SGBV survivors who completed the PEP dose",
    section: "Gender Based Violence Services",
  },
  GBV05: {
    name: "No. SGBV survivors who initiated PEP with edocumented out come",
    section: "Gender Based Violence Services",
  },
};

// Age/Gender categories for DHIS2
const AGE_GENDER_CATEGORIES = [
  { code: "0-28Dys_Male", name: "0-28Dys, Male" },
  { code: "0-28Dys_Female", name: "0-28Dys, Female" },
  { code: "29Dys-4Yrs_Male", name: "29 days - 4 yrs, Male" },
  { code: "29Dys-4Yrs_Female", name: "29 days - 4 yrs, Female" },
  { code: "5-9Yrs_Male", name: "5 - 9 yrs, Male" },
  { code: "5-9Yrs_Female", name: "5 - 9 yrs, Female" },
  { code: "10-19Yrs_Male", name: "10 - 19 yrs, Male" },
  { code: "10-19Yrs_Female", name: "10 - 19 yrs, Female" },
  { code: "20+Yrs_Male", name: "20+ yrs, Male" },
  { code: "20+Yrs_Female", name: "20+ yrs, Female" },
];

async function fetchDataElements() {
  try {
    console.log("Fetching DHIS2 data elements...");

    // Fetch data elements from DHIS2
    const response = await dhis2Api.get("/dataElements", {
      params: {
        fields:
          "id,code,name,shortName,domainType,valueType,categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id,name]]]",
        paging: false,
        filter: "domainType:eq:AGGREGATE",
      },
    });

    console.log(`Found ${response.data.dataElements.length} data elements`);
    return response.data.dataElements;
  } catch (error) {
    console.error("Error fetching data elements:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return [];
  }
}

async function fetchDataSets() {
  try {
    console.log("Fetching DHIS2 datasets...");

    const response = await dhis2Api.get("/dataSets", {
      params: {
        fields:
          "id,code,name,shortName,dataSetElements[dataElement[id,code,name]]",
        paging: false,
        filter: "name:ilike:105", // Filter for HMIS 105 related datasets
      },
    });

    console.log(`Found ${response.data.dataSets.length} datasets`);
    return response.data.dataSets;
  } catch (error) {
    console.error("Error fetching datasets:", error.message);
    return [];
  }
}

function findMatchingDataElement(dataElements, hmisCode, hmisName) {
  // Try to find matching data element by code or name
  const codeMatch = dataElements.find(
    (de) =>
      de.code &&
      (de.code.includes(hmisCode) ||
        de.code.includes(`105-${hmisCode}`) ||
        de.code.includes(hmisCode.replace(/\d+/, "")))
  );

  if (codeMatch) return codeMatch;

  // Try name matching
  const nameMatch = dataElements.find(
    (de) =>
      de.name &&
      (de.name.toLowerCase().includes(hmisName.toLowerCase()) ||
        hmisName.toLowerCase().includes(de.name.toLowerCase().split(" ")[0]))
  );

  return nameMatch;
}

async function generateMappings() {
  try {
    console.log("Starting DHIS2 mapping generation...");

    // Fetch data from DHIS2
    const [dataElements, dataSets] = await Promise.all([
      fetchDataElements(),
      fetchDataSets(),
    ]);

    if (dataElements.length === 0) {
      throw new Error("No data elements fetched from DHIS2");
    }

    // Read existing CSV to avoid duplicates
    const csvPath = path.join(
      process.cwd(),
      "backend/routes/mappings/dhis2_mapping_details.csv"
    );
    let existingMappings = new Set();

    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, "utf8");
      const lines = csvContent.split("\n");
      lines.forEach((line, index) => {
        if (index > 0 && line.trim()) {
          // Skip header
          const columns = line.split(",");
          if (columns.length > 1) {
            existingMappings.add(columns[1]); // hmis_code column
          }
        }
      });
    }

    console.log(`Found ${existingMappings.size} existing mappings`);

    // Generate new mappings
    const newMappings = [];
    let mappingId = 1000; // Start from 1000 to avoid conflicts

    Object.entries(HMIS_105_SECTIONS).forEach(([hmisCode, hmisData]) => {
      if (existingMappings.has(hmisCode)) {
        console.log(`Skipping existing mapping for ${hmisCode}`);
        return;
      }

      // Find matching DHIS2 data element
      const matchingElement = findMatchingDataElement(
        dataElements,
        hmisCode,
        hmisData.name
      );

      if (matchingElement) {
        console.log(`Found match for ${hmisCode}: ${matchingElement.name}`);

        // Get category option combos
        const categoryCombo = matchingElement.categoryCombo;
        const categoryOptionCombos = categoryCombo?.categoryOptionCombos || [];

        if (categoryOptionCombos.length > 0) {
          // Create mapping for each category option combo
          categoryOptionCombos.forEach((coc) => {
            newMappings.push({
              hmis_id: mappingId++,
              hmis_code: hmisCode,
              hmis_name: hmisData.name,
              hmis_section: hmisData.section,
              hmis_section_id: getSectionId(hmisData.section),
              dhis2_dataElement_id: matchingElement.id,
              dhis2_code: matchingElement.code || `105-${hmisCode}`,
              dhis2_name: matchingElement.name,
              dhis2_shortName:
                matchingElement.shortName || matchingElement.name,
              dhis2_dataset: getDatasetName(dataSets, matchingElement.id),
              dhis2_categoryCombo_id: categoryCombo?.id || "",
              dhis2_categoryOptionCombo_id: coc.id,
              dhis2_categoryOptionCombo_name: coc.name,
            });
          });
        } else {
          // No category option combos, create single mapping
          newMappings.push({
            hmis_id: mappingId++,
            hmis_code: hmisCode,
            hmis_name: hmisData.name,
            hmis_section: hmisData.section,
            hmis_section_id: getSectionId(hmisData.section),
            dhis2_dataElement_id: matchingElement.id,
            dhis2_code: matchingElement.code || `105-${hmisCode}`,
            dhis2_name: matchingElement.name,
            dhis2_shortName: matchingElement.shortName || matchingElement.name,
            dhis2_dataset: getDatasetName(dataSets, matchingElement.id),
            dhis2_categoryCombo_id: categoryCombo?.id || "",
            dhis2_categoryOptionCombo_id: "",
            dhis2_categoryOptionCombo_name: "default",
          });
        }
      } else {
        console.warn(`No DHIS2 match found for ${hmisCode}: ${hmisData.name}`);

        // Create placeholder mapping for manual review
        newMappings.push({
          hmis_id: mappingId++,
          hmis_code: hmisCode,
          hmis_name: hmisData.name,
          hmis_section: hmisData.section,
          hmis_section_id: getSectionId(hmisData.section),
          dhis2_dataElement_id: "NEEDS_MANUAL_MAPPING",
          dhis2_code: `105-${hmisCode}`,
          dhis2_name: `105-${hmisCode}. ${hmisData.name}`,
          dhis2_shortName: `105-${hmisCode}. ${hmisData.name}`,
          dhis2_dataset: "HMIS 105:01 - OPD Monthly Report",
          dhis2_categoryCombo_id: "esaNB4G5AHs",
          dhis2_categoryOptionCombo_id: "NEEDS_MANUAL_MAPPING",
          dhis2_categoryOptionCombo_name: "0-28Dys, Female",
        });
      }
    });

    return newMappings;
  } catch (error) {
    console.error("Error generating mappings:", error);
    return [];
  }
}

function getSectionId(sectionName) {
  const sectionMap = {
    "Outpatient Attendance": "1.1",
    "Outpatient Referrals": "1.2",
    "Epidemic-Prone Diseases": "1.3.1",
    "Other Infectious/Communicable Diseases": "1.3.2",
    "Neonatal Diseases": "1.3.3",
    "Non Communicable Diseases": "1.3.4",
    "Oral Diseases": "1.3.5",
    "ENT Conditions": "1.3.6",
    "Eye Conditions": "1.3.7",
    "Mental Health": "1.3.8",
    "Neurological Disorders": "1.3.9",
    "Chronic Respiratory Diseases": "1.3.10",
    Cancers: "1.3.11",
    "Palliative Care": "1.3.12",
    Disabilities: "1.3.14",
    "Cardiovascular Diseases": "1.3.15",
    "Renal Diseases": "1.3.16",
    "Liver Diseases": "1.3.17",
    "Endocrine and Metabolic Disorders": "1.3.18",
    Injuries: "1.3.19",
    "Minor Operations in OPD": "1.3.20",
    "Neglected Tropical Diseases": "1.3.21",
    "Maternal Conditions": "1.3.22",
    "Other OPD Conditions": "1.3.23",
    "Deaths in OPD": "1.3.24",
    "Emergency Medical Services": "1.3.25",
    "TB Screening": "1.3.26",
    "Nutrition Services": "1.3.26",
    "Gender Based Violence Services": "1.3.29",
  };

  return sectionMap[sectionName] || "1.3.x";
}

function getDatasetName(dataSets, dataElementId) {
  const dataset = dataSets.find((ds) =>
    ds.dataSetElements?.some((dse) => dse.dataElement.id === dataElementId)
  );

  return dataset
    ? dataset.name
    : "HMIS 105:01 - OPD Monthly Report (Attendance, Referrals, Conditions,TB, Nutrition)";
}

async function appendToCSV(newMappings) {
  if (newMappings.length === 0) {
    console.log("No new mappings to append");
    return;
  }

  const csvPath = path.join(
    process.cwd(),
    "backend/routes/mappings/dhis2_mapping_details.csv"
  );

  // Convert mappings to CSV format
  const csvRows = newMappings.map(
    (mapping) =>
      `${mapping.hmis_id},${mapping.hmis_code},"${mapping.hmis_name}","${mapping.hmis_section}",${mapping.hmis_section_id},${mapping.dhis2_dataElement_id},${mapping.dhis2_code},"${mapping.dhis2_name}","${mapping.dhis2_shortName}","${mapping.dhis2_dataset}",${mapping.dhis2_categoryCombo_id},${mapping.dhis2_categoryOptionCombo_id},"${mapping.dhis2_categoryOptionCombo_name}"`
  );

  // Append to existing CSV
  const csvContent = "\n" + csvRows.join("\n");
  fs.appendFileSync(csvPath, csvContent, "utf8");

  console.log(`Appended ${newMappings.length} new mappings to CSV`);

  // Also create a backup with timestamp
  const backupPath = csvPath.replace(".csv", `_backup_${Date.now()}.csv`);
  fs.copyFileSync(csvPath, backupPath);
  console.log(`Backup created: ${backupPath}`);
}

// Main execution
async function main() {
  try {
    console.log("🚀 Starting DHIS2 mapping update process...\n");

    // Test DHIS2 connection first
    try {
      const testResponse = await dhis2Api.get("/me");
      console.log(`✅ Connected to DHIS2 as: ${testResponse.data.name}\n`);
    } catch (error) {
      console.error("❌ Failed to connect to DHIS2:", error.message);
      process.exit(1);
    }

    // Generate new mappings
    const newMappings = await generateMappings();

    console.log(`\n📊 Generated ${newMappings.length} new mappings`);

    if (newMappings.length > 0) {
      // Show summary
      const mappedCount = newMappings.filter(
        (m) => m.dhis2_dataElement_id !== "NEEDS_MANUAL_MAPPING"
      ).length;
      const unmappedCount = newMappings.length - mappedCount;

      console.log(`✅ Successfully mapped: ${mappedCount}`);
      console.log(`⚠️  Need manual mapping: ${unmappedCount}`);

      // Append to CSV
      await appendToCSV(newMappings);

      console.log("\n🎉 Mapping update completed successfully!");
      console.log("\n📝 Next steps:");
      console.log("1. Review the updated CSV file");
      console.log(
        '2. Manually map any elements marked as "NEEDS_MANUAL_MAPPING"'
      );
      console.log("3. Validate mappings against your DHIS2 instance");
    } else {
      console.log("ℹ️  No new mappings needed - all HMIS codes already mapped");
    }
  } catch (error) {
    console.error("💥 Error in main process:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateMappings, fetchDataElements, fetchDataSets };

