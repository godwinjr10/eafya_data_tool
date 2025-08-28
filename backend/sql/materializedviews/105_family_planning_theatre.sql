CREATE MATERIALIZED VIEW reporting."105_family_planning_theatre" AS
SELECT 
  report_month,
  major_theatre_name,
  COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND major_theater_id in (372, 355, 354) AND gender = 'Female' THEN 1 END) AS "25_49_female_tubal",
  COUNT(CASE WHEN age_years >= 50 AND major_theater_id in (372, 355, 354) AND gender = 'Female' THEN 1 END) AS "50plus_female_tubal",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND major_theater_id = 126 AND gender = 'Male' THEN 1 END) AS "25_49_male_vasectomy",
  COUNT(CASE WHEN age_years >= 50 AND major_theater_id = 126 and gender = 'Male' THEN 1 END) AS "50plus_male_vasectomy"
FROM (
  SELECT 
    TO_CHAR(date_created, 'YYYYMM') AS report_month,
    major_theater_id,
    major_theatre_name,
    gender,
    CASE 
      WHEN birth_date IS NULL OR birth_date::TEXT = '00:00.0' THEN 0
      ELSE DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE))
    END AS age_years
  FROM reporting.patient_major_theater
) sub
GROUP BY report_month, major_theatre_name
ORDER BY report_month, major_theatre_name DESC;







