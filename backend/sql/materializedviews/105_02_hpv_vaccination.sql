create materialized view reporting."105_02_hpv_vaccination" as
SELECT
  TO_CHAR(date_created, 'YYYYMM') AS report_month,
  vaccine_id,
  vaccine_name,
  COUNT(CASE WHEN age_years = 10 AND gender = 'Male' THEN 1 END) AS "10y Male",
  COUNT(CASE WHEN age_years = 10 AND gender = 'Female' THEN 1 END) AS "10y Female",
  COUNT(CASE WHEN age_years >= 11 AND gender = 'Male' THEN 1 END) AS "11y+ Male",
  COUNT(CASE WHEN age_years >= 11 AND gender = 'Female' THEN 1 END) AS "11y+ Female"
FROM (
  SELECT 
    date_created,
    vaccine_id,
    vaccine_name,
    gender,
    DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE)) AS age_years,
    (DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE)) * 12 + DATE_PART('month', AGE(CURRENT_DATE, birth_date::DATE))) AS age_months
  FROM reporting.patient_vaccines 
  WHERE vaccine_id IN (SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%hpv vaccine%' and mapping_id > 0)
) sub
GROUP BY TO_CHAR(date_created, 'YYYYMM'), vaccine_id, vaccine_name
ORDER BY report_month, vaccine_name DESC;