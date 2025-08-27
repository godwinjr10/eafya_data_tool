create materialized view reporting."105_02_maternity_babies_with_birth_asphyxia" as
SELECT 
    TO_CHAR(date_created, 'YYYYMM') AS report_month,
        COUNT(CASE WHEN disease_name ilike '%asphyxia%' THEN 1 END) AS Babies_with_birth_asphyxia
                    FROM reporting.patient_diagnosis
WHERE 
    disease_name ilike '%asphyxia%'
    AND date_created IS NOT NULL
    AND classification = 'Confirmed'
    GROUP BY 
    TO_CHAR(date_created, 'YYYYMM')
ORDER BY 
    report_month;