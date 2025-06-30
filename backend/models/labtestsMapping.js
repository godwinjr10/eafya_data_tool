import { pool } from "../config/database.js";
import { paginateQuery } from "../utils/pagination.js";

class LabtestsMapping {
  // Get all lab tests mappings with pagination
  static async getAll(
    page = 1,
    limit = 50,
    search = ""
  ) {
    try {
      return await paginateQuery(
        "reporting.dhis_eafya_mapping_labtests",
        {
          page,
          limit,
          search,
          searchFields: [
            "hmis_name",
            "hmis_code",
          ],
          eafyaNameField:
            "eafya_labtest_name",
          selectFields: [
            "section_id",
            "section_name",
            "category",
            "eafya_labtest_id",
            "eafya_labtest_name",
            "hmis_code",
            "hmis_name",
            "status",
            "dhis2_data_element_id",
          ],
          orderBy:
            "section_id, hmis_code",
        }
      );
    } catch (error) {
      throw new Error(
        `Error fetching lab tests mappings: ${error.message}`
      );
    }
  }

  // Update lab tests mapping (using hmis_code as primary key since no categoryoptioncombo_uid)
  static async update(
    hmis_code,
    updateData
  ) {
    try {
      const {
        eafya_labtest_id,
        eafya_labtest_name,
        section_id,
        section_name,
        category,
        hmis_name,
        status,
        dhis2_data_element_id,
      } = updateData;

      const query = `
        UPDATE reporting.dhis_eafya_mapping_labtests
        SET 
          eafya_labtest_id = $2,
          eafya_labtest_name = $3,
          section_id = $4,
          section_name = $5,
          category = $6,
          hmis_name = $7,
          status = $8,
          dhis2_data_element_id = $9
        WHERE hmis_code = $1
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            hmis_code,
            eafya_labtest_id,
            eafya_labtest_name,
            section_id,
            section_name,
            category,
            hmis_name,
            status,
            dhis2_data_element_id,
          ]
        );

      return rows[0];
    } catch (error) {
      throw new Error(
        `Error updating lab tests mapping: ${error.message}`
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
          eafya_labtest_id,
          eafya_labtest_name,
          section_id,
          section_name,
          category,
          hmis_name,
          status,
          dhis2_data_element_id,
        } = mapping;

        const query = `
          UPDATE reporting.dhis_eafya_mapping_labtests
          SET 
            eafya_labtest_id = $2,
            eafya_labtest_name = $3,
            section_id = $4,
            section_name = $5,
            category = $6,
            hmis_name = $7,
            status = $8,
            dhis2_data_element_id = $9
          WHERE hmis_code = $1
          RETURNING *
        `;

        const { rows } =
          await client.query(
            query,
            [
              hmis_code,
              eafya_labtest_id,
              eafya_labtest_name,
              section_id,
              section_name,
              category,
              hmis_name,
              status,
              dhis2_data_element_id,
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
        `Error bulk updating lab tests mappings: ${error.message}`
      );
    } finally {
      client.release();
    }
  }
}

export default LabtestsMapping;
