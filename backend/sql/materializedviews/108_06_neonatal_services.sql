CREATE  VIEW reporting."108_neonatal_services" AS
SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
-- Cases 0-7 days
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 0 AND 7 THEN 1 ELSE 0 END) AS "Cases 0-7 days Total",
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 0 AND 7 AND baby_weight < 2.5 THEN 1 ELSE 0 END) AS "Cases 0-7 days <2.5kg",
-- Cases 8-28 days
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 8 AND 28 THEN 1 ELSE 0 END) AS "Cases 8-28 days Total",
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 8 AND 28 AND baby_weight < 2.5 THEN 1 ELSE 0 END) AS "Cases 8-28 days <2.5kg",
-- Deaths 0-7 days
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 0 AND 7 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 0-7 days Total",
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 0 AND 7 AND death_date IS NOT NULL AND baby_weight < 2.5 THEN 1 ELSE 0 END) AS "Deaths 0-7 days <2.5kg",
-- Deaths 8-28 days
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 8 AND 28 AND death_date IS NOT NULL THEN 1 ELSE 0 END) AS "Deaths 8-28 days Total",
    SUM(CASE WHEN EXTRACT(DAY FROM (newborn_date - admission_date)) BETWEEN 8 AND 28 AND death_date IS NOT NULL AND baby_weight < 2.5 THEN 1 ELSE 0 END) AS "Deaths 8-28 days <2.5kg"
FROM reporting."108_maternal_neonatal"
WHERE newborn_date IS NOT NULL
GROUP BY TO_CHAR(admission_date, 'YYYYMM')
ORDER BY report_month DESC;
