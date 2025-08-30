CREATE MATERIALIZED VIEW reporting."105_02_antenantal_8" AS
WITH base AS (
    SELECT
        DATE_TRUNC('month', plt.date_created)::date AS report_month,
        EXTRACT(YEAR FROM AGE(plt.date_created::date, plt.birth_date::date))::int AS age
    FROM reporting.patient_lab_test plt
    WHERE plt.lab_test = 'HB'
      AND (plt.name ILIKE '%ante%' OR plt.name ILIKE '%high risk%')
      AND plt.status <> 'Cancelled'
)
SELECT
    TO_CHAR(report_month, 'YYYY-MM')               AS report_month,
    'AN08'                                         AS hmis_code,
    COUNT(*) FILTER (WHERE age < 15)              AS "Below 15 Years",
    COUNT(*) FILTER (WHERE age BETWEEN 15 AND 19) AS "15 - 19 Years",
    COUNT(*) FILTER (WHERE age BETWEEN 20 AND 24) AS "20 - 24 Years",
    COUNT(*) FILTER (WHERE age BETWEEN 25 AND 49) AS "25 - 49 Years",
    COUNT(*) FILTER (WHERE age >= 50)             AS "50+ Years",
    COUNT(*)                                       AS "Total"
FROM base
GROUP BY report_month
ORDER BY report_month;
