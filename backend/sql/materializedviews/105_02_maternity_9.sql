create materialized view reporting."105_02_maternity_live_babies_at_discharge" as
SELECT 
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MATERNITY' AS ward_name,
    COUNT(CASE WHEN baby_status = 'Live Birth' THEN 1 END) AS live_babies
FROM reporting.maternity
WHERE 
    ward_name = 'MATERNITY'
    AND admission_date IS NOT NULL
    AND baby_status IN ('Live Birth')
GROUP BY 
    TO_CHAR(admission_date, 'YYYYMM')
ORDER BY 
    report_month;



