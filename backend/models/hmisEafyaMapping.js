import { pool } from '../config/database';

class HmisEafyaMapping {
    static async createMapping(mapping, userId) {
        const { hmis_code, hmis_name, eafya_disease_id, eafya_disease_name } = mapping;
        
        const query = `
            INSERT INTO hmis_eafya_mappings 
            (hmis_code, hmis_name, eafya_disease_id, eafya_disease_name, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $5)
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [
                hmis_code,
                hmis_name,
                eafya_disease_id,
                eafya_disease_name,
                userId
            ]);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('This mapping already exists');
            }
            throw error;
        }
    }

    static async createManyMappings(mappings, userId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const results = [];
            for (const mapping of mappings) {
                const result = await client.query(
                    `INSERT INTO hmis_eafya_mappings 
                    (hmis_code, hmis_name, eafya_disease_id, eafya_disease_name, created_by, updated_by)
                    VALUES ($1, $2, $3, $4, $5, $5)
                    ON CONFLICT (hmis_code, eafya_disease_id) DO NOTHING
                    RETURNING *`,
                    [
                        mapping.hmis_code,
                        mapping.hmis_name,
                        mapping.eafya_disease_id,
                        mapping.eafya_disease_name,
                        userId
                    ]
                );
                if (result.rows[0]) {
                    results.push(result.rows[0]);
                }
            }

            await client.query('COMMIT');
            return results;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getMappingsByHmisCode(hmisCode) {
        const query = `
            SELECT * FROM hmis_eafya_mappings 
            WHERE hmis_code = $1 
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [hmisCode]);
        return result.rows;
    }

    static async getAllMappings() {
        const query = `
            SELECT * FROM hmis_eafya_mappings 
            ORDER BY hmis_code, created_at DESC
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    static async deleteMapping(hmisCode, eafyaDiseaseId, userId) {
        const query = `
            DELETE FROM hmis_eafya_mappings 
            WHERE hmis_code = $1 AND eafya_disease_id = $2
            RETURNING *
        `;
        
        const result = await pool.query(query, [hmisCode, eafyaDiseaseId]);
        return result.rows[0];
    }

    static async deleteMappingsByHmisCode(hmisCode, userId) {
        const query = `
            DELETE FROM hmis_eafya_mappings 
            WHERE hmis_code = $1
            RETURNING *
        `;
        
        const result = await pool.query(query, [hmisCode]);
        return result.rows;
    }

    static async updateMapping(hmisCode, eafyaDiseaseId, updates, userId) {
        const query = `
            UPDATE hmis_eafya_mappings 
            SET hmis_name = $1, 
                eafya_disease_name = $2,
                updated_by = $3
            WHERE hmis_code = $4 AND eafya_disease_id = $5
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            updates.hmis_name,
            updates.eafya_disease_name,
            userId,
            hmisCode,
            eafyaDiseaseId
        ]);
        return result.rows[0];
    }
}