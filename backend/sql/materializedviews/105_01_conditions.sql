CREATE MATERIALIZED VIEW reporting."105_01_conditions" AS
SELECT
TO_CHAR(date_created, 'YYYYMM') AS report_month,
disease_id,
COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Male' THEN 1 END) AS "0-28d Male",
COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Female' THEN 1 END) AS "0-28d Female",
COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Male' THEN 1 END) AS "29d-4y Male",
COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Female' THEN 1 END) AS "29d-4y Female",
COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Male' THEN 1 END) AS "5-9y Male",
COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Female' THEN 1 END) AS "5-9y Female",
COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Male' THEN 1 END) AS "10-19y Male",
COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Female' THEN 1 END) AS "10-19y Female",
COUNT(CASE WHEN age_years >= 20 AND gender = 'Male' THEN 1 END) AS "20y+ Male",
COUNT(CASE WHEN age_years >= 20 AND gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM (
SELECT
date_created,
disease_id,
gender,
DATE_PART('year', AGE(date_created, birth_date)) AS age_years, (date_created::DATE - birth_date::DATE) AS age_days
FROM reporting.patient_diagnosis
) sub
GROUP BY TO_CHAR(date_created, 'YYYYMM'), disease_id
ORDER BY report_month DESC;
