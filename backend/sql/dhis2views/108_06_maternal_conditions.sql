CREATE VIEW reporting."108_maternal_conditions" AS
SELECT
    TO_CHAR(diagnosis_date, 'YYYYMM') AS report_month,
    disease_id,
    diagnosis,
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) < 15 THEN 1 ELSE 0 END) AS "Cases Below 15 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) BETWEEN 15 AND 19 THEN 1 ELSE 0 END) AS "Cases 15-19 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) BETWEEN 20 AND 24 THEN 1 ELSE 0 END) AS "Cases 20-24 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) BETWEEN 25 AND 49 THEN 1 ELSE 0 END) AS "Cases 25-49 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) >= 50 THEN 1 ELSE 0 END) AS "Cases 50+ Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) < 15 AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths Below 15 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) BETWEEN 15 AND 19 AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 15-19 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) BETWEEN 20 AND 24 AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 20-24 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) BETWEEN 25 AND 49 AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 25-49 Years",
    SUM(CASE WHEN DATE_PART('year', age(diagnosis_date, birth_date)) >= 50 AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 50+ Years"
FROM reporting.inpatient_maternal_conditions
WHERE diagnosis_date IS NOT NULL
GROUP BY TO_CHAR(diagnosis_date, 'YYYYMM'), disease_id, diagnosis
ORDER BY report_month DESC;
