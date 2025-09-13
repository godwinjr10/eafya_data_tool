CREATE OR REPLACE VIEW reporting.re_attendance AS
WITH visit_diagnosis AS (
  -- One row per (patient, visit, disease) to avoid duplicates from multiple encounters in the same visit
  SELECT
    d.patient_id,
    v.id                               AS visit_no,
    v.date_created::date               AS visit_date,
    DATE_TRUNC('month', v.date_created)::date AS report_month,
    c.name                             AS clinic_name,
    n.disease_id
  FROM dwh.fact_eafya_patient_visit       v
  JOIN dwh.fact_eafya_clinic_session      s  ON s.patient_visit_id   = v.id
  JOIN dwh.fact_eafya_encounters          e  ON e.clinic_session_id  = s.id
  JOIN dwh.fact_eafya_patient_disease     n  ON n.encounter_id       = e.id
  JOIN dwh.dim_eafya_registered_patients  d  ON d.patient_id         = v.patient_id
  JOIN dwh.dim_eafya_clinic               c  ON c.id                 = s.clinic_id
  WHERE e.origin = 'op'
  GROUP BY d.patient_id, v.id, v.date_created, c.name, n.disease_id
),
base AS (
  SELECT
    vd.patient_id,
    vd.visit_no,
    vd.visit_date,
    vd.clinic_name,
    vd.disease_id,
    g."name"                                        AS disease_name,
    p.gender,
    p.birth_date::date                              AS birth_date,
    (vd.visit_date - p.birth_date::date)            AS age_days_raw, -- integer days (may be NULL)
    DATE_PART('year', AGE(vd.visit_date, p.birth_date))::int AS age_years,
    vd.report_month
  FROM visit_diagnosis vd
  JOIN dwh.dim_eafya_disease             g ON g.id         = vd.disease_id
  JOIN dwh.dim_eafya_registered_patients p ON p.patient_id = vd.patient_id
)
SELECT
  b.patient_id,
  b.visit_no,
  b.visit_date,
  b.clinic_name,
  b.disease_id,
  b.disease_name,
  b.gender,
  b.birth_date,
  /* Show age in days only for neonates (0–29 days); otherwise NULL */
  CASE WHEN b.age_days_raw IS NOT NULL AND b.age_days_raw < 30 THEN b.age_days_raw END AS age_days,
  b.age_years,
  b.report_month
FROM base b
WHERE
  /* Re-attendance only: there exists an earlier visit (earlier date) in the same month for same patient+disease */
  EXISTS (
    SELECT 1
    FROM visit_diagnosis vd0
    WHERE vd0.patient_id   = b.patient_id
      AND vd0.disease_id   = b.disease_id
      AND vd0.report_month = b.report_month
      AND vd0.visit_date   < b.visit_date
  )
ORDER BY b.patient_id, b.disease_id, b.visit_date;