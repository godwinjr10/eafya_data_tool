CREATE VIEW reporting."105_02_anc_anaemia_tested" AS
SELECT
  TO_CHAR(report_month, 'YYYYMM') AS report_month,
  COUNT(*) FILTER (WHERE age_years < 15)                   AS "below_15_years",
  COUNT(*) FILTER (WHERE age_years BETWEEN 15 AND 19)      AS "15-19_years",
  COUNT(*) FILTER (WHERE age_years BETWEEN 20 AND 24)      AS "20-24_years",
  COUNT(*) FILTER (WHERE age_years BETWEEN 25 AND 49)      AS "25-49_years",
  COUNT(*) FILTER (WHERE age_years >= 50)                  AS "50+_years",
  COUNT(*)                                                AS total_tests,
  COUNT(DISTINCT patient_id)                              AS total_women
FROM (
  SELECT
    patient_id,
    DATE_TRUNC('month', lab_test_date)::date AS report_month,
    DATE_PART('year', AGE(lab_test_date::date, birth_date::date))::int AS age_years
  FROM reporting.patient_labtests
  WHERE clinic_id IN (SELECT mapping_id FROM reporting.materialized_view_ids WHERE name ILIKE '%antenatal%' AND mapping_id > 0)
    AND gender = 'Female'
    AND origin = 'op'
    AND lab_test_name ILIKE '%HB%'
    AND status = 'Tested'
) x
GROUP BY report_month
ORDER BY report_month;
