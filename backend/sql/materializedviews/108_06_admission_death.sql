--CREATE MATERIALIZED VIEW reporting."108_admission_death" AS
SELECT
    TO_CHAR("admission_date", 'YYYYMM') AS report_month,
    "diagnosis",
SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) <= 4 AND LOWER("gender") = 'male' THEN 1 ELSE 0 END) AS "0-4years Male Cases",
    SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) <= 4 AND LOWER("gender") = 'female' THEN 1 ELSE 0 END) AS "0-4years female Cases",
    SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) >= 5 AND LOWER("gender") = 'male' THEN 1 ELSE 0 END) AS "5years+ Male Cases",
    SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) >= 5 AND LOWER("gender") = 'female' THEN 1 ELSE 0 END) AS "5years+ female Cases",
SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) <= 4 AND LOWER("gender") = 'male' AND "death_date" IS NOT NULL THEN 1 ELSE 0 END) AS "0-4years Male Deaths",
    SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) <= 4 AND LOWER("gender") = 'female' AND "death_date" IS NOT NULL THEN 1 ELSE 0 END) AS "0-4years female Deaths",
    SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) >= 5 AND LOWER("gender") = 'male' AND "death_date" IS NOT NULL THEN 1 ELSE 0 END) AS "5years+ Male Deaths",
    SUM(CASE WHEN DATE_PART('year', age("admission_date", "birth_date")) >= 5 AND LOWER("gender") = 'female' AND "death_date" IS NOT NULL THEN 1 ELSE 0 END) AS "5years+ female Deaths"
FROM reporting."108_inpatient"
GROUP BY TO_CHAR("admission_date", 'YYYYMM'), "diagnosis"
ORDER BY report_month DESC, "diagnosis";



