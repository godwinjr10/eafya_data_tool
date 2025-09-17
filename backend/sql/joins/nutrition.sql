----
select distinct 
m.patient_id,
m.encounter_id ,
m.triage_id ,
r.birth_date ,
r.first_name ,
r.last_name,
r.nationality_id,
r.gender
from public.vital_monitor m 
inner join public.triage t on t.id = m.triage_id  
inner join public.vital_type v on v.id = m.vital_type_id  
inner join public.registered_patient_detail r on r.patient_id = m.patient_id 
where m.taken_at between '2025-08-01' and '2025-08-31'
and m.patient_id = 'UG-MEQ-696'
and v.id in (47,46,48,49,50,52,51 )


---- Assessed Nutrition -----------------------------------------------
select distinct 
m.patient_id,
m.encounter_id ,
r.birth_date ,
r.first_name ,
r.last_name,
r.nationality_id,
r.gender
from public.vital_monitor m 
inner join public.triage t on t.id = m.triage_id  
inner join public.vital_type v on v.id = m.vital_type_id  
inner join public.registered_patient_detail r on r.patient_id = m.patient_id 
where m.taken_at between '2025-08-01' and '2025-08-31'
and v.id in (47,46,48,49,50,52,51 )
and m.patient_id = 'UG-MEQ-696'
----------------------------------------------------------------------------

---nutrition ----
select 
s.triage_type_id,
e."name" ,
s.vital_type_id ,
v.caption
from public.triage_type_vital_sign s 
inner join public.triage_type e on e.id = s.triage_type_id 
inner join public.vital_type v on v.id = s.vital_type_id 
where s.triage_type_id = 7

---- Vital Signs ----
select distinct 
--m.admission_id,
--m.created_by_id,
--m.date_created,
--m.encounter_id,
--m.last_updated,
m.patient_id
--m.patient_labour_monitor_id,
--m.taken_at,
--m.triage_id
--m.vital_type_id,
--v.caption,
--m.value
from public.vital_monitor m 
inner join public.vital_type v on v.id = m.vital_type_id 
where m.taken_at between '2025-08-01' and '2025-08-31'
and m.patient_id = 'UG-MEQ-696'
where v.id in (47,46,48,49,50,52,51 )
--and v.id = 47


----- Nutrition Assessed Counts ------
SELECT 
  TO_CHAR(m.taken_at, 'YYYYMM') AS report_month,
  -- 0–5 months
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) = 0 AND EXTRACT(MONTH FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 0 AND 5 AND r.gender = 'Male' THEN r.patient_id END) AS "0-5m Male",
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) = 0 AND EXTRACT(MONTH FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 0 AND 5 AND r.gender = 'Female' THEN r.patient_id END) AS "0-5m Female",
  -- 6–23 months
  COUNT(DISTINCT CASE WHEN (
                              (EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) = 0 
                               AND EXTRACT(MONTH FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 6 AND 11)
                           OR (EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) = 1)
                           )
                           AND r.gender = 'Male' THEN r.patient_id END) AS "6-23m Male",
  COUNT(DISTINCT CASE WHEN (
                              (EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) = 0 
                               AND EXTRACT(MONTH FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 6 AND 11)
                           OR (EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) = 1)
                           )
                           AND r.gender = 'Female' THEN r.patient_id END) AS "6-23m Female",
  -- 24–59 months (2–4 years)
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 2 AND 4 AND r.gender = 'Male' THEN r.patient_id END) AS "24-59m Male",
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 2 AND 4 AND r.gender = 'Female' THEN r.patient_id END) AS "24-59m Female",
  -- 5–9 years
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 5 AND 9 AND r.gender = 'Male' THEN r.patient_id END) AS "5-9y Male",
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 5 AND 9 AND r.gender = 'Female' THEN r.patient_id END) AS "5-9y Female",
  -- 10–19 years
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 10 AND 19 AND r.gender = 'Male' THEN r.patient_id END) AS "10-19y Male",
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 10 AND 19 AND r.gender = 'Female' THEN r.patient_id END) AS "10-19y Female",
  -- 20–24 years
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 20 AND 24 AND r.gender = 'Male' THEN r.patient_id END) AS "20-24y Male",
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) BETWEEN 20 AND 24 AND r.gender = 'Female' THEN r.patient_id END) AS "20-24y Female",
  -- 25+ years
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) >= 25 AND r.gender = 'Male' THEN r.patient_id END) AS "25y+ Male",
  COUNT(DISTINCT CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, r.birth_date)) >= 25 AND r.gender = 'Female' THEN r.patient_id END) AS "25y+ Female",
  -- Total unique patients per month
  COUNT(DISTINCT r.patient_id) AS "Total"
FROM public.vital_monitor m
INNER JOIN public.triage t ON t.id = m.triage_id
INNER JOIN public.vital_type v ON v.id = m.vital_type_id
INNER JOIN public.registered_patient_detail r ON r.patient_id = m.patient_id
WHERE v.id IN (47,46,48,49,50,52,51)
GROUP BY TO_CHAR(m.taken_at, 'YYYYMM')
ORDER BY report_month;
