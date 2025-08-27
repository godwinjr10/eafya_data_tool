create materialized view reporting."105_02_maternity_preterm_low_birth_weight_babies" as
SELECT 
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    ward_name,
    COUNT(*) AS total_babies_under_2_5kg
FROM 
    reporting.maternity
WHERE 
    ward_name = 'MATERNITY'
    AND baby_weight < 2.5
    AND baby_weight IS NOT NULL
    AND baby_weight > 0
GROUP BY 
    TO_CHAR(admission_date, 'YYYYMM'),
    ward_name
ORDER BY 
    report_month,
    ward_name;