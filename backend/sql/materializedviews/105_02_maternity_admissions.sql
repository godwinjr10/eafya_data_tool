create materialized view reporting."105_02_maternity_admissions" as
SELECT 
    TO_CHAR(admission_date, 'YYYY-MM') AS report_month,
    ward_name,
    COUNT(patient_id) AS total_admissions
FROM reporting.maternity
GROUP BY TO_CHAR(admission_date, 'YYYY-MM'), ward_name
ORDER BY report_month, ward_name;