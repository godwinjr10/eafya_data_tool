CREATE MATERIALIZED VIEW reporting."105_02_anc_hepatitis" AS
SELECT
  TO_CHAR(DATE_TRUNC('month', lab_test_date), 'YYYYMM') AS report_month,
  COUNT(*)                                              AS total_tested,
  COUNT(*) FILTER (WHERE "result" ILIKE ANY (ARRAY['%positive%']))  AS total_positive
FROM reporting.patient_labtests
WHERE lab_test_name ILIKE '%Hepatitis%'
  AND origin = 'op'
  AND gender ='Female'
  AND status = 'Tested'
GROUP BY 1
ORDER BY 1;