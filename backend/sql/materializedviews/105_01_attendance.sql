CREATE MATERIALIZED VIEW reporting."105_01_attendance" AS
SELECT
  TO_CHAR(report_month, 'YYYYMM') AS report_month,
'sv6SeKroHPV' as dataelement,
  COUNT(*) FILTER (WHERE age_days BETWEEN 0 AND 28 AND gender = 'Male')   AS "0-28d Male",
  COUNT(*) FILTER (WHERE age_days BETWEEN 0 AND 28 AND gender = 'Female') AS "0-28d Female",
  COUNT(*) FILTER (WHERE age_days >= 29 AND age_years < 5 AND gender = 'Male')   AS "29d-4y Male",
  COUNT(*) FILTER (WHERE age_days >= 29 AND age_years < 5 AND gender = 'Female') AS "29d-4y Female",
  COUNT(*) FILTER (WHERE age_years BETWEEN 5 AND 9  AND gender = 'Male')   AS "5-9y Male",
  COUNT(*) FILTER (WHERE age_years BETWEEN 5 AND 9  AND gender = 'Female') AS "5-9y Female",
  COUNT(*) FILTER (WHERE age_years BETWEEN 10 AND 19 AND gender = 'Male')   AS "10-19y Male",
  COUNT(*) FILTER (WHERE age_years BETWEEN 10 AND 19 AND gender = 'Female') AS "10-19y Female",
  COUNT(*) FILTER (WHERE age_years >= 20 AND gender = 'Male')   AS "20y+ Male",
  COUNT(*) FILTER (WHERE age_years >= 20 AND gender = 'Female') AS "20y+ Female"
FROM (
  SELECT
    gender,
    (visit_date::date - birth_date::date)                                         AS age_days,
    DATE_PART('year', AGE(visit_date::date, birth_date::date))::int               AS age_years,
    report_month
  FROM reporting.new_attendance
) x
GROUP BY report_month
ORDER BY report_month desc;