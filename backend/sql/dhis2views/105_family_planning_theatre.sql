CREATE  VIEW reporting."105_family_planning_theatre" AS
SELECT 
  report_month,
  hmis_code,
  major_theater_name,
  "25_49yrs",
  "50plus_yrs"
FROM (
  -- Tubal ligation (PM01)
  SELECT 
    TO_CHAR(date_created, 'YYYYMM') AS report_month,
    'PM01' AS hmis_code,
    major_theater_name,
    COUNT(CASE WHEN age_years BETWEEN 25 AND 49 THEN 1 END) AS "25_49yrs",
    COUNT(CASE WHEN age_years >= 50 THEN 1 END) AS "50plus_yrs"
  FROM (
    SELECT 
      date_created,
      major_theater_name,
      CASE 
        WHEN birth_date IS NULL OR birth_date::TEXT = '00:00.0' THEN 0
        ELSE DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE))
      END AS age_years
    FROM reporting.patient_major_theater
    WHERE WHERE major_theater_name ILIKE ANY (ARRAY['%vasectomy%','%tubal%'])
  ) sub
  GROUP BY report_month, major_theater_name
  UNION ALL
  -- Vasectomy (PM02)
  SELECT 
    TO_CHAR(date_created, 'YYYYMM') AS report_month,
    'PM02' AS hmis_code,
    major_theater_name,
    COUNT(CASE WHEN age_years BETWEEN 25 AND 49 THEN 1 END) AS "25_49yrs",
    COUNT(CASE WHEN age_years >= 50 THEN 1 END) AS "50plus_yrs"
  FROM (
    SELECT 
      date_created,
      major_theater_name,
      CASE 
        WHEN birth_date IS NULL OR birth_date::TEXT = '00:00.0' THEN 0
        ELSE DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE))
      END AS age_years
    FROM reporting.patient_major_theater
  ) sub
  GROUP BY report_month, major_theater_name
) combined
ORDER BY report_month, hmis_code, major_theater_name DESC;