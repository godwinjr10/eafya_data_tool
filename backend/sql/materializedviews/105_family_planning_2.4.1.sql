CREATE MATERIALIZED VIEW reporting."105_family_planning_2.4.1" AS
SELECT 
  report_month,
  family_planning_name,
  COUNT(CASE WHEN age_years < 15 AND treatment_stage = 'new' THEN 1 END) AS "under_15_new",
  COUNT(CASE WHEN age_years < 15 AND treatment_stage = 'revisit' THEN 1 END) AS "under_15_revisit",
  COUNT(CASE WHEN age_years BETWEEN 15 AND 19 AND treatment_stage = 'new' THEN 1 END) AS "15_19_new",
  COUNT(CASE WHEN age_years BETWEEN 15 AND 19 AND treatment_stage = 'revisit' THEN 1 END) AS "15_19_revisit",
  COUNT(CASE WHEN age_years BETWEEN 20 AND 24 AND treatment_stage = 'new' THEN 1 END) AS "20_24_new",
  COUNT(CASE WHEN age_years BETWEEN 20 AND 24 AND treatment_stage = 'revisit' THEN 1 END) AS "20_24_revisit",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND treatment_stage = 'new' THEN 1 END) AS "25_49_new",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND treatment_stage = 'revisit' THEN 1 END) AS "25_49_revisit",
  COUNT(CASE WHEN age_years >= 50 AND treatment_stage = 'new' THEN 1 END) AS "50_plus_new",
  COUNT(CASE WHEN age_years >= 50 AND treatment_stage = 'revisit' THEN 1 END) AS "50_plus_revisit"
FROM (
  SELECT 
    TO_CHAR(fp_administered_date, 'YYYYMM') AS report_month,
    family_planning_name,
    treatment_stage,
    CASE 
      WHEN birth_date IS NULL OR birth_date::TEXT = '00:00.0' THEN 0
      ELSE DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE))
    END AS age_years
  FROM reporting.patient_family_planning
) sub
GROUP BY report_month, family_planning_name
ORDER BY report_month, family_planning_name DESC;