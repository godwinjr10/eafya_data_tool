--- Conditions Base Query -----
SELECT 
d.patient_id,
p.disease_id,
v.id AS visit_id,
d.gender,
v.date_created,
d.birth_date,
DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) AS age_years,
(p.date_created::date - d.birth_date::date) AS age_days
FROM public.patient_disease p
INNER JOIN public.encounter e       ON e.id = p.encounter_id 
INNER JOIN public.clinic_session s  ON s.id = e.clinic_session_id
INNER JOIN public.patient_visit v   ON v.id = s.patient_visit_id 
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31';

-------- Attendance Sript ----------
SELECT
TO_CHAR(patient_visit_date, 'YYYY-MM') AS report_month,
COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Male'   THEN 1 END) AS "0-28d Male",
COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Female' THEN 1 END) AS "0-28d Female",
COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Male'   THEN 1 END) AS "29d-4y Male",
COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Female' THEN 1 END) AS "29d-4y Female",
COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Male'   THEN 1 END) AS "5-9y Male",
COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Female' THEN 1 END) AS "5-9y Female",
COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Male'   THEN 1 END) AS "10-19y Male",
COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Female' THEN 1 END) AS "10-19y Female",
COUNT(CASE WHEN age_years >= 20 AND gender = 'Male'   THEN 1 END) AS "20y+ Male",
COUNT(CASE WHEN age_years >= 20 AND gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM (
SELECT distinct 
v.date_created::date AS patient_visit_date,
d.gender,
DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) AS age_years,
(v.date_created::date - d.birth_date::date) AS age_days
FROM public.patient_disease p
INNER JOIN public.encounter e            ON e.id = p.encounter_id 
INNER JOIN public.clinic_session s       ON s.id = e.clinic_session_id
INNER JOIN public.patient_visit v        ON v.id = s.patient_visit_id 
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
and p.classification ='Confirmed'
) sub
GROUP BY TO_CHAR(patient_visit_date, 'YYYY-MM')
ORDER BY report_month DESC;

----- Re -attendance Script -----
SELECT 
d.patient_id,
p.disease_id,
v.id AS visit_id,
v.date_created AS visit_date,
d.gender,
d.birth_date,
DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) AS age_years,
(v.date_created::date - d.birth_date::date) AS age_days
FROM public.patient_disease p
INNER JOIN public.encounter e            ON e.id = p.encounter_id 
INNER JOIN public.clinic_session s       ON s.id = e.clinic_session_id
INNER JOIN public.patient_visit v        ON v.id = s.patient_visit_id 
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND (d.patient_id, p.disease_id) IN (
      SELECT d2.patient_id, p2.disease_id
      FROM public.patient_disease p2
      INNER JOIN public.encounter e2       ON e2.id = p2.encounter_id
      INNER JOIN public.clinic_session s2  ON s2.id = e2.clinic_session_id
      INNER JOIN public.patient_visit v2   ON v2.id = s2.patient_visit_id
      INNER JOIN public.registered_patient_detail d2 ON d2.patient_id = v2.patient_id
      WHERE v2.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      GROUP BY d2.patient_id, p2.disease_id
      HAVING COUNT(*) > 1
  )
ORDER BY d.patient_id, p.disease_id, v.date_created;

-------Script Three -------------
SELECT
d.patient_id,
p.disease_id,
v.id AS visit_id,
v.date_created AS visit_date,
d.gender,
d.birth_date,
DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) AS age_years,
(v.date_created::date - d.birth_date::date) AS age_days,
    CASE
        WHEN (v.date_created::date - d.birth_date::date) BETWEEN 0 AND 28 THEN '0-28d'
        WHEN (v.date_created::date - d.birth_date::date) >= 29 AND DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) < 5 THEN '29d-4y'
        WHEN DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) BETWEEN 5 AND 9 THEN '5-9y'
        WHEN DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) BETWEEN 10 AND 19 THEN '10-19y'
        WHEN DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) BETWEEN 20 AND 24 THEN '20-24y'
        WHEN DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) >= 25 THEN '25y+'
    END AS age_band
