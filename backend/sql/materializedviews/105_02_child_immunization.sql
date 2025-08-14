create materialized view reporting."105_02_child_immunization" as
SELECT
  TO_CHAR(date_created, 'YYYYMM') AS report_month,
  vaccine_id,
  vaccine_name,
  COUNT(*) FILTER (WHERE age_months BETWEEN 0 AND 11) AS "Under1y",
  COUNT(*) FILTER (WHERE age_months BETWEEN 12 AND 59) AS "1-4y",
  COUNT(*) FILTER (WHERE age_years BETWEEN 5 AND 14) AS "5-14y"
FROM (
  SELECT 
    date_created,
    vaccine_id,
    vaccine_name,
    DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE)) AS age_years,
    (DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE)) * 12 + DATE_PART('month', AGE(CURRENT_DATE, birth_date::DATE))) AS age_months
  FROM reporting.patient_vaccines
) sub
GROUP BY TO_CHAR(date_created, 'YYYYMM'), vaccine_id, vaccine_name
ORDER BY report_month desc;