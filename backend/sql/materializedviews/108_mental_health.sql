-- =====================================================
-- HMIS 108: Mental Health Services
-- =====================================================

CREATE VIEW reporting."108_03_mental_health" AS
SELECT 
    TO_CHAR(date_created, 'YYYYMM') AS report_month,
    disease_name,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) < 5 AND gender = 'Male' THEN 1 END) AS "0-4y Male",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) < 5 AND gender = 'Female' THEN 1 END) AS "0-4y Female",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) BETWEEN 5 AND 14 AND gender = 'Male' THEN 1 END) AS "5-14y Male",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) BETWEEN 5 AND 14 AND gender = 'Female' THEN 1 END) AS "5-14y Female",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) BETWEEN 15 AND 49 AND gender = 'Male' THEN 1 END) AS "15-49y Male",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) BETWEEN 15 AND 49 AND gender = 'Female' THEN 1 END) AS "15-49y Female",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) >= 50 AND gender = 'Male' THEN 1 END) AS "50y+ Male",
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(date_created, birth_date)) >= 50 AND gender = 'Female' THEN 1 END) AS "50y+ Female"
FROM reporting.patient_diagnosis
GROUP BY TO_CHAR(date_created, 'YYYYMM'), disease_name
ORDER BY report_month DESC;
