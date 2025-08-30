CREATE MATERIALIZED VIEW reporting."105_02_antenantal_9" AS
WITH base AS (
    SELECT
        DATE_TRUNC('month', plt.date_created)::date AS report_month,
        plt.patient_id,
        plt.patient_visit_id,
        EXTRACT(YEAR FROM AGE(plt.date_created::date, plt.birth_date::date))::int AS age,
        NULLIF(
            REGEXP_REPLACE(REPLACE(plt.result::text, ',', '.'), '[^0-9\.]', '', 'g'),
            ''
        )::numeric AS hb_value
    FROM reporting.patient_lab_test plt
    WHERE plt.lab_test = 'HB'
      AND (plt.name ILIKE '%ante%' OR plt.name ILIKE '%high risk%')
      AND plt.result IS NOT NULL
)
SELECT
    TO_CHAR(report_month, 'YYYY-MM')               AS report_month,
    'AN09'                                         AS hmis_code,
    COUNT(*) FILTER (WHERE hb_value < 10 AND age < 15)              AS "Below 15 Years",
    COUNT(*) FILTER (WHERE hb_value < 10 AND age BETWEEN 15 AND 19) AS "15 - 19 Years",
    COUNT(*) FILTER (WHERE hb_value < 10 AND age BETWEEN 20 AND 24) AS "20 - 24 Years",
    COUNT(*) FILTER (WHERE hb_value < 10 AND age BETWEEN 25 AND 49) AS "25 - 49 Years",
    COUNT(*) FILTER (WHERE hb_value < 10 AND age >= 50)             AS "50+ Years",
    COUNT(*) FILTER (WHERE hb_value < 10)                           AS "Total"
FROM base
GROUP BY report_month
ORDER BY report_month;





