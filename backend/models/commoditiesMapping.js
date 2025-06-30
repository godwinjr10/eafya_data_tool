import { pool } from "../config/database.js";
import { paginateQuery } from "../utils/pagination.js";

class CommoditiesMapping {
  // Get all commodities mappings with pagination
  static async getAll(
    page = 1,
    limit = 50,
    search = ""
  ) {
    try {
      return await paginateQuery(
        "reporting.dhis_eafya_mapping_commodities",
        {
          page,
          limit,
          search,
          searchFields: [
            "hmis_name",
            "hmis_code",
          ],
          eafyaNameField:
            "eafya_product_name",
          selectFields: [
            "section_id",
            "section_name",
            "eafya_product_id",
            "eafya_product_name",
            "hmis_name",
            "hmis_code",
            "unit",
            "dhis2_data_element_id",
            "data_element_name",
          ],
          orderBy:
            "section_id, hmis_code",
        }
      );
    } catch (error) {
      throw new Error(
        `Error fetching commodities mappings: ${error.message}`
      );
    }
  }

  // Update commodities mapping (using hmis_code as primary key)
  static async update(
    hmis_code,
    updateData
  ) {
    try {
      const {
        eafya_product_id,
        eafya_product_name,
        section_id,
        section_name,
        hmis_name,
        unit,
        dhis2_data_element_id,
        data_element_name,
      } = updateData;

      const query = `
        UPDATE reporting.dhis_eafya_mapping_commodities
        SET 
          eafya_product_id = $2,
          eafya_product_name = $3,
          section_id = $4,
          section_name = $5,
          hmis_name = $6,
          unit = $7,
          dhis2_data_element_id = $8,
          data_element_name = $9
        WHERE hmis_code = $1
        RETURNING *
      `;

      const { rows } =
        await pool.query(
          query,
          [
            hmis_code,
            eafya_product_id,
            eafya_product_name,
            section_id,
            section_name,
            hmis_name,
            unit,
            dhis2_data_element_id,
            data_element_name,
          ]
        );

      return rows[0];
    } catch (error) {
      throw new Error(
        `Error updating commodities mapping: ${error.message}`
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
          eafya_product_id,
          eafya_product_name,
          section_id,
          section_name,
          hmis_name,
          unit,
          dhis2_data_element_id,
          data_element_name,
        } = mapping;

        const query = `
          UPDATE reporting.dhis_eafya_mapping_commodities
          SET 
            eafya_product_id = $2,
            eafya_product_name = $3,
            section_id = $4,
            section_name = $5,
            hmis_name = $6,
            unit = $7,
            dhis2_data_element_id = $8,
            data_element_name = $9
          WHERE hmis_code = $1
          RETURNING *
        `;

        const { rows } =
          await client.query(
            query,
            [
              hmis_code,
              eafya_product_id,
              eafya_product_name,
              section_id,
              section_name,
              hmis_name,
              unit,
              dhis2_data_element_id,
              data_element_name,
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
        `Error bulk updating commodities mappings: ${error.message}`
      );
    } finally {
      client.release();
    }
  }
}

export default CommoditiesMapping;
