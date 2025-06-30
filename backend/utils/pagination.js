import { pool } from "../config/database.js";

/**
 * Generic pagination utility for mapping tables
 * @param {string} tableName - The name of the table to query
 * @param {Object} options - Pagination options
 * @param {number} options.page - Current page number (default: 1)
 * @param {number} options.limit - Number of records per page (default: 50)
 * @param {string} options.search - Search term (default: '')
 * @param {Array} options.searchFields - Fields to search in (default: ['hmis_name', 'hmis_code'])
 * @param {Array} options.selectFields - Fields to select (required)
 * @param {string} options.orderBy - Order by clause (default: 'section_id, hmis_code')
 * @returns {Object} - Paginated result with data and pagination info
 */
export const paginateQuery =
  async (
    tableName,
    options = {}
  ) => {
    const {
      page = 1,
      limit = 50,
      search = "",
      searchFields = [
        "hmis_name",
        "hmis_code",
      ],
      selectFields,
      orderBy = "section_id, hmis_code",
      eafyaNameField = null, // For search in eafya name field
    } = options;

    if (
      !selectFields ||
      !Array.isArray(
        selectFields
      )
    ) {
      throw new Error(
        "selectFields is required and must be an array"
      );
    }

    try {
      const offset =
        (page - 1) * limit;

      // Build search condition
      let searchCondition =
        "";
      let queryParams = [
        limit,
        offset,
      ];

      if (search) {
        const searchClauses =
          searchFields.map(
            (field, index) =>
              `LOWER(${field}) LIKE LOWER($${
                index + 3
              })`
          );

        // Add eafya name field search if provided
        if (eafyaNameField) {
          searchClauses.push(
            `LOWER(${eafyaNameField}) LIKE LOWER($${
              searchFields.length +
              3
            })`
          );
        }

        searchCondition = `WHERE (${searchClauses.join(
          " OR "
        )})`;

        // Add search parameters
        for (
          let i = 0;
          i <
          searchFields.length;
          i++
        ) {
          queryParams.push(
            `%${search}%`
          );
        }
        if (eafyaNameField) {
          queryParams.push(
            `%${search}%`
          );
        }
      }

      // Get total count
      const countQuery = `
      SELECT COUNT(*) as total
      FROM ${tableName}
      ${searchCondition}
    `;
      const countParams =
        search
          ? Array(
              searchFields.length +
                (eafyaNameField
                  ? 1
                  : 0)
            ).fill(
              `%${search}%`
            )
          : [];

      const {
        rows: countRows,
      } = await pool.query(
        countQuery,
        countParams
      );
      const total = parseInt(
        countRows[0].total
      );

      // Get paginated data
      const dataQuery = `
      SELECT ${selectFields.join(
        ", "
      )}
      FROM ${tableName}
      ${searchCondition}
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2
    `;

      const { rows } =
        await pool.query(
          dataQuery,
          queryParams
        );

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages:
            Math.ceil(
              total / limit
            ),
          hasNext:
            page <
            Math.ceil(
              total / limit
            ),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(
        `Error in pagination query: ${error.message}`
      );
    }
  };
