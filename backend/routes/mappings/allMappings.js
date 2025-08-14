import express from "express";
import { pool } from "../../config/database.js";

const router =
  express.Router();

// Get all data elements
router.get(
  "/",
  async (req, res) => {
    try {
      const query = `
    SELECT id, 
    section_id, 
    section_name, 
    hmis_code, 
    hmis_name, 
    map_type
    FROM reporting.hmis_data_elements
    ORDER BY section_id, hmis_code
    `;
      const { rows } =
        await pool.query(
          query
        );
      return res.json(rows);
    } catch (error) {
      console.error(
        "Database error:",
        error
      );
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

router.get(
  "/all",
  async (req, res) => {
    try {
      const query = `
   select * from(
 SELECT id, name FROM dwh.dim_eafya_bed
     UNION
    SELECT id, name FROM dwh.dim_eafya_blood_transfusion
     UNION
    SELECT id, name FROM dwh.dim_eafya_clinic
     UNION
    SELECT id, name FROM dwh.dim_eafya_department
     UNION
    SELECT id, name FROM dwh.dim_eafya_disease
     UNION
    SELECT id, name FROM dwh.dim_eafya_family_planning
     UNION
    SELECT id, name FROM dwh.dim_eafya_family_planning_category
     UNION
    SELECT id, name FROM dwh.dim_eafya_imaging
     UNION
    SELECT id, name FROM dwh.dim_eafya_imaging_category
     UNION
    SELECT id, name FROM dwh.dim_eafya_inventory_unit
     UNION
    SELECT id, name FROM dwh.dim_eafya_lab_test
     UNION
    SELECT id, name FROM dwh.dim_eafya_lab_test_category
     UNION
    SELECT lab_test_sample_type_id as id, sample_type as name FROM dwh.dim_eafya_lab_test_sample_type
     UNION
    SELECT id, name FROM dwh.dim_eafya_lab_tests_parent
     UNION
    SELECT id, major_theater_name as name FROM dwh.dim_eafya_major_theatre
     UNION
    SELECT id, major_theater_category as name FROM dwh.dim_eafya_major_theatre_category
     UNION
    SELECT id,major_theater_room as name FROM dwh.dim_eafya_major_theatre_room
     UNION
    SELECT id, minor_theater_name as name FROM dwh.dim_eafya_minor_theatre
     UNION
    SELECT id, minor_theater_categroy as name FROM dwh.dim_eafya_minor_theatre_category
     UNION
    SELECT id, name FROM dwh.dim_eafya_pharmacology
     UNION
    SELECT id, name FROM dwh.dim_eafya_product
     UNION
    SELECT id, name FROM dwh.dim_eafya_room
     UNION
    SELECT id, name FROM dwh.dim_eafya_store
     UNION
    SELECT id, name FROM dwh.dim_eafya_triage_type
     UNION
    SELECT id, name FROM dwh.dim_eafya_vaccine
     UNION
    SELECT id, name FROM dwh.dim_eafya_visit_type
     UNION
    SELECT id, caption as name FROM dwh.dim_eafya_vital_type
     UNION
    SELECT id, name FROM dwh.dim_eafya_ward)combined
    `;
      const { rows } =
        await pool.query(
          query
        );
      return res.json(rows);
    } catch (error) {
      console.error(
        "Database error:",
        error
      );
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

export default router;