FROM public.patient_disease p
INNER JOIN public.encounter e            ON e.id = p.encounter_id 
INNER JOIN public.clinic_session s       ON s.id = e.clinic_session_id
INNER JOIN public.patient_visit v        ON v.id = s.patient_visit_id 
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND (d.patient_id, p.disease_id) IN (
      SELECT d2.patient_id, p2.disease_id
      FROM public.patient_disease p2
      INNER JOIN public.encounter e2       ON e2.id = p2.encounter_id
      INNER JOIN public.clinic_session s2  ON s2.id = e2.clinic_session_id
      INNER JOIN public.patient_visit v2   ON v2.id = s2.patient_visit_id
      INNER JOIN public.registered_patient_detail d2 ON d2.patient_id = v2.patient_id
      WHERE v2.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      GROUP BY d2.patient_id, p2.disease_id
      HAVING COUNT(*) > 1
  )
ORDER BY d.patient_id, p.disease_id, v.date_created;


--------- Aggregrate Scripts ------
SELECT 
TO_CHAR(p.date_created, 'YYYYMM') AS report_month,
COUNT(CASE WHEN (p.date_created::date - d.birth_date::date) BETWEEN 0 AND 28 AND d.gender = 'Male' THEN 1 END) AS "0-28d Male",
COUNT(CASE WHEN (p.date_created::date - d.birth_date::date) BETWEEN 0 AND 28 AND d.gender = 'Female' THEN 1 END) AS "0-28d Female",
COUNT(CASE WHEN (p.date_created::date - d.birth_date::date) >= 29 AND DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) < 5
                  AND d.gender = 'Male' THEN 1 END) AS "29d-4y Male",
COUNT(CASE WHEN (p.date_created::date - d.birth_date::date) >= 29 AND DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) < 5
                  AND d.gender = 'Female' THEN 1 END) AS "29d-4y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) BETWEEN 5 AND 9 AND d.gender = 'Male' THEN 1 END) AS "5-9y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) BETWEEN 5 AND 9 AND d.gender = 'Female' THEN 1 END) AS "5-9y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) BETWEEN 10 AND 19 AND d.gender = 'Male' THEN 1 END) AS "10-19y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) BETWEEN 10 AND 19 AND d.gender = 'Female' THEN 1 END) AS "10-19y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) >= 20 AND d.gender = 'Male' THEN 1 END) AS "20y+ Male",
COUNT(CASE WHEN DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) >= 20 AND d.gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM public.patient_disease p
INNER JOIN public.encounter e       ON e.id = p.encounter_id 
INNER JOIN public.clinic_session s  ON s.id = e.clinic_session_id
INNER JOIN public.patient_visit v   ON v.id = s.patient_visit_id 
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
and p.classification ='Confirmed'
GROUP BY TO_CHAR(p.date_created, 'YYYYMM')
ORDER BY report_month;


----- Old Style -----
SELECT
  TO_CHAR(patient_visit_date, 'YYYY-MM') AS report_month,
  -- 0–28 days
  COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Male'   THEN 1 END) AS "0-28d Male",
  COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Female' THEN 1 END) AS "0-28d Female",
  -- 29 days – 4 years
  COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Male'   THEN 1 END) AS "29d-4y Male",
  COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Female' THEN 1 END) AS "29d-4y Female",
  -- 5–9 years
  COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Male'   THEN 1 END) AS "5-9y Male",
  COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Female' THEN 1 END) AS "5-9y Female",
  -- 10–19 years
  COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Male'   THEN 1 END) AS "10-19y Male",
  COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Female' THEN 1 END) AS "10-19y Female",
  -- 20 years and above
  COUNT(CASE WHEN age_years >= 20 AND gender = 'Male'   THEN 1 END) AS "20y+ Male",
  COUNT(CASE WHEN age_years >= 20 AND gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM (
  SELECT 
    v.date_created::date AS patient_visit_date,
    d.gender,
    -- Age in years at time of visit
    DATE_PART('year', AGE(p.date_created::date, d.birth_date::date)) AS age_years,
    -- Age in days at time of visit
    DATE_PART('day',   AGE(p.date_created::date, d.birth_date::date))
    + DATE_PART('month', AGE(p.date_created::date, d.birth_date::date)) * 30
    + DATE_PART('year',  AGE(p.date_created::date, d.birth_date::date)) * 365 AS age_days
  FROM public.patient_disease p
  INNER JOIN public.encounter e            ON e.id = p.encounter_id 
  INNER JOIN public.clinic_session s       ON s.id = e.clinic_session_id
  INNER JOIN public.patient_visit v        ON v.id = s.patient_visit_id 
  INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
) sub
GROUP BY TO_CHAR(patient_visit_date, 'YYYY-MM')
ORDER BY report_month DESC;

