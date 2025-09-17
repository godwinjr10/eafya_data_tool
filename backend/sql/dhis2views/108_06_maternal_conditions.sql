CREATE VIEW reporting."108_maternal_conditions" AS
SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    disease_id,
 -- Age bands
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) < 15 THEN 1 ELSE 0 END) AS "Cases Below 15 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 15 AND 19 THEN 1 ELSE 0 END) AS "Cases 15-19 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 20 AND 24 THEN 1 ELSE 0 END) AS "Cases 20-24 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 25 AND 49 THEN 1 ELSE 0 END) AS "Cases 25-49 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) >= 50 THEN 1 ELSE 0 END) AS "Cases 50+ Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) < 15 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths Below 15 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 15 AND 19 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 15-19 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 20 AND 24 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 20-24 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 25 AND 49 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 25-49 Years",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) >= 50 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 50+ Years"
FROM reporting."108_maternal_neonatal"
WHERE admission_date IS NOT NULL
GROUP BY TO_CHAR(admission_date, 'YYYYMM'), disease_id
ORDER BY report_month DESC;
