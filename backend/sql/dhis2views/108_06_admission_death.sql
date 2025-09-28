CREATE VIEW reporting."108_admission_death" AS
SELECT
    TO_CHAR(diagnosised_date, 'YYYYMM') AS report_month,
    disease,
    disease_id,
SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) <= 4 AND LOWER("gender") = 'male' THEN 1 ELSE 0 END) AS "0-4years Male Cases",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) <= 4 AND LOWER("gender") = 'female' THEN 1 ELSE 0 END) AS "0-4years female Cases",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) >= 5 AND LOWER("gender") = 'male' THEN 1 ELSE 0 END) AS "5years+ Male Cases",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) >= 5 AND LOWER("gender") = 'female' THEN 1 ELSE 0 END) AS "5years+ female Cases",
SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) <= 4 AND LOWER("gender") = 'male' AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "0-4years Male Deaths",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) <= 4 AND LOWER("gender") = 'female' AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "0-4years female Deaths",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) >= 5 AND LOWER("gender") = 'male' AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "5years+ Male Deaths",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) >= 5 AND LOWER("gender") = 'female' AND time_of_death IS NOT NULL THEN 1 ELSE 0 END) AS "5years+ female Deaths"
FROM reporting.inpatient_conditions
GROUP BY TO_CHAR(diagnosised_date, 'YYYYMM'), disease, disease_id
ORDER BY report_month DESC, disease;



