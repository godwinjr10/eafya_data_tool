CREATE VIEW reporting."105_02_anc_fansidar" AS
WITH events AS (
  -- One row per patient × month × visit (earliest record per visit)
  SELECT DISTINCT ON (patient_id, report_month, visit_no)
    patient_id,
    birth_date,
    DATE_TRUNC('month', COALESCE(treatment_date, visit_date))::date AS report_month,
    COALESCE(treatment_date, visit_date) AS event_ts,
    visit_no
  FROM reporting.patient_prescriptions
  WHERE clinic_id IN (SELECT mapping_id FROM reporting.materialized_view_ids where name ilike '%antenatal%' and mapping_id > 0)
    AND origin    = 'op'
    AND gender    = 'Female'
    AND drug_name ILIKE '%FANSIDAR%' 
  ORDER BY patient_id, report_month, visit_no, COALESCE(treatment_date, visit_date)
),
ranked AS (
  SELECT
    patient_id,
    report_month,
    DATE_PART('year', AGE(event_ts::date, birth_date::date))::int AS age_years,
    ROW_NUMBER() OVER (
      PARTITION BY patient_id, report_month
      ORDER BY event_ts, visit_no
    ) AS visit_rank
  FROM events
),
months AS (
  SELECT DISTINCT report_month FROM events
),
ranks AS (
  SELECT generate_series(1,4) AS visit_rank
),
agg AS (
  SELECT
    report_month,
    visit_rank,
    COUNT(DISTINCT patient_id) FILTER (WHERE age_years < 15)              AS below_15_years,
    COUNT(DISTINCT patient_id) FILTER (WHERE age_years BETWEEN 15 AND 19) AS "15_19_years",
    COUNT(DISTINCT patient_id) FILTER (WHERE age_years BETWEEN 20 AND 24) AS "20_24_years",
    COUNT(DISTINCT patient_id) FILTER (WHERE age_years BETWEEN 25 AND 49) AS "25_49_years",
    COUNT(DISTINCT patient_id) FILTER (WHERE age_years >= 50)             AS "50+_years",
    COUNT(DISTINCT patient_id)                                            AS total
  FROM ranked
  WHERE visit_rank BETWEEN 1 AND 4
  GROUP BY report_month, visit_rank
)
SELECT
  TO_CHAR(m.report_month, 'YYYYMM') AS report_month,
  CASE r.visit_rank
    WHEN 1 THEN 'IPT1'
    WHEN 2 THEN 'IPT2'
    WHEN 3 THEN 'IPT3'
    WHEN 4 THEN 'IPT4'
  END AS ipt_dose,
  COALESCE(a.below_15_years, 0) AS "below_15_years",
  COALESCE(a."15_19_years", 0)  AS "15_19_years",
  COALESCE(a."20_24_years", 0)  AS "20_24_years",
  COALESCE(a."25_49_years", 0)  AS "25_49_years",
  COALESCE(a."50+_years", 0)    AS "50+_years",
  COALESCE(a.total, 0)          AS total
FROM months m
CROSS JOIN ranks r
LEFT JOIN agg a
  ON a.report_month = m.report_month
 AND a.visit_rank   = r.visit_rank
ORDER BY m.report_month, r.visit_rank;
