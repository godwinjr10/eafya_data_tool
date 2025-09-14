CREATE MATERIALIZED VIEW reporting."105_02_anc_anaemia_confirmed" AS
SELECT
TO_CHAR(report_month, 'YYYYMM')                            AS report_month,
COUNT(*) FILTER (WHERE age_years < 15)                     AS "below_15_years",
COUNT(*) FILTER (WHERE age_years BETWEEN 15 AND 19)        AS "15-19_years",
COUNT(*) FILTER (WHERE age_years BETWEEN 20 AND 24)        AS "20-24_years",
COUNT(*) FILTER (WHERE age_years BETWEEN 25 AND 49)        AS "25-49_years",
COUNT(*) FILTER (WHERE age_years >= 50)                    AS "50+_years",
COUNT(*)                                                   AS total_cases
FROM (
  SELECT
    patient_id,
    DATE_TRUNC('month', diagnosised_date)::date              AS report_month,
    DATE_PART('year', AGE(diagnosised_date::date, birth_date::date))::int            AS age_years
  FROM reporting.patient_conditions
  WHERE disease ILIKE '%Anaemia%'
    AND classification = 'Confirmed'
    AND origin = 'op'
    AND gender = 'Female'
) x
GROUP BY report_month
ORDER BY report_month;





