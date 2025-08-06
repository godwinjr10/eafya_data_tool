import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get all sections with complete data in one call
router.get("/all-sections", async (req, res) => {
  try {
    const query = `
      SELECT 
        d.hmis_section_id as id,
        d.hmis_section as name,
        COUNT(d.hmis_id) as count,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', d.hmis_id,
              'code', d.hmis_code,
              'name', d.hmis_name,
              'dhis2_id', d.dhis2_data_element_id,
              'dhis2_name', d.dhis2_name,
              'mapping_count', COALESCE(m.mapping_count, 0)
            ) ORDER BY d.hmis_code
          ) FILTER (WHERE d.hmis_id IS NOT NULL),
          '[]'::json
        ) as data
      FROM reporting.dhis2_mapping_details d
      LEFT JOIN (
        SELECT dim_id, COUNT(*) as mapping_count
        FROM reporting.eafya_hmis_mappings
        GROUP BY dim_id
      ) m ON d.hmis_id = m.dim_id
      WHERE d.hmis_section_id IS NOT NULL 
        AND d.hmis_section_id != '' 
        AND d.hmis_section IS NOT NULL 
        AND d.hmis_section != ''
      GROUP BY d.hmis_section_id, d.hmis_section
      ORDER BY d.hmis_section_id
    `;

    const { rows } = await pool.query(query);
    console.log(`Found ${rows.length} sections with complete data`);
    res.json(rows);
  } catch (error) {
    console.error("Database error in /all-sections:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific category sections (conditions, lab tests, commodities)
router.get("/sections/:category", async (req, res) => {
  try {
    const { category } = req.params;
    let whereClause = "";

    switch (category) {
      case "conditions":
        whereClause =
          "AND d.hmis_section_id IN ('1.3.1','1.3.3','1.3.4','1.3.5','1.3.7','1.3.8','1.3.9','1.3.10','1.3.11','1.3.17','1.3.18','1.3.21')";
        break;
      case "labtests":
        whereClause = "AND d.hmis_section_id ILIKE '10.%'";
        break;
      case "commodities":
        whereClause = "AND d.hmis_section_id = '6'";
        break;
      case "vaccines":
        whereClause =
          "AND (d.hmis_section_id ILIKE '7.%' OR d.hmis_section ILIKE '%vaccine%')";
        break;
      case "antenatal":
        whereClause =
          "AND (d.hmis_section_id ILIKE '2.%' OR d.hmis_section ILIKE '%antenatal%' OR d.hmis_section ILIKE '%maternal%')";
        break;
      case "postnatal":
        whereClause =
          "AND (d.hmis_section_id ILIKE '3.%' OR d.hmis_section ILIKE '%postnatal%' OR d.hmis_section ILIKE '%maternal%')";
        break;
      default:
        return res.status(400).json({
          error:
            "Invalid category. Use: conditions, labtests, commodities, vaccines, antenatal, or postnatal",
        });
    }

    const query = `
      SELECT 
        d.hmis_section_id as id,
        d.hmis_section as name,
        COUNT(d.hmis_id) as count,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', d.hmis_id,
              'code', d.hmis_code,
              'name', d.hmis_name,
              'dhis2_id', d.dhis2_data_element_id,
              'dhis2_name', d.dhis2_name,
              'mapping_count', COALESCE(m.mapping_count, 0)
            ) ORDER BY d.hmis_code
          ) FILTER (WHERE d.hmis_id IS NOT NULL),
          '[]'::json
        ) as data
      FROM reporting.dhis2_mapping_details d
      LEFT JOIN (
        SELECT dim_id, COUNT(*) as mapping_count
        FROM reporting.eafya_hmis_mappings
        GROUP BY dim_id
      ) m ON d.hmis_id = m.dim_id
      WHERE d.hmis_section_id IS NOT NULL 
        AND d.hmis_section_id != '' 
        AND d.hmis_section IS NOT NULL 
        AND d.hmis_section != ''
        ${whereClause}
      GROUP BY d.hmis_section_id, d.hmis_section
      ORDER BY d.hmis_section_id
    `;

    const { rows } = await pool.query(query);
    console.log(`Found ${rows.length} ${category} sections with complete data`);
    res.json(rows);
  } catch (error) {
    console.error(`Database error in /sections/${category}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get conditions/items for a specific section
router.get("/sections/:sectionId/conditions", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const query = `
            SELECT 
                hmis_id as id,
                hmis_section_id as section_id, 
                hmis_section as section_name,
                hmis_code, 
                hmis_name
            FROM reporting.dhis2_mapping_details
            WHERE hmis_section_id = $1
            ORDER BY hmis_code
        `;
    const { rows } = await pool.query(query, [sectionId]);
    console.log(`Found ${rows.length} conditions for section ${sectionId}`);
    res.json(rows);
  } catch (error) {
    console.error("Database error in /sections/:sectionId/conditions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get mappings for a specific condition (dim table record)
router.get("/conditions/:conditionId/mappings", async (req, res) => {
  try {
    const { conditionId } = req.params;

    const query = `
            SELECT 
                m.id,
                m.dim_id,
                m.eafya_id,
                m.eafya_name,
                d.hmis_section_id as section_id,
                d.hmis_section as section_name,
                d.hmis_code,
                d.hmis_name,
                m.created_at,
                m.updated_at
            FROM reporting.eafya_hmis_mappings m
            JOIN reporting.dhis2_mapping_details d ON m.dim_id = d.hmis_id
            WHERE m.dim_id = $1
            ORDER BY m.eafya_name
        `;
    const { rows } = await pool.query(query, [conditionId]);
    res.json(rows);
  } catch (error) {
    console.error(
      "Database error in /conditions/:conditionId/mappings:",
      error
    );
    res.status(500).json({ error: error.message });
  }
});

// Add a new mapping between a condition and an EAFYA item
router.post("/conditions/:conditionId/mappings", async (req, res) => {
  try {
    const { conditionId } = req.params;
    const { eafya_id, eafya_name } = req.body;

    console.log("Creating mapping:", { conditionId, eafya_id, eafya_name });

    if (!eafya_id || !eafya_name) {
      console.log("Missing required fields:", { eafya_id, eafya_name });
      return res
        .status(400)
        .json({ error: "eafya_id and eafya_name are required" });
    }

    // Verify the condition exists in dim table
    const dimQuery = `
            SELECT hmis_id, hmis_section, hmis_name 
            FROM reporting.dhis2_mapping_details 
            WHERE hmis_id = $1
        `;
    const { rows: dimRows } = await pool.query(dimQuery, [conditionId]);

    if (dimRows.length === 0) {
      console.log("Condition not found:", conditionId);
      return res
        .status(404)
        .json({ error: "Condition not found in dimension table" });
    }

    console.log("Found condition:", dimRows[0]);

    // Check if mapping already exists
    const duplicateQuery = `
            SELECT COUNT(*) as count
            FROM reporting.eafya_hmis_mappings
            WHERE dim_id = $1 AND eafya_id = $2
        `;
    const { rows: duplicateCheck } = await pool.query(duplicateQuery, [
      conditionId,
      eafya_id,
    ]);

    if (parseInt(duplicateCheck[0].count) > 0) {
      console.log("Duplicate mapping found");
      return res.status(409).json({
        error: "Mapping already exists for this condition and EAFYA item",
      });
    }

    // Import the model
    const EafyaHmisMapping = (await import("../../models/eafyaHmisMapping.js"))
      .default;

    // Insert new mapping using Sequelize model
    const newMapping = await EafyaHmisMapping.create({
      dim_id: conditionId,
      eafya_id: eafya_id,
      eafya_name: eafya_name,
    });
    console.log("Mapping created successfully:", newMapping);

    res.status(201).json({
      id: newMapping.id,
      dim_id: newMapping.dim_id,
      eafya_id: newMapping.eafya_id,
      eafya_name: newMapping.eafya_name,
      section_name: dimRows[0].hmis_section,
      condition_name: dimRows[0].hmis_name,
      created_at: newMapping.created_at,
    });
  } catch (error) {
    console.error("Database error creating mapping:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack,
    });

    if (error.code === "23505") {
      // Unique violation
      return res.status(409).json({
        error: "Mapping already exists for this condition and EAFYA item",
      });
    }

    res.status(500).json({
      error: error.message,
      details: error.detail || "No additional details available",
    });
  }
});

// Update an existing mapping
router.put("/mappings/:mappingId", async (req, res) => {
  try {
    const { mappingId } = req.params;
    const { eafya_id, eafya_name } = req.body;

    const query = `
            UPDATE reporting.eafya_hmis_mappings
            SET 
                eafya_id = COALESCE($2, eafya_id),
                eafya_name = COALESCE($3, eafya_name),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
    const { rows } = await pool.query(query, [mappingId, eafya_id, eafya_name]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Mapping not found" });
    }

    const mapping = rows[0];
    res.json({
      id: mapping.id,
      dim_id: mapping.dim_id,
      eafya_id: mapping.eafya_id,
      eafya_name: mapping.eafya_name,
      updated_at: mapping.updated_at,
    });
  } catch (error) {
    console.error("Database error:", error);
    if (error.code === "23505") {
      // Unique violation
      return res.status(409).json({
        error: "Mapping already exists for this condition and EAFYA item",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a mapping
router.delete("/mappings/:mappingId", async (req, res) => {
  try {
    const { mappingId } = req.params;

    const query = `
            DELETE FROM reporting.eafya_hmis_mappings
            WHERE id = $1
            RETURNING id, dim_id, eafya_id, eafya_name
        `;

    const { rows } = await pool.query(query, [mappingId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Mapping not found" });
    }

    res.json({
      message: "Mapping deleted successfully",
      deleted_mapping: rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all EAFYA items for search/mapping
router.get("/eafya-items", async (req, res) => {
  try {
    const { search, download, categories } = req.query;

    // Parse categories if provided
    const selectedCategories = categories ? categories.split(",") : [];

    console.log("Categories requested:", selectedCategories);
    console.log("Download mode:", download);

    let query = `
            SELECT * FROM (
                SELECT id, name, 'Bed' as category FROM dwh.dim_eafya_bed
                UNION
                SELECT id, name, 'Blood Transfusion' as category FROM dwh.dim_eafya_blood_transfusion
                UNION
                SELECT id, name, 'Clinic' as category FROM dwh.dim_eafya_clinic
                UNION
                SELECT id, name, 'Department' as category FROM dwh.dim_eafya_department
                UNION
                SELECT id, name, 'Disease' as category FROM dwh.dim_eafya_disease
                UNION
                SELECT id, name, 'Family Planning' as category FROM dwh.dim_eafya_family_planning
                UNION
                SELECT id, name, 'Family Planning Category' as category FROM dwh.dim_eafya_family_planning_category
                UNION
                SELECT id, name, 'Imaging' as category FROM dwh.dim_eafya_imaging
                UNION
                SELECT id, name, 'Imaging Category' as category FROM dwh.dim_eafya_imaging_category
                UNION
                SELECT id, name, 'Inventory Unit' as category FROM dwh.dim_eafya_inventory_unit
                UNION
                SELECT id, name, 'Lab Test' as category FROM dwh.dim_eafya_lab_test
                UNION
                SELECT id, name, 'Lab Test Category' as category FROM dwh.dim_eafya_lab_test_category
                UNION
                SELECT lab_test_sample_type_id as id, sample_type as name, 'Lab Test Sample Type' as category FROM dwh.dim_eafya_lab_test_sample_type
                UNION
                SELECT id, name, 'Lab Tests Parent' as category FROM dwh.dim_eafya_lab_tests_parent
                UNION
                SELECT id, major_theater_name as name, 'Major Theatre' as category FROM dwh.dim_eafya_major_theatre
                UNION
                SELECT id, major_theater_category as name, 'Major Theatre Category' as category FROM dwh.dim_eafya_major_theatre_category
                UNION
                SELECT id, major_theater_room as name, 'Major Theatre Room' as category FROM dwh.dim_eafya_major_theatre_room
                UNION
                SELECT id, minor_theater_name as name, 'Minor Theatre' as category FROM dwh.dim_eafya_minor_theatre
                UNION
                SELECT id, minor_theater_categroy as name, 'Minor Theatre Category' as category FROM dwh.dim_eafya_minor_theatre_category
                UNION
                SELECT id, name, 'Pharmacology' as category FROM dwh.dim_eafya_pharmacology
                UNION
                SELECT id, name, 'Product' as category FROM dwh.dim_eafya_product
                UNION
                SELECT id, name, 'Room' as category FROM dwh.dim_eafya_room
                UNION
                SELECT id, name, 'Store' as category FROM dwh.dim_eafya_store
                UNION
                SELECT id, name, 'Triage Type' as category FROM dwh.dim_eafya_triage_type
                UNION
                SELECT id, name, 'Vaccine' as category FROM dwh.dim_eafya_vaccine
                UNION
                SELECT id, name, 'Visit Type' as category FROM dwh.dim_eafya_visit_type
                UNION
                SELECT id, caption as name, 'Vital Type' as category FROM dwh.dim_eafya_vital_type
                UNION
                SELECT id, name, 'Ward' as category FROM dwh.dim_eafya_ward
            ) combined
        `;

    const params = [];
    let paramCount = 1;
    let whereConditions = [];

    // Add category filter if specific categories are selected
    if (selectedCategories.length > 0) {
      // Use a more explicit approach for category filtering
      const categoryConditions = selectedCategories
        .map(() => `category = $${paramCount++}`)
        .join(" OR ");
      whereConditions.push(`(${categoryConditions})`);
      params.push(...selectedCategories);
      console.log("Filtering by categories:", selectedCategories);
      console.log("WHERE condition:", `(${categoryConditions})`);
      console.log("Parameters to bind:", params);
    } else {
      console.log("No categories selected, returning all items");
    }

    // Add search filter if provided and not downloading
    if (search && search.trim() && !download) {
      whereConditions.push(`LOWER(name) LIKE LOWER($${paramCount})`);
      params.push(`%${search.trim()}%`);
    }

    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(" AND ")}`;
      console.log("Final WHERE clause:", whereConditions.join(" AND "));
    }

    // If downloading, get all items without limit
    if (download) {
      query += ` ORDER BY category, name`;
    } else {
      query += ` ORDER BY name LIMIT 100`;
    }

    console.log("Final query params:", params);
    console.log("Final query:", query);
    const { rows } = await pool.query(query, params);
    console.log(`Returning ${rows.length} items`);

    // Log first few items to see what categories we're getting
    if (rows.length > 0) {
      console.log(
        "First 5 items categories:",
        rows.slice(0, 5).map((item) => item.category)
      );
    }

    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all conditions from dimension table (for overview/debugging)
router.get("/conditions", async (req, res) => {
  try {
    const query = `
            SELECT 
                d.hmis_id as id,
                d.hmis_section_id as section_id, 
                d.hmis_section as section_name,
                d.hmis_code, 
                d.hmis_name,
                COUNT(m.id) as mapping_count
            FROM reporting.dhis2_mapping_details d
            LEFT JOIN reporting.eafya_hmis_mappings m ON d.hmis_id = m.dim_id
            GROUP BY d.hmis_id, d.hmis_section_id, d.hmis_section, d.hmis_code, d.hmis_name
            ORDER BY d.hmis_section_id, d.hmis_code
        `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get mapping statistics
router.get("/stats", async (req, res) => {
  try {
    const query = `
            SELECT 
                COUNT(DISTINCT d.hmis_id) as total_conditions,
                COUNT(DISTINCT m.dim_id) as mapped_conditions,
                COUNT(m.id) as total_mappings,
                COUNT(DISTINCT d.hmis_section_id) as total_sections
            FROM reporting.dhis2_mapping_details d
            LEFT JOIN reporting.eafya_hmis_mappings m ON d.hmis_id = m.dim_id
        `;
    const { rows } = await pool.query(query);
    res.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
