import { pool } from "../config/database.js";

class FamilyplanningMapping {
  // Get all family planning mappings
  static async getAll() {
    try {
      const query = `
        SELECT 
          id,
          section_id, 
          section_name, 
          eafya_hmis_id,
          eafya_id, 
          eafya_name, 
          hmis_code, 
          hmis_name, 
          data_element_id, 
          category_optioncombo_id, 
          category_optioncombo_name,
          "createdAt",
          "updatedAt"
        FROM reporting.dhis_eafya_mapping_familyplanning
        ORDER BY section_id, hmis_code
      `;
      const { rows } =
        await pool.query(
          query
        );
      return rows;
    } catch (error) {
      throw new Error(
        `Error fetching family planning mappings: ${error.message}`
      );
    }
  }

  // Update family planning mapping (using id as primary key)
  static async update(
    id,
    updateData
  ) {
    try {
      const {
        eafya_hmis_id,
        eafya_id,
        eafya_name,
        section_id,
        section_name,
        hmis_code,
        hmis_name,
        data_element_id,
        category_optioncombo_id,
        category_optioncombo_name,
      } = updateData;

      const query = `
        UPDATE reporting.dhis_eafya_mapping_familyplanning
        SET 
          eafya_hmis_id = $2,
          eafya_id = $3,
          eafya_name = $4,
          section_id = $5,
          section_name = $6,
          hmis_code = $7,
          hmis_name = $8,
          data_element_id = $9,
          category_optioncombo_id = $10,
          category_optioncombo_name = $11,
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            id,
            eafya_hmis_id,
            eafya_id,
            eafya_name,
            section_id,
            section_name,
            hmis_code,
            hmis_name,
            data_element_id,
            category_optioncombo_id,
            category_optioncombo_name,
          ]
        );

      return rows[0];
    } catch (error) {
      throw new Error(
        `Error updating family planning mapping: ${error.message}`
      );
    }
  }

  // Bulk update multiple mappings
  static async bulkUpdate(
    mappings
  ) {
    const client =
      await pool.connect();
    try {
      await client.query(
        "BEGIN"
      );

      const updatedMappings =
        [];

      for (const mapping of mappings) {
        const {
          id,
          eafya_hmis_id,
          eafya_id,
          eafya_name,
          section_id,
          section_name,
          hmis_code,
          hmis_name,
          data_element_id,
          category_optioncombo_id,
          category_optioncombo_name,
        } = mapping;

        const query = `
          UPDATE reporting.dhis_eafya_mapping_familyplanning
          SET 
            eafya_hmis_id = $2,
            eafya_id = $3,
            eafya_name = $4,
            section_id = $5,
            section_name = $6,
            hmis_code = $7,
            hmis_name = $8,
            data_element_id = $9,
            category_optioncombo_id = $10,
            category_optioncombo_name = $11,
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING *
        `;

        const { rows } =
          await client.query(
            query,
            [
              id,
              eafya_hmis_id,
              eafya_id,
              eafya_name,
              section_id,
              section_name,
              hmis_code,
              hmis_name,
              data_element_id,
              category_optioncombo_id,
              category_optioncombo_name,
            ]
          );

        if (rows[0]) {
          updatedMappings.push(
            rows[0]
          );
        }
      }

      await client.query(
        "COMMIT"
      );
      return updatedMappings;
    } catch (error) {
      await client.query(
        "ROLLBACK"
      );
      throw new Error(
        `Error bulk updating family planning mappings: ${error.message}`
      );
    } finally {
      client.release();
    }
  }
}

export default FamilyplanningMapping;
