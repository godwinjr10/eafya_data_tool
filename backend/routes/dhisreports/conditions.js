import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
	console.log("conditions");
	try {
		const { report_month, section_id } = req.query;

		if (!report_month || !section_id) {
			return res
				.status(400)
				.json({
					message: "section_id and report_month are required",
				});
		}

		let query = `
WITH c_agg AS (
    SELECT 
        h.hmis_code,
        c.report_month,
        SUM(COALESCE(c."0-28d Male",0))   AS "0_28d_male",
        SUM(COALESCE(c."0-28d Female",0)) AS "0_28d_female",
        SUM(COALESCE(c."29d-4y Male",0))  AS "29d_4y_male",
        SUM(COALESCE(c."29d-4y Female",0))AS "29d_4y_female",
        SUM(COALESCE(c."5-9y Male",0))    AS "5_9y_male",
        SUM(COALESCE(c."5-9y Female",0))  AS "5_9y_female",
        SUM(COALESCE(c."10-19y Male",0))  AS "10_19y_male",
        SUM(COALESCE(c."10-19y Female",0))AS "10_19y_female",
        SUM(COALESCE(c."20y+ Male",0))    AS "20y_plus_male",
        SUM(COALESCE(c."20y+ Female",0))  AS "20y_plus_female"
    FROM reporting."105_01_conditions" c
    LEFT JOIN reporting.hmis_eafya_conditions_mapping h ON h.disease_id = c.disease_id
    WHERE c.report_month = $1
    GROUP BY h.hmis_code, c.report_month
)
SELECT 
    c_agg.report_month,
    m.section_id,
    m.section_name,
    m.hmis_code,
    m.hmis_name,
    COALESCE(c_agg."0_28d_male",0)      AS "0_28d_male",
    COALESCE(c_agg."0_28d_female",0)    AS "0_28d_female",
    COALESCE(c_agg."29d_4y_male",0)     AS "29d_4y_male",
    COALESCE(c_agg."29d_4y_female",0)   AS "29d_4y_female",
    COALESCE(c_agg."5_9y_male",0)       AS "5_9y_male",
    COALESCE(c_agg."5_9y_female",0)     AS "5_9y_female",
    COALESCE(c_agg."10_19y_male",0)     AS "10_19y_male",
    COALESCE(c_agg."10_19y_female",0)   AS "10_19y_female",
    COALESCE(c_agg."20y_plus_male",0)   AS "20y_plus_male",
    COALESCE(c_agg."20y_plus_female",0) AS "20y_plus_female"
FROM reporting.dataelements_conditions m
LEFT JOIN c_agg ON c_agg.hmis_code = m.hmis_code
WHERE m.section_id = $2
ORDER BY string_to_array(m.section_id, '.')::int[], m.hmis_code`;

		const params = [report_month, section_id];

		console.log("Final Query:", query);
		console.log("Parameters:", params);

		const { rows } = await pool.query(query, params);
		console.log("Query Results:", rows);

		res.json(rows);
	} catch (error) {
		console.error("Query error:", error);
		res.status(500).json({ message: error.message });
	}
});

export default router;
