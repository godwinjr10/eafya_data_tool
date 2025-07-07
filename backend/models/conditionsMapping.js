import { pool } from "../config/database.js";
import { paginateQuery } from "../utils/pagination.js";

class ConditionsMapping {
  // Get all conditions mappings with pagination
  static async getAll(
    page = 1,
    limit = 50,
    search = ""
  ) {
    try {
      return await paginateQuery(
        "reporting.dhis_eafya_mapping_conditions",
        {
          page,
          limit,
          search,
          searchFields: [
            "hmis_name",
            "hmis_code",
          ],
          eafyaNameField:
            "eafya_name",
          selectFields: [
            "id",
            "section_id",
            "section_name",
            "eafya_hmis_id",
            "eafya_id",
            "eafya_name",
            "hmis_code",
            "hmis_name",
            "data_element_id",
            "category_optioncombo_id",
            "category_optioncombo_name",
            "createdAt",
            "updatedAt",
          ],
          orderBy:
            "section_id, hmis_code",
        }
      );
    } catch (error) {
      throw new Error(
        `Error fetching conditions mappings: ${error.message}`
      );
    }
  }

  // Update conditions mapping (using id as primary key)
  static async update(
    id,
    updateData
  ) {
    try {
      const {
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
        UPDATE reporting.dhis_eafya_mapping_conditions
        SET 
          eafya_id = $2,
          eafya_name = $3,
          section_id = $4,
          section_name = $5,
          hmis_code = $6,
          hmis_name = $7,
          data_element_id = $8,
          category_optioncombo_id = $9,
          category_optioncombo_name = $10,
          "updatedAt" = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            id,
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
        `Error updating conditions mapping: ${error.message}`
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
          UPDATE reporting.dhis_eafya_mapping_conditions
          SET 
            eafya_id = $2,
            eafya_name = $3,
            section_id = $4,
            section_name = $5,
            hmis_code = $6,
            hmis_name = $7,
            data_element_id = $8,
            category_optioncombo_id = $9,
            category_optioncombo_name = $10,
            "updatedAt" = NOW()
          WHERE id = $1
          RETURNING *
        `;

        const { rows } =
          await client.query(
            query,
            [
              id,
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
        `Error bulk updating conditions mappings: ${error.message}`
      );
    } finally {
      client.release();
    }
  }
}

export default ConditionsMapping;
