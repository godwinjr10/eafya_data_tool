------- RAW DATA NEW ATTENDANCE ------ 
SELECT 
d.patient_id,
v.id AS visit_no,
v.date_created::date AS visit_date,
n.date_created::date as diagnosised_date,
c.name AS clinic_name,
n.disease_id ,
g."name" as disease_name,
g.simplified_name,
n.classification,
d.gender,
n.date_created::date as diagnosised_date,
d.birth_date::date,
AGE(v.date_created::date, d.birth_date::date) AS age_years,
'New Attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
inner join public.encounter e on e.clinic_session_id = s.id 
inner join public.patient_disease n on n.encounter_id = e.id 
inner join public.disease g on g.id = n.disease_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
AND e.origin = 'op'
ORDER BY v.date_created, d.patient_id, n.disease_id

---- New Attendance only ---New Attendance (per patient, once per month) ---
SELECT DISTINCT ON (d.patient_id, DATE_TRUNC('month', v.date_created))
    d.patient_id,
    v.id AS visit_no,
    v.date_created::date AS visit_date,
    c.name AS clinic_name,
    d.gender,
    d.birth_date::date,
    AGE(v.date_created::date, d.birth_date::date) AS age_years,
    DATE_TRUNC('month', v.date_created)::date AS report_month,
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
INNER JOIN public.encounter e ON e.clinic_session_id = s.id
INNER JOIN public.patient_disease n ON n.encounter_id = e.id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND e.origin = 'op'
ORDER BY d.patient_id, DATE_TRUNC('month', v.date_created), v.date_created;

------ NEW COUNT
WITH visits AS (
    SELECT 
        d.patient_id,
        v.id AS visit_no,
        v.date_created::date AS visit_date,
        c.name AS clinic_name,
        n.disease_id,
        g."name" AS disease_name,
        d.gender,
        d.birth_date::date,
        AGE(v.date_created::date, d.birth_date::date) AS age_years,
        DATE_TRUNC('month', v.date_created)::date AS report_month,
        ROW_NUMBER() OVER (
            PARTITION BY d.patient_id, n.disease_id, DATE_TRUNC('month', v.date_created)
            ORDER BY v.date_created
        ) AS visit_rank,
        COUNT(*) OVER (
            PARTITION BY d.patient_id, n.disease_id, DATE_TRUNC('month', v.date_created)
        ) AS total_visits
    FROM public.patient_visit v
    INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
    INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
    INNER JOIN public.clinic c ON c.id = s.clinic_id
    INNER JOIN public.encounter e ON e.clinic_session_id = s.id 
    INNER JOIN public.patient_disease n ON n.encounter_id = e.id 
    INNER JOIN public.disease g ON g.id = n.disease_id
    WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      AND e.origin = 'op'
)
SELECT
    patient_id,
    visit_no,
    visit_date,
    clinic_name,
    disease_id,
    disease_name,
    gender,
    birth_date,
    age_years,
    report_month,
    1 AS attendance_count,
    'New Attendance' AS attendance_type
FROM visits
WHERE visit_rank = 1
ORDER BY patient_id, disease_id, visit_date;

---- REATTANDANCE
WITH visits AS (
    SELECT 
        d.patient_id,
        v.id AS visit_no,
        v.date_created::date AS visit_date,
        c.name AS clinic_name,
        n.disease_id,
        g."name" AS disease_name,
        d.gender,
        d.birth_date::date,
        AGE(v.date_created::date, d.birth_date::date) AS age_years,
        DATE_TRUNC('month', v.date_created)::date AS report_month,
        ROW_NUMBER() OVER (
            PARTITION BY d.patient_id, n.disease_id, DATE_TRUNC('month', v.date_created)
            ORDER BY v.date_created
        ) AS visit_rank,
        COUNT(*) OVER (
            PARTITION BY d.patient_id, n.disease_id, DATE_TRUNC('month', v.date_created)
        ) AS total_visits
    FROM public.patient_visit v
    INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
    INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
    INNER JOIN public.clinic c ON c.id = s.clinic_id
    INNER JOIN public.encounter e ON e.clinic_session_id = s.id 
    INNER JOIN public.patient_disease n ON n.encounter_id = e.id 
    INNER JOIN public.disease g ON g.id = n.disease_id
    WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      AND e.origin = 'op'
)
SELECT
    patient_id,
    visit_no,
    visit_date,
    clinic_name,
    disease_id,
    disease_name,
    gender,
    birth_date,
    age_years,
    report_month,
    1 AS attendance_count,
    'Re-Attendance' AS attendance_type
