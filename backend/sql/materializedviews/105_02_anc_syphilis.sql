CREATE MATERIALIZED VIEW reporting."105_02_anc_syphilis" AS
SELECT
  TO_CHAR(DATE_TRUNC('month', lab_test_date), 'YYYYMM') AS report_month,
  gender,
  COUNT(*)                                              AS total_tested,
  COUNT(*) FILTER (WHERE "result" ILIKE ANY (ARRAY['%positive%','%reactive%']))  AS total_positive
FROM reporting.patient_labtests
WHERE lab_test_name ILIKE '%syphilis%'
  AND origin = 'op'
  AND gender IN ('Male','Female')
  AND status = 'Tested'
GROUP BY 1, 2
ORDER BY 1, 2;