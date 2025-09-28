CREATE VIEW reporting."108_mental_health" AS
SELECT
    TO_CHAR(diagnosised_date, 'YYYYMM') AS report_month,
    disease,
    disease_id,
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) < 5 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "<5Y Male",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) < 5 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "<5Y Female",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 5 AND 9 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "5-9Y Male",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 5 AND 9 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "5-9Y Female",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 10 AND 19 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "10-19Y Male",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 10 AND 19 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "10-19Y Female",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 20 AND 34 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "20-34Y Male",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 20 AND 34 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "20-34Y Female",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 35 AND 59 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "35-59Y Male",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) BETWEEN 35 AND 59 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "35-59Y Female",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) >= 60 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "60+Y Male",
    SUM(CASE WHEN DATE_PART('year', age(diagnosised_date, birth_date)) >= 60 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "60+Y Female"
FROM reporting.inpatient_conditions
GROUP BY TO_CHAR(diagnosised_date, 'YYYYMM'), disease, disease_id
ORDER BY report_month DESC, disease;