FROM visits
WHERE visit_rank > 1
ORDER BY patient_id, disease_id, visit_date;

--- REATTENDANCE TWO -- Any further visits in the month for the same disease are counted as separate re-attendances.
SELECT 
    d.patient_id,
    v.id AS visit_no,
    v.date_created::date AS visit_date,
    c.name AS clinic_name,
    n.disease_id,
    g."name" AS disease_name,
    d.gender,
    d.birth_date::date,
    AGE(v.date_created::date, d.birth_date::date) AS age_years,
    DATE_TRUNC('month', v.date_created)::date AS report_month,
    'Re-Attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
INNER JOIN public.encounter e ON e.clinic_session_id = s.id 
INNER JOIN public.patient_disease n ON n.encounter_id = e.id 
INNER JOIN public.disease g ON g.id = n.disease_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND e.origin = 'op'
  -- any visit after the first one for that condition in the month
  AND v.date_created > (
        SELECT MIN(v2.date_created)
        FROM public.patient_visit v2
        INNER JOIN public.clinic_session s2 ON s2.patient_visit_id = v2.id
        INNER JOIN public.encounter e2 ON e2.clinic_session_id = s2.id
        INNER JOIN public.patient_disease n2 ON n2.encounter_id = e2.id
        WHERE v2.patient_id = v.patient_id
          AND n2.disease_id = n.disease_id
          AND e2.origin = 'op'
          AND DATE_TRUNC('month', v2.date_created) = DATE_TRUNC('month', v.date_created)
    )
ORDER BY d.patient_id, n.disease_id, v.date_created;



------------------
SELECT DISTINCT
  d.patient_id,
  d.gender,
  d.birth_date,
  v.id AS visit_id,
  v.date_created AS visit_date,
  v.is_closed,
  c.id AS clinic_id,
  c.name AS clinic_name,
  s.date_created AS session_date,
  DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) AS age_years,
  (v.date_created::date - d.birth_date::date) AS age_days
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id 
INNER JOIN public.clinic c ON c.id = s.clinic_id 
INNER JOIN public.encounter e ON e.clinic_session_id = s.id 
INNER JOIN public.patient_disease a ON a.encounter_id = e.id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
AND c.id IN (3, 14, 2, 17, 6, 5, 7, 9, 10, 11, 16, 8, 1, 4, 42)
------------------------------------------------------------

SELECT
  d.patient_id,
  v.id AS visit_id,
  d.gender,
  d.birth_date,
  v.date_created AS visit_date,
  AGE(v.date_created::date, d.birth_date::date) AS age,
  --v.is_closed,
  c.id AS clinic_id,
  c.name AS clinic_name
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id 
INNER JOIN public.clinic c ON c.id = s.clinic_id 
--inner JOIN public.encounter e ON e.clinic_session_id = s.id 
--left outer JOIN public.patient_disease a ON a.encounter_id = e.id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
--AND c.id IN (3, 14, 2, 17, 6, 5, 7, 9, 10, 11, 16, 8, 1, 4, 42)
and d.patient_id in ('UG-ABY-648', 'UG-ABP-495', 'UG-ADA-974', 'UG-AEM-661', 'UG-ADW-471', 'UG-AEY-198', 'UG-AJK-276', 'UG-AUG-773') 
order by d.patient_id, v.date_created 
-------------------------------------------------------

-- New Attendance (first visit per patient in the month)
SELECT DISTINCT ON (d.patient_id, DATE_TRUNC('month', v.date_created::date))
  d.patient_id,
  d.gender,
  d.birth_date,
  v.id AS visit_id,
  v.date_created::date AS visit_date,
  c.id AS clinic_id,
  c.name AS clinic_name,
  'New Attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
INNER JOIN public.encounter e ON e.clinic_session_id = s.id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
ORDER BY d.patient_id, DATE_TRUNC('month', v.date_created::date), v.date_created;

