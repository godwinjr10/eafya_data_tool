create materialized view reporting."105_02_maternity_total_deliveries_in_unit" as
SELECT 
    TO_CHAR(admission_date, 'YYYY-MM') AS report_month,
    'MA04' AS hmis_code,
    COUNT(patient_id) AS total_deliveries,
    COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date::DATE)) < 15 THEN 1 END) AS "below_15_years",
    COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date::DATE)) BETWEEN 15 AND 19 THEN 1 END) AS "15-19_years",
    COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date::DATE)) BETWEEN 20 AND 24 THEN 1 END) AS "20-24_years",
    COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date::DATE)) BETWEEN 25 AND 49 THEN 1 END) AS "25-49_years",
    COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date::DATE)) >= 50 THEN 1 END) AS "50+_years"
FROM 
    reporting.maternity
WHERE 
    ward_name = 'MATERNITY'
    AND birth_date IS NOT NULL
    AND birth_date::TEXT != '00:00.0'
 GROUP BY 
    TO_CHAR(admission_date, 'YYYY-MM')
ORDER BY 
    report_month;