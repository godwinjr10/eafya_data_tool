CREATE MATERIALIZED VIEW reporting."105_02_anc_total" AS
SELECT 
  TO_CHAR(date_created, 'YYYYMM') AS report_month,
  'AN04' as hmis_code,
  COUNT(CASE WHEN age_years < 15 THEN 1 END) AS "Below_15yrs",
  COUNT(CASE WHEN age_years BETWEEN 15 AND 19 THEN 1 END) AS "15_19yrs",
  COUNT(CASE WHEN age_years BETWEEN 20 AND 24 THEN 1 END) AS "20_24yrs",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 50 THEN 1 END) AS "25_50yrs",
  COUNT(CASE WHEN age_years > 50 THEN 1 END) AS "50+yrs"
FROM (
  SELECT 
    patient_id,
    birth_date,
    gender,
    patient_visit_id,
    date_created,
    DATE_PART('year', AGE(date_created, birth_date)) AS age_years
  FROM reporting.patient_antenatal
  WHERE gender = 'Female'
  AND clinic_id IN (SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%antenatal%' and mapping_id > 0)
) AS all_visits
GROUP BY TO_CHAR(date_created, 'YYYYMM')
ORDER BY report_month DESC;
