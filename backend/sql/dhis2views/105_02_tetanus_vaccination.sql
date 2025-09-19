create view reporting."105_02_tetanus_vaccination" as
SELECT
  TO_CHAR(DATE_TRUNC('month', administered_on), 'YYYYMM') AS report_month,
  vaccine_id,
  vaccine_name,
  COUNT(*) FILTER (
    WHERE vaccine_name ILIKE '%PREG%' AND vaccine_name NOT ILIKE '%NONE PREG%'
  ) AS pregnant,
  COUNT(*) FILTER (
    WHERE vaccine_name ILIKE '%NONE PREG%'
  ) AS non_pregnant
FROM reporting.patient_vaccines
WHERE vaccine_id IN ('19', '20', '21', '22', '23', '40', '41', '42', '43', '44')
GROUP BY
  TO_CHAR(DATE_TRUNC('month', administered_on), 'YYYYMM'),
  vaccine_id,
  vaccine_name
ORDER BY report_month DESC;
