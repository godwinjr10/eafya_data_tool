create materialized view reporting."105_02_maternity_admissions" as
SELECT 
TO_CHAR(admission_date, 'YYYYMM') AS report_month,
'MA01' as hmis_code,
COUNT(patient_id) AS total_admissions
FROM reporting.maternity
GROUP BY TO_CHAR(admission_date, 'YYYYMM')
ORDER BY report_month, hmis_code;