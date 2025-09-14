create materialized view reporting."105_02_child_health" as
SELECT
  TO_CHAR(administered_on, 'YYYYMM') AS report_month,
  'HM03' as hmis_code,
    vaccine_id,
    vaccine_name,
  COUNT(CASE WHEN age_months BETWEEN 0 AND 5 AND gender = 'Male' THEN 1 END) AS "0-5m Male",
  COUNT(CASE WHEN age_months BETWEEN 0 AND 5 AND gender = 'Female' THEN 1 END) AS "0-5m Female",
  COUNT(CASE WHEN age_months BETWEEN 6 AND 11 AND gender = 'Male' THEN 1 END) AS "6-11m Male",
  COUNT(CASE WHEN age_months BETWEEN 6 AND 11 AND gender = 'Female' THEN 1 END) AS "6-11m Female",
  COUNT(CASE WHEN age_months BETWEEN 12 AND 59 AND gender = 'Male' THEN 1 END) AS "12-59m Male",
  COUNT(CASE WHEN age_months BETWEEN 12 AND 59 AND gender = 'Female' THEN 1 END) AS "12-59m Female",
  COUNT(CASE WHEN age_years BETWEEN 5 AND 14 AND gender = 'Male' THEN 1 END) AS "5-14y Male",
  COUNT(CASE WHEN age_years BETWEEN 5 AND 14 AND gender = 'Female' THEN 1 END) AS "5-14y Female"
FROM (
  SELECT 
    administered_on,
    vaccine_id,
    vaccine_name,
    gender,
    DATE_PART('year', AGE(administered_on, birth_date::DATE)) AS age_years,
    (DATE_PART('year', AGE(administered_on, birth_date::DATE)) * 12 + DATE_PART('month', AGE(administered_on, birth_date::DATE))) AS age_months
  FROM reporting.patient_vaccines
  --WHERE vaccine_id IN ('32', '33', '26', '34', '18', '31')
) sub
GROUP BY TO_CHAR(administered_on, 'YYYYMM'), vaccine_id, vaccine_name
ORDER BY report_month, vaccine_name DESC;