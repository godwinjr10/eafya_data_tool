
CREATE VIEW reporting."105_02_anc_folic" AS
SELECT
  TO_CHAR(report_month, 'YYYYMM') AS report_month,
  COUNT(*) FILTER (WHERE age_years < 15)                   AS "below_15_years",
  COUNT(*) FILTER (WHERE age_years BETWEEN 15 AND 19)      AS "15-19_years",
  COUNT(*) FILTER (WHERE age_years BETWEEN 20 AND 24)      AS "20-24_years",
  COUNT(*) FILTER (WHERE age_years BETWEEN 25 AND 49)      AS "25-49_years",
  COUNT(*) FILTER (WHERE age_years >= 50)                  AS "50+_years",
  COUNT(*)                                                AS total
FROM (
  SELECT
    patient_id,
    DATE_TRUNC('month', COALESCE(treatment_date, visit_date))::date AS report_month,
    DATE_PART('year',
      AGE(COALESCE(treatment_date, visit_date)::date, birth_date::date)
    )::int AS age_years
  FROM reporting.patient_prescriptions
  WHERE drug_name ILIKE '%folic%'
  AND origin = 'op'
  AND gender = 'Female'
  And clinic_id IN (SELECT mapping_id FROM reporting.customizationset where name ilike '%antenatal%' and mapping_id > 0)
) x
GROUP BY report_month
ORDER BY report_month;



