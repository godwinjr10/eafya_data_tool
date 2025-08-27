create materialized view reporting."105_02_maternity_defects" as
SELECT 
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MATERNITY' AS ward_name,
    COUNT(CASE WHEN baby_status = 'Birth with Deformities' THEN 1 END) AS Birth_with_Deformities,
           COUNT(CASE WHEN baby_status IN ('Birth with Deformities') 
          THEN 1 END) AS total_birth_outcomes
FROM reporting.maternity
WHERE 
    ward_name = 'MATERNITY'
    AND admission_date IS NOT NULL
    AND baby_status IN ('Birth with Deformities')
GROUP BY 
    TO_CHAR(admission_date, 'YYYYMM')
ORDER BY 
    report_month;