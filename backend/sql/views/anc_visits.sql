create view reporting.anc_visits as 
WITH visits AS (
  -- one row per visit_no (pick the earliest encounter in that visit)
  SELECT DISTINCT ON (pa.visit_no)
    pa.patient_id,
    pa.visit_no AS visit_id,
    pa.visit_date,
    pa.encounter_date,        -- used only for choosing the earliest row per visit
    pa.clinic,
    pa.visit_type,
    pa.first_name,
    pa.last_name,
    pa.birth_date,
    pa.gender,
    pa.nationality_id,
    pa.origin,
    pa.clinic_id
  FROM reporting.patient_antenatal pa
  WHERE pa.clinic_id = 1
    AND pa.gender = 'Female'
    AND pa.origin = 'op'              -- OPD only
  ORDER BY pa.visit_no, pa.encounter_date
)
select
v.patient_id,
  v.visit_id,
  v.visit_date,
  TO_CHAR(v.visit_date, 'YYYYMM') AS reporting_month,
  v.clinic,
  v.visit_type,
  v.first_name,
  v.last_name,
  v.birth_date,
  v.gender,
  v.nationality_id,
  v.origin,
  ROW_NUMBER() OVER (
    PARTITION BY v.patient_id
    ORDER BY v.visit_date
  ) AS visit_count
FROM visits v
ORDER BY v.patient_id, v.visit_id, v.visit_date;