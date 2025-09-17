CREATE VIEW reporting."108_mental_health" AS
SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    diagnosis,
    disease_id,
-- Age <5
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) < 5 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "<5Y Male",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) < 5 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "<5Y Female",
-- Age 5-9
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 5 AND 9 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "5-9Y Male",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 5 AND 9 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "5-9Y Female",
-- Age 10-19
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 10 AND 19 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "10-19Y Male",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 10 AND 19 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "10-19Y Female",
-- Age 20-34
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 20 AND 34 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "20-34Y Male",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 20 AND 34 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "20-34Y Female",
-- Age 35-59
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 35 AND 59 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "35-59Y Male",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) BETWEEN 35 AND 59 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "35-59Y Female",
-- Age 60+
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) >= 60 AND LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS "60+Y Male",
    SUM(CASE WHEN DATE_PART('year', age(admission_date, birth_date)) >= 60 AND LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS "60+Y Female"
FROM reporting."108_inpatient"
GROUP BY TO_CHAR(admission_date, 'YYYYMM'), diagnosis, disease_id
ORDER BY report_month DESC, diagnosis;
