CREATE VIEW reporting."108_surgical_procedures" AS
SELECT 
    TO_CHAR(DATE_TRUNC('month', date_created), 'YYYYMM') AS report_month,
    major_theater_name AS procedure,
    COUNT(*) AS procedure_count
FROM reporting.patient_major_theater
WHERE major_theater_name IS NOT NULL
GROUP BY TO_CHAR(DATE_TRUNC('month', date_created), 'YYYYMM'), major_theater_name
ORDER BY report_month, major_theater_name;
