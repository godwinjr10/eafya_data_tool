--- New Attendance Based on Conidtion within the reporting month
select distinct d.patient_id, v.id,
v.date_created AS visit_date,
  --d.patient_id,
  c.name AS clinic_name,
  --v.id AS visit_id,
  --e.id AS encounter_id ,
  --a.disease_id,
  --h."name" as disease_name,
  --h.simplified_name,
  --a.classification,
  d.gender,
  d.birth_date,
  AGE(v.date_created::date, d.birth_date::date) AS age
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id 
INNER JOIN public.clinic c ON c.id = s.clinic_id 
inner JOIN public.encounter e ON e.clinic_session_id = s.id 
inner JOIN public.patient_disease a ON a.encounter_id = e.id 
inner join public.disease h on h.id = a.disease_id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
--AND c.id IN (3, 14, 2, 17, 6, 5, 7, 9, 10, 11, 16, 8, 1, 4, 42)
--where v.patient_id = 'UG-WYW-953'
order by v.date_created,  d.patient_id


---- Re-attendance Script (if the same person comes back 4 times with the same condition, we will count 1 new and 3 re-attendance)
SELECT 
d.patient_id,
v.id AS visit_no,
v.date_created::date AS visit_date,
c.name AS clinic_name,
a.disease_id,
h."name" ,
h.simplified_name ,
d.gender,
d.birth_date,
AGE(v.date_created::date, d.birth_date::date) AS age
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id 
INNER JOIN public.clinic c ON c.id = s.clinic_id 
INNER JOIN public.encounter e ON e.clinic_session_id = s.id 
INNER JOIN public.patient_disease a ON a.encounter_id = e.id 
INNER JOIN public.disease h ON h.id = a.disease_id 
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
AND d.patient_id IN (
        SELECT d2.patient_id
        FROM public.patient_visit v2
        INNER JOIN public.registered_patient_detail d2 ON d2.patient_id = v2.patient_id
        INNER JOIN public.clinic_session s2 ON s2.patient_visit_id = v2.id
        INNER JOIN public.encounter e2 ON e2.clinic_session_id = s2.id
        INNER JOIN public.patient_disease a2 ON a2.encounter_id = e2.id
        WHERE v2.date_created BETWEEN '2025-01-01' AND '2025-01-31'
        GROUP BY d2.patient_id, a2.disease_id
        HAVING COUNT(*) > 1
    )
ORDER BY d.patient_id, a.disease_id, v.date_created;


----- Get only Re-attendance
SELECT 
    patient_id,
    visit_no,
    visit_date,
    clinic_name,
    disease_id,
    gender,
    birth_date,
    age
FROM (
    SELECT 
        d.patient_id,
        v.id AS visit_no,
        v.date_created::date AS visit_date,
        c.name AS clinic_name,
        a.disease_id,
        d.gender,
        d.birth_date,
        AGE(v.date_created::date, d.birth_date::date) AS age,
        ROW_NUMBER() OVER (
            PARTITION BY d.patient_id, a.disease_id 
            ORDER BY v.date_created
        ) AS rn
    FROM public.patient_visit v
    INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
    INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id 
    INNER JOIN public.clinic c ON c.id = s.clinic_id 
    INNER JOIN public.encounter e ON e.clinic_session_id = s.id 
    INNER JOIN public.patient_disease a ON a.encounter_id = e.id 
    WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
) ranked
WHERE rn > 1
ORDER BY patient_id, disease_id, visit_date;

------------
SELECT
  EXTRACT(YEAR FROM sub.visit_month)::INT  AS report_year,
  EXTRACT(MONTH FROM sub.visit_month)::INT AS report_month,
  COUNT(CASE WHEN sub.age < interval '29 days' AND sub.gender = 'Male'   THEN 1 END) AS "0-28d Male New",
  COUNT(CASE WHEN sub.age < interval '29 days' AND sub.gender = 'Female' THEN 1 END) AS "0-28d Female New",
  COUNT(CASE WHEN sub.age >= interval '29 days' AND sub.age < interval '5 years' AND sub.gender = 'Male'   THEN 1 END) AS "29d-4y Male New",
  COUNT(CASE WHEN sub.age >= interval '29 days' AND sub.age < interval '5 years' AND sub.gender = 'Female' THEN 1 END) AS "29d-4y Female New",
  COUNT(CASE WHEN sub.age >= interval '5 years' AND sub.age < interval '10 years' AND sub.gender = 'Male'   THEN 1 END) AS "5-9y Male New",
  COUNT(CASE WHEN sub.age >= interval '5 years' AND sub.age < interval '10 years' AND sub.gender = 'Female' THEN 1 END) AS "5-9y Female New",
  COUNT(CASE WHEN sub.age >= interval '10 years' AND sub.age < interval '20 years' AND sub.gender = 'Male'   THEN 1 END) AS "10-19y Male New",
  COUNT(CASE WHEN sub.age >= interval '10 years' AND sub.age < interval '20 years' AND sub.gender = 'Female' THEN 1 END) AS "10-19y Female New",
  COUNT(CASE WHEN sub.age >= interval '20 years' AND sub.gender = 'Male'   THEN 1 END) AS "20y+ Male New",
  COUNT(CASE WHEN sub.age >= interval '20 years' AND sub.gender = 'Female' THEN 1 END) AS "20y+ Female New"
FROM (
    SELECT DISTINCT ON (d.patient_id)   -- 👈 take only the first visit per patient
        d.patient_id,
        d.gender,
        AGE(v.date_created::date, d.birth_date::date) AS age,
        DATE_TRUNC('month', v.date_created::date)     AS visit_month,
        v.date_created
    FROM public.patient_visit v
    INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
    INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
    INNER JOIN public.clinic c ON c.id = s.clinic_id
    INNER JOIN public.encounter e ON e.clinic_session_id = s.id
    INNER JOIN public.patient_disease a ON a.encounter_id = e.id
    INNER JOIN public.disease h ON h.id = a.disease_id
    WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
    ORDER BY d.patient_id, v.date_created  -- ensures first visit is picked
) sub
GROUP BY EXTRACT(YEAR FROM sub.visit_month), EXTRACT(MONTH FROM sub.visit_month)
ORDER BY report_year, report_month;