-- Re-attendance (all visits NOT equal to the first one)
SELECT *
FROM (
  SELECT
    d.patient_id,
    v.id AS visit_id,
    v.date_created::date AS visit_date,
    c.id AS clinic_id,
    c.name AS clinic_name,
    d.gender,
    d.birth_date,
    'Re-attendance' AS attendance_type,
    MIN(v.date_created::date) OVER (PARTITION BY d.patient_id, DATE_TRUNC('month', v.date_created::date)) AS first_visit
  FROM public.patient_visit v
  INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
  INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
  INNER JOIN public.clinic c ON c.id = s.clinic_id
  INNER JOIN public.encounter e ON e.clinic_session_id = s.id
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
    AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
) sub
WHERE visit_date > first_visit
ORDER BY patient_id, visit_date;

--------------------------
WITH first_visits AS (
  SELECT 
    d.patient_id,
    DATE_TRUNC('month', v.date_created::date) AS visit_month,
    MIN(v.date_created::date) AS first_visit_date
  FROM public.patient_visit v
  INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  GROUP BY d.patient_id, DATE_TRUNC('month', v.date_created::date)
)
SELECT DISTINCT
  d.patient_id,
  d.gender,
  d.birth_date,
  v.id AS visit_id,
  v.date_created::date AS visit_date,
  v.is_closed,
  c.id AS clinic_id,
  c.name AS clinic_name,
  s.date_created AS session_date,
  'Re-attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
INNER JOIN first_visits f 
  ON f.patient_id = d.patient_id
 AND f.visit_month = DATE_TRUNC('month', v.date_created::date)
WHERE v.date_created::date > f.first_visit_date
  AND v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
ORDER BY d.patient_id, visit_date;   -- ✅ use alias, matches SELECT list



--------------------
SELECT
  TO_CHAR(patient_visit_date, 'YYYYMM') AS report_month,
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
  SELECT 
    v.date_created::date AS patient_visit_date,
    d.gender,
    -- Age in years at time of visit
    DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) AS age_years,
    -- Approximate age in days at time of visit
    (DATE_PART('day',   AGE(v.date_created::date, d.birth_date::date)))
    + (DATE_PART('month', AGE(v.date_created::date, d.birth_date::date)) * 30)
    + (DATE_PART('year',  AGE(v.date_created::date, d.birth_date::date)) * 365) AS age_days
  FROM public.patient_visit v
  INNER JOIN public.registered_patient_detail d 
    ON d.patient_id = v.patient_id 
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
) sub
GROUP BY TO_CHAR(patient_visit_date, 'YYYYMM')
ORDER BY report_month DESC;


----- New Attendance 
select 
d.patient_id,
d.gender,
d.birth_date,
v.id ,
v.date_created ,
v.is_closed,
c.id as clinic_id,
c.name as clinic_name,
s.date_created
from public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
inner join public.clinic_session s on s.patient_visit_id = v.id 
inner join public.clinic c on c.id = s.clinic_id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
and c.id in (3, 14, 2, 17, 6,5, 7,9, 10, 11, 16, 8, 1, 4, 42)
order by d.patient_id 


---- Re - attendance 
WITH visits AS (
  SELECT 
    d.patient_id,
    a.disease_id, 
    d.gender,
    d.birth_date,
    v.id AS visit_id,
    v.date_created AS visit_date,
    v.is_closed,
    c.id AS clinic_id,
    c.name AS clinic_name,
    s.date_created AS session_date,
    ROW_NUMBER() OVER (
      PARTITION BY d.patient_id, a.disease_id 
      ORDER BY v.date_created
    ) AS rn
  FROM public.patient_visit v
  INNER JOIN public.registered_patient_detail d 
    ON d.patient_id = v.patient_id 
  INNER JOIN public.clinic_session s 
    ON s.patient_visit_id = v.id 
  INNER JOIN public.clinic c 
    ON c.id = s.clinic_id 
  INNER JOIN public.encounter e 
    ON e.clinic_session_id = s.id 
  INNER JOIN public.patient_disease a 
    ON a.encounter_id = e.id 
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
    AND c.id IN (3, 14, 2, 17, 6, 5, 7, 9, 10, 11, 16, 8, 1, 4, 42)
)
SELECT *
FROM visits
WHERE rn > 1   -- follow-up visits
ORDER BY patient_id, disease_id, visit_date;
