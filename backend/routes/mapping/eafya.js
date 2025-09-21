import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

router.get("/commodities", async (req, res) => {
  try {
    const query = `
                SELECT 
            distinct hmis_code,
            section_id, 
            section_name,
            hmis_name
            FROM reporting.dhis_eafya_mapping_commodities
            order by hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const query = `
            SELECT 
                s.id,
                s."name"
            FROM dwh.dim_eafya_product s
            WHERE s.product_type = 'drug'
            ORDER BY s."name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific commodity mapping
router.delete("/commodities", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_commodities WHERE eafya_product_id = $1",
      [eafya_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Commodity mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting commodity mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/labtests", async (req, res) => {
  try {
    const query = `
        SELECT 
          
            distinct hmis_code, 
            hmis_name, 
              _section_id, 
              section_name,
              category
            FROM reporting.dhis_eafya_mapping_labtests
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/lab", async (req, res) => {
  try {
    const query = `
            SELECT 
                distinct id, 
                "name"
            FROM dwh.dim_eafya_lab_test
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific lab test mapping
router.delete("/labtests", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting lab test mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_labtests WHERE eafya_labtest_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Lab test mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab test mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get family planning mappings
router.get("/familyplanning", async (req, res) => {
  try {
    const query = `
        SELECT 
           distinct hmis_code,
            hmis_name,
            _section_id, 
            section_name
        FROM reporting.dhis_eafya_mapping_familyplanning
        ORDER BY hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get family planning items for mapping
router.get("/familyplanning-items", async (req, res) => {
  try {
    const query = `
            SELECT 
               distinct id, 
                "name"
            FROM dwh.dim_eafya_family_planning
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific family planning mapping
router.delete("/familyplanning", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting family planning mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_familyplanning WHERE eafya_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Family planning mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting family planning mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get vaccines mappings
router.get("/vaccines", async (req, res) => {
  try {
    const query = `
        SELECT 
            
            distinct hmis_code,
            hmis_name,
              _section_id,
            section_name
        FROM reporting.dhis_eafya_mapping_vaccines
        ORDER BY hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vaccine items for mapping
router.get("/vaccine-items", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_vaccine
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific vaccine mapping
router.delete("/vaccines", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting vaccine mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_vaccines WHERE eafya_vaccine_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Vaccine mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting vaccine mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get conditions mappings
router.get("/conditions", async (req, res) => {
  try {
    const query = `
      select 
       distinct  hmis_code, 
       hmis_name,  
       section_id, 
       section_name
      FROM reporting.dhis_eafya_mapping_conditions_final
        ORDER BY hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get disease items for mapping
router.get("/disease-items", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_disease
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific condition mapping
router.delete("/conditions", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting condition mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_conditions_final WHERE eafya_disease_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Condition mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting condition mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get procedures mappings
router.get("/procedures", async (req, res) => {
  try {
    const query = `
      select 
        id,
        hmis_code, 
        SUBSTRING(hmis_name FROM 6) AS hmis_name,
        section_id, 
        section_name
      FROM reporting.dhis2_dataelements_108_procedures
      ORDER BY section_id
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get procedures  items for mapping
router.get("/procedures-items", async (req, res) => {
  try {
    const query = `
            SELECT 
              id, 
              major_theater_name as name
            FROM dwh.dim_eafya_major_theatre;
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific procedures  mapping
router.delete("/procedures", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting condition mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis2_dataelements_108_procedures WHERE eafya_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Condition mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting condition mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get Imaging mappings
router.get("/imaging", async (req, res) => {
  try {
    const query = `
      select 
        id,
        hmis_code, 
        SUBSTRING(hmis_name FROM 6) AS hmis_name,
        section_id, 
        section_name
      FROM reporting.dhis2_dataelements_108_imaging
      ORDER BY section_id
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Imaging items for mapping
router.get("/imaging-items", async (req, res) => {
  try {
    const query = `
            SELECT 
              id, 
              "name",
              imaging_category_id, 
            FROM dwh.dim_eafya_imaging;
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific condition mapping
router.delete("/imaging", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting condition mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis2_dataelements_108_imaging WHERE eafya_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Condition mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting condition mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

//For creating the mappings

router.post("/commodities", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA products
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch ALL distinct DHIS2 data elements for the given hmis_code and section_id
    const queryExisting = `
              SELECT 
                  DISTINCT   
                  dhis2_data_element_id, 
                  data_element_name,
                  section_id, 
                  section_name,
                  hmis_code,
                  hmis_name
              FROM reporting.dhis_eafya_mapping_commodities
              WHERE hmis_code = $1 AND section_id = $2
              AND dhis2_data_element_id IS NOT NULL
              ORDER BY dhis2_data_element_id
          `;

    console.log("Executing query with params:", [hmis_code, section_id]);
    const { rows } = await pool.query(queryExisting, [hmis_code, section_id]);

    console.log("Raw query result:", JSON.stringify(rows, null, 2));
    console.log(`Found ${rows.length} distinct DHIS2 data elements`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing DHIS2 data elements found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      console.log(
        `Found ${rows.length} DHIS2 data elements for HMIS code ${hmis_code}, section ${section_id}`
      );
      console.log(`Will create mappings for ${mappings.length} eAFYA products`);

      let totalInserted = 0;

      // Outer loop: For each DHIS2 data element found
      for (let i = 0; i < rows.length; i++) {
        const dhis2Element = rows[i];
        console.log(
          `Processing DHIS2 element ${i + 1}/${rows.length}: ${
            dhis2Element.dhis2_data_element_id
          }`
        );

        // Inner loop: For each eAFYA product mapping
        for (let j = 0; j < mappings.length; j++) {
          const eafyaProduct = mappings[j];
          console.log(
            `  - Mapping eAFYA product ${j + 1}/${mappings.length}: ${
              eafyaProduct.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_commodities (
                              section_id,
                              hmis_code,
                              hmis_name,
                              eafya_product_id,
                              eafya_product_name,
                              dhis2_data_element_id,
                              data_element_name
                          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              dhis2Element.section_id,
              dhis2Element.hmis_code,
              dhis2Element.hmis_name,
              eafyaProduct.id,
              eafyaProduct.name || null,
              dhis2Element.dhis2_data_element_id,
              dhis2Element.data_element_name,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Commodity mappings saved successfully",
        count: totalInserted,
        details: {
          dhis2_data_elements: rows.length,
          eafya_products: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} DHIS2 elements × ${mappings.length} eAFYA products = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving commodity mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create one or more lab test mappings
router.post("/labtests", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA lab tests
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch existing lab test data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          _section_id,
          category,
          hmis_code,
          hmis_name,
          dhis2_data_element_id
        FROM reporting.dhis_eafya_mapping_labtests
        WHERE hmis_code = $1 AND _section_id = $2
        AND dhis2_data_element_id IS NOT NULL
        ORDER BY dhis2_data_element_id
      `;

    console.log("Executing labtests query with params:", [
      hmis_code,
      section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code, section_id]);

    console.log(`Found ${rows.length} distinct lab test entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing lab test data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing lab test entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(
          `Processing lab test entry ${i + 1}/${rows.length}: ${
            existingData.dhis2_data_element_id
          }`
        );

        // Inner loop: For each eAFYA lab test mapping
        for (let j = 0; j < mappings.length; j++) {
          const eafyaTest = mappings[j];
          console.log(
            `  - Mapping eAFYA test ${j + 1}/${mappings.length}: ${
              eafyaTest.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_labtests (
                _section_id,
                category,
                hmis_code,
                hmis_name,
                eafya_labtest_id,
                eafya_labtest_name,
                dhis2_data_element_id
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              existingData._section_id,
              existingData.category,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaTest.id,
              eafyaTest.name || null,
              existingData.dhis2_data_element_id,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total lab test mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Lab test mappings saved successfully",
        count: totalInserted,
        details: {
          lab_test_entries: rows.length,
          eafya_tests: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} lab test entries × ${mappings.length} eAFYA tests = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving lab test mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create one or more family planning mappings
router.post("/familyplanning", async (req, res) => {
  try {
    const {
      _section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA family planning items
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !_section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch existing family planning data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          _section_id,
          section_name,
          hmis_code,
          hmis_name,
          categoryoptioncombo_name
        FROM reporting.dhis_eafya_mapping_familyplanning
        WHERE hmis_code = $1 
        ORDER BY categoryoptioncombo_name
      `;

    console.log("Executing familyplanning query with params:", [
      hmis_code,
      _section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code]);

    console.log(`Found ${rows.length} distinct family planning entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing family planning data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing family planning entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(`Processing family planning entry ${i + 1}/${rows.length}`);

        // Inner loop: For each eAFYA family planning item
        for (let j = 0; j < mappings.length; j++) {
          const eafyaItem = mappings[j];
          console.log(
            `  - Mapping eAFYA item ${j + 1}/${mappings.length}: ${
              eafyaItem.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_familyplanning (
                _section_id,
                section_name,
                hmis_code,
                hmis_name,
                eafya_id,
                eafya_name,
                categoryoptioncombo_name
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              existingData._section_id,
              existingData.section_name,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaItem.id,
              eafyaItem.name || null,
              existingData.categoryoptioncombo_name,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total family planning mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Family planning mappings saved successfully",
        count: totalInserted,
        details: {
          family_planning_entries: rows.length,
          eafya_items: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} family planning entries × ${mappings.length} eAFYA items = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving family planning mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create one or more vaccine mappings
router.post("/vaccines", async (req, res) => {
  try {
    const {
      _section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA vaccines
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !_section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch existing vaccine data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          _section_id,
          section_name,
          hmis_code,
          hmis_name
        FROM reporting.dhis_eafya_mapping_vaccines
        WHERE hmis_code = $1 
        ORDER BY hmis_code
      `;

    console.log("Executing vaccines query with params:", [
      hmis_code,
      _section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code]);

    console.log(`Found ${rows.length} distinct vaccine entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing vaccine data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing vaccine entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(`Processing vaccine entry ${i + 1}/${rows.length}`);

        // Inner loop: For each eAFYA vaccine
        for (let j = 0; j < mappings.length; j++) {
          const eafyaVaccine = mappings[j];
          console.log(
            `  - Mapping eAFYA vaccine ${j + 1}/${mappings.length}: ${
              eafyaVaccine.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_vaccines (
                _section_id,
                section_name,
                hmis_code,
                hmis_name,
                eafya_vaccine_id,
                eafya_vaccine_name
              ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              existingData._section_id,
              existingData.section_name,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaVaccine.id,
              eafyaVaccine.name || null,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total vaccine mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Vaccine mappings saved successfully",
        count: totalInserted,
        details: {
          vaccine_entries: rows.length,
          eafya_vaccines: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} vaccine entries × ${mappings.length} eAFYA vaccines = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving vaccine mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create one or more condition mappings
router.post("/conditions", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA diseases
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch existing condition data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          csv_id,
          section_id,
          section_name,
          hmis_code,
          hmis_name,
          data_element_id,
          category_optioncombo_id,
          category_optioncombo_name
        FROM reporting.dhis_eafya_mapping_conditions_final
        WHERE hmis_code ILIKE $1 
        ORDER BY data_element_id
      `;

    console.log("Executing conditions query with params:", [
      hmis_code,
      section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [`%${hmis_code}%`]);

    console.log(`Found ${rows.length} distinct condition entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing condition data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing condition entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(
          `Processing condition entry ${i + 1}/${rows.length}: ${
            existingData.data_element_id
          }`
        );

        // Inner loop: For each eAFYA disease
        for (let j = 0; j < mappings.length; j++) {
          const eafyaDisease = mappings[j];
          console.log(
            `  - Mapping eAFYA disease ${j + 1}/${mappings.length}: ${
              eafyaDisease.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_conditions_final (
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
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              existingData.csv_id,
              existingData.section_id,
              existingData.section_name,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaDisease.id,
              eafyaDisease.name || null,
              existingData.data_element_id,
              existingData.category_optioncombo_id,
              existingData.category_optioncombo_name,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total condition mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Condition mappings saved successfully",
        count: totalInserted,
        details: {
          condition_entries: rows.length,
          eafya_diseases: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} condition entries × ${mappings.length} eAFYA diseases = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving condition mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
