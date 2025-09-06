CREATE MATERIALIZED VIEW reporting."105_02_anc_8" AS
SELECT 
  TO_CHAR(first_visit_date, 'YYYYMM') AS report_month,
  'AN03' as hmis_code,
  COUNT(CASE WHEN age_years < 15 THEN 1 END) AS "Below_15yrs",
  COUNT(CASE WHEN age_years BETWEEN 15 AND 19 THEN 1 END) AS "15_19yrs",
  COUNT(CASE WHEN age_years BETWEEN 20 AND 24 THEN 1 END) AS "20_24yrs",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 50 THEN 1 END) AS "25_50yrs",
  COUNT(CASE WHEN age_years > 50 THEN 1 END) AS "50+yrs"
FROM (
  SELECT 
    patient_id,
    MIN(date_created) AS first_visit_date,
    DATE_PART('year', AGE(MIN(date_created), birth_date)) AS age_years
  FROM (
    SELECT DISTINCT ON (patient_id, patient_visit_id)
      patient_id,
      birth_date,
      gender,
      patient_visit_id,
      date_created
    FROM reporting.patient_antenatal
    WHERE gender = 'Female'
    AND clinic_id IN ('1')
    ORDER BY patient_id, patient_visit_id, date_created
  ) AS distinct_visits
  GROUP BY patient_id, birth_date
  HAVING COUNT(*) = 8
) AS patients_with_8_visits
GROUP BY TO_CHAR(first_visit_date, 'YYYYMM')
ORDER BY report_month DESC;
