import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// General eAFYA info endpoint
router.get("/", async (req, res) => {
  res.json({
    message: "eAFYA mapping endpoints",
    available_endpoints: [
      "/api/eafya/commodities",
      "/api/eafya/labtests", 
      "/api/eafya/familyplanning",
      "/api/eafya/vaccines",
      "/api/eafya/conditions",
      "/api/eafya/procedures",
      "/api/eafya/imaging",
      "/api/eafya/products"
    ]
  });
});

// Get all mappings for a specific HMIS code across all types
router.get("/all/:hmisCode", async (req, res) => {
  try {
    const { hmisCode } = req.params;

    // Get all mapping types for the HMIS code
    const queries = {
      commodities: `
         SELECT 
           'commodities' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_product_id,
           eafya_product_name,
           dhis2_data_element_id,
           data_element_name,
           unit
         FROM reporting.dhis_eafya_mapping_commodities
         WHERE hmis_code = $1
       `,
      labtests: `
         SELECT 
           'labtests' as mapping_type,
           section_id,
           category as section_name,
           hmis_code,
           hmis_name,
           eafya_labtest_id,
           eafya_labtest_name,
           dhis2_data_element_id
         FROM reporting.dhis_eafya_mapping_labtests
         WHERE hmis_code = $1
       `,
      familyplanning: `
         SELECT 
           'familyplanning' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_id,
           eafya_name,
           categoryoptioncombo_name
         FROM reporting.dhis_eafya_mapping_familyplanning
         WHERE hmis_code = $1
       `,
      vaccines: `
         SELECT 
           'vaccines' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_vaccine_id,
           eafya_vaccine_name
         FROM reporting.dhis_eafya_mapping_vaccines
         WHERE hmis_code = $1
       `,
      conditions: `
         SELECT 
           'conditions' as mapping_type,
           csv_id,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_disease_id,
           eafya_disease_name,
           data_element_id,
           category_optioncombo_id,
           category_optioncombo_name
         FROM reporting.dhis_eafya_mapping_conditions_final
         WHERE hmis_code ILIKE $1
       `,
      procedures: `
         SELECT 
           'procedures' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_id,
           eafya_name
         FROM reporting.dhis2_dataelements_108_procedures
         WHERE hmis_code = $1
       `,
      imaging: `
         SELECT 
           'imaging' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_id,
           eafya_name
         FROM reporting.dhis2_dataelements_108_imaging
         WHERE hmis_code = $1
       `
    };

    const results = {};
    let totalMappings = 0;

    for (const [type, query] of Object.entries(queries)) {
      try {
        const { rows } = await pool.query(query, [hmisCode]);
        results[type] = rows;
        totalMappings += rows.length;
      } catch (error) {
        console.error(`Error fetching ${type} mappings:`, error);
        results[type] = [];
      }
    }

    // Check if any mappings were found
    if (totalMappings === 0) {
      return res.status(404).json({
        message: "No mappings found for this HMIS code",
        hmis_code: hmisCode,
      });
    }

    res.json({
      hmis_code: hmisCode,
      total_mappings: totalMappings,
      mappings_by_type: results,
    });
  } catch (error) {
    console.error("Error fetching all mapping details:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
