import { pool } from "../config/database.js";
import { paginateQuery } from "../utils/pagination.js";

class VaccineMapping {
  // Get all vaccine mappings with pagination
  static async getAll(
    page = 1,
    limit = 50,
    search = ""
  ) {
    try {
      return await paginateQuery(
        "reporting.dhis_eafya_mapping_vaccines",
        {
          page,
          limit,
          search,
          searchFields: [
            "hmis_name",
            "hmis_code",
          ],
          eafyaNameField:
            "eafya_vaccine_name",
          selectFields: [
            "section_id",
            "section_name",
            "eafya_vaccine_id",
            "eafya_vaccine_name",
            "hmis_code",
            "hmis_name",
            "dhis2_data_element_id",
            "categoryoptioncombo_uid",
            "categoryoptioncombo_name",
          ],
          orderBy:
            "section_id, hmis_code",
        }
      );
    } catch (error) {
      throw new Error(
        `Error fetching vaccine mappings: ${error.message}`
      );
    }
  }

  // Get vaccine mapping by composite key (hmis_code + categoryoptioncombo_uid)
  static async getByKey(
    hmis_code,
    categoryoptioncombo_uid
  ) {
    try {
      const query = `
        SELECT 
          section_id, 
          section_name, 
          eafya_vaccine_id, 
          eafya_vaccine_name, 
          hmis_code, 
          hmis_name, 
          dhis2_data_element_id, 
          categoryoptioncombo_uid, 
          categoryoptioncombo_name
        FROM reporting.dhis_eafya_mapping_vaccines
        WHERE hmis_code = $1 AND categoryoptioncombo_uid = $2
      `;
      const { rows } =
        await pool.query(
          query,
          [
            hmis_code,
            categoryoptioncombo_uid,
          ]
        );
      return rows[0];
    } catch (error) {
      throw new Error(
        `Error fetching vaccine mapping: ${error.message}`
      );
    }
  }

  // Update vaccine mapping
  static async update(
    hmis_code,
    categoryoptioncombo_uid,
    updateData
  ) {
    try {
      const {
        eafya_vaccine_id,
        eafya_vaccine_name,
        section_id,
        section_name,
        hmis_name,
        dhis2_data_element_id,
        categoryoptioncombo_name,
      } = updateData;

      const query = `
        UPDATE reporting.dhis_eafya_mapping_vaccines
        SET 
          eafya_vaccine_id = $3,
          eafya_vaccine_name = $4,
          section_id = $5,
          section_name = $6,
          hmis_name = $7,
          dhis2_data_element_id = $8,
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
            eafya_vaccine_id,
            eafya_vaccine_name,
            section_id,
            section_name,
            hmis_name,
            dhis2_data_element_id,
            categoryoptioncombo_name,
          ]
        );

      return rows[0];
    } catch (error) {
      throw new Error(
        `Error updating vaccine mapping: ${error.message}`
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
          eafya_vaccine_id,
          eafya_vaccine_name,
          section_id,
          section_name,
          hmis_name,
          dhis2_data_element_id,
          categoryoptioncombo_name,
        } = mapping;

        const query = `
          UPDATE reporting.dhis_eafya_mapping_vaccines
          SET 
            eafya_vaccine_id = $3,
            eafya_vaccine_name = $4,
            section_id = $5,
            section_name = $6,
            hmis_name = $7,
            dhis2_data_element_id = $8,
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
              eafya_vaccine_id,
              eafya_vaccine_name,
              section_id,
              section_name,
              hmis_name,
              dhis2_data_element_id,
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
        `Error bulk updating vaccine mappings: ${error.message}`
      );
    } finally {
      client.release();
    }
  }

  // Create new vaccine mapping
  static async create(
    mappingData
  ) {
    try {
      const {
        section_id,
        section_name,
        eafya_vaccine_id,
        eafya_vaccine_name,
        hmis_code,
        hmis_name,
        dhis2_data_element_id,
        categoryoptioncombo_uid,
        categoryoptioncombo_name,
      } = mappingData;

      const query = `
        INSERT INTO reporting.dhis_eafya_mapping_vaccines (
          section_id,
          section_name,
          eafya_vaccine_id,
          eafya_vaccine_name,
          hmis_code,
          hmis_name,
          dhis2_data_element_id,
          categoryoptioncombo_uid,
          categoryoptioncombo_name,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            section_id,
            section_name,
            eafya_vaccine_id,
            eafya_vaccine_name,
            hmis_code,
            hmis_name,
            dhis2_data_element_id,
            categoryoptioncombo_uid,
            categoryoptioncombo_name,
          ]
        );

      return rows[0];
    } catch (error) {
      throw new Error(
        `Error creating vaccine mapping: ${error.message}`
      );
    }
  }

  // Delete vaccine mapping
  static async delete(
    hmis_code,
    categoryoptioncombo_uid
  ) {
    try {
      const query = `
        DELETE FROM reporting.dhis_eafya_mapping_vaccines
        WHERE hmis_code = $1 AND categoryoptioncombo_uid = $2
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            hmis_code,
            categoryoptioncombo_uid,
          ]
        );
      return rows[0];
    } catch (error) {
      throw new Error(
        `Error deleting vaccine mapping: ${error.message}`
      );
    }
  }
}

export default VaccineMapping;
