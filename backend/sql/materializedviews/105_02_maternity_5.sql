create materialized view reporting."105_02_maternity_births" as
SELECT 
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MATERNITY' AS ward_name,
    COUNT(CASE WHEN baby_status = 'Live Birth' THEN 1 END) AS live_births,
    COUNT(CASE WHEN baby_status = 'Live Birth' AND baby_weight IS NOT NULL AND baby_weight < 2.5 THEN 1 END) AS live_births_under_2_5kgs,
    COUNT(CASE WHEN baby_status = 'Fresh Still Birth' THEN 1 END) AS fresh_still_births,
    COUNT(CASE WHEN baby_status = 'Fresh Still Birth' AND baby_weight IS NOT NULL AND baby_weight < 2.5 THEN 1 END) AS fresh_still_births_under_2_5kgs,
    COUNT(CASE WHEN baby_status = 'Macerated Still Birth' THEN 1 END) AS macerated_still_births,
    COUNT(CASE WHEN baby_status = 'Macerated Still Birth' AND baby_weight IS NOT NULL AND baby_weight < 2.5 THEN 1 END) AS macerated_still_births_under_2_5kgs,
    COUNT(CASE WHEN baby_status IN ('Live Birth', 'Fresh Still Birth', 'Macerated Still Birth') 
          THEN 1 END) AS total_birth_outcomes,
    COUNT(CASE WHEN baby_status IN ('Live Birth', 'Fresh Still Birth', 'Macerated Still Birth') 
          AND baby_weight IS NOT NULL AND baby_weight < 2.5 THEN 1 END) AS total_births_under_2_5kgs
FROM reporting.maternity
WHERE 
    ward_name = 'MATERNITY'
    AND admission_date IS NOT NULL
    AND baby_status IN ('Live Birth', 'Fresh Still Birth', 'Macerated Still Birth')
GROUP BY 
    TO_CHAR(admission_date, 'YYYYMM')
ORDER BY 
    report_month;



