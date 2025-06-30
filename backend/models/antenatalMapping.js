import { pool } from "../config/database.js";

class AntenatalMapping {
  // Get all antenatal mappings
  static async getAll() {
    try {
      const query = `
        SELECT 
          section_id, 
          section_name, 
          eafya_id, 
          eafya_name, 
          hmis_code, 
          hmis_name, 
          data_element_id, 
          categoryoptioncombo_uid, 
          categoryoptioncombo_name
        FROM reporting.dhis_eafya_mapping_antenatal
        ORDER BY section_id, hmis_code
      `;
      const { rows } =
        await pool.query(
          query
        );
      return rows;
    } catch (error) {
      throw new Error(
        `Error fetching antenatal mappings: ${error.message}`
      );
    }
  }

  // Update antenatal mapping
  static async update(
    hmis_code,
    categoryoptioncombo_uid,
    updateData
  ) {
    try {
      const {
        eafya_id,
        eafya_name,
        section_id,
        section_name,
        hmis_name,
        data_element_id,
        categoryoptioncombo_name,
      } = updateData;

      const query = `
        UPDATE reporting.dhis_eafya_mapping_antenatal
        SET 
          eafya_id = $3,
          eafya_name = $4,
          section_id = $5,
          section_name = $6,
          hmis_name = $7,
          data_element_id = $8,
          categoryoptioncombo_name = $9
        WHERE hmis_code = $1 AND categoryoptioncombo_uid = $2
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            hmis_code,
            categoryoptioncombo_uid,
            eafya_id,
            eafya_name,
            section_id,
            section_name,
            hmis_name,
            data_element_id,
            categoryoptioncombo_name,
          ]
        );

      return rows[0];
    } catch (error) {
      throw new Error(
        `Error updating antenatal mapping: ${error.message}`
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
          hmis_code,
          categoryoptioncombo_uid,
          eafya_id,
          eafya_name,
          section_id,
          section_name,
          hmis_name,
          data_element_id,
          categoryoptioncombo_name,
        } = mapping;

        const query = `
          UPDATE reporting.dhis_eafya_mapping_antenatal
          SET 
            eafya_id = $3,
            eafya_name = $4,
            section_id = $5,
            section_name = $6,
            hmis_name = $7,
            data_element_id = $8,
            categoryoptioncombo_name = $9
          WHERE hmis_code = $1 AND categoryoptioncombo_uid = $2
          RETURNING *
        `;

        const { rows } =
          await client.query(
            query,
            [
              hmis_code,
              categoryoptioncombo_uid,
              eafya_id,
              eafya_name,
              section_id,
              section_name,
              hmis_name,
              data_element_id,
              categoryoptioncombo_name,
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
        `Error bulk updating antenatal mappings: ${error.message}`
      );
    } finally {
      client.release();
    }
  }
}

export default AntenatalMapping;
