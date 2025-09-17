CREATE VIEW reporting."105_family_planning_visits" AS
WITH src AS (
  SELECT 
    TO_CHAR(fp_administered_date, 'YYYYMM') AS report_month,
    family_planning_name,
    /* Map FP method to HMIS code */
    CASE
      WHEN UPPER(TRIM(family_planning_name)) = 'COC'              THEN 'FPO1'
      WHEN UPPER(TRIM(family_planning_name)) = 'POP'              THEN 'FP02'
      WHEN UPPER(TRIM(family_planning_name)) = 'ECP'              THEN 'FP03'
      WHEN UPPER(TRIM(family_planning_name)) = 'DMPA'             THEN 'FP04'
      WHEN UPPER(TRIM(family_planning_name)) = '3 YRS IMPLANT'    THEN 'FP06'
      WHEN UPPER(TRIM(family_planning_name)) = '5 YRS IMPLANT'    THEN 'FP07'
      WHEN UPPER(TRIM(family_planning_name)) IN ('IUP','IUD','IUCD') THEN 'FP08'
      ELSE NULL
    END AS hmis_code,
    treatment_stage,
    CASE 
      WHEN birth_date IS NULL OR birth_date::TEXT = '00:00.0' THEN 0
      ELSE DATE_PART('year', AGE(fp_administered_date::date, birth_date::date))
    END AS age_years
  FROM reporting.patient_family_planning
)
SELECT 
  report_month,
  family_planning_name,
  hmis_code,
  COUNT(CASE WHEN age_years < 15 AND treatment_stage = 'new'     THEN 1 END) AS "under_15_new",
  COUNT(CASE WHEN age_years < 15 AND treatment_stage = 'revisit' THEN 1 END) AS "under_15_revisit",
  COUNT(CASE WHEN age_years BETWEEN 15 AND 19 AND treatment_stage = 'new'     THEN 1 END) AS "15_19_new",
  COUNT(CASE WHEN age_years BETWEEN 15 AND 19 AND treatment_stage = 'revisit' THEN 1 END) AS "15_19_revisit",
  COUNT(CASE WHEN age_years BETWEEN 20 AND 24 AND treatment_stage = 'new'     THEN 1 END) AS "20_24_new",
  COUNT(CASE WHEN age_years BETWEEN 20 AND 24 AND treatment_stage = 'revisit' THEN 1 END) AS "20_24_revisit",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND treatment_stage = 'new'     THEN 1 END) AS "25_49_new",
  COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND treatment_stage = 'revisit' THEN 1 END) AS "25_49_revisit",
  COUNT(CASE WHEN age_years >= 50           AND treatment_stage = 'new'     THEN 1 END) AS "50_plus_new",
  COUNT(CASE WHEN age_years >= 50           AND treatment_stage = 'revisit' THEN 1 END) AS "50_plus_revisit"
FROM src
GROUP BY report_month, family_planning_name, hmis_code
ORDER BY report_month, family_planning_name DESC;