CREATE MATERIALIZED VIEW reporting."105_02_anc_total" AS
SELECT
  reporting_month,
  COUNT(*) FILTER (WHERE age_years < 15)              AS "Below_15yrs",
  COUNT(*) FILTER (WHERE age_years BETWEEN 15 AND 19) AS "15_19yrs",
  COUNT(*) FILTER (WHERE age_years BETWEEN 20 AND 24) AS "20_24yrs",
  COUNT(*) FILTER (WHERE age_years BETWEEN 25 AND 49) AS "25_50yrs",
  COUNT(*) FILTER (WHERE age_years >= 50)             AS "50+yrs",
  COUNT(*)                                            AS total
FROM (
  SELECT
    reporting_month,
    DATE_PART('year', AGE(visit_date::date, birth_date::date))::int AS age_years
  FROM reporting.anc_visits
) x
GROUP BY reporting_month
ORDER BY reporting_month;
