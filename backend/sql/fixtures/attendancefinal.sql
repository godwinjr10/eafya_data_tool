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

---- New Attendance
SELECT 
COUNT(CASE WHEN AGE(deduped.visit_date, deduped.birth_date) < interval '29 days' AND deduped.gender = 'Male' THEN 1 END) AS "0-28d Male",
COUNT(CASE WHEN AGE(deduped.visit_date, deduped.birth_date) < interval '29 days' AND deduped.gender = 'Female' THEN 1 END) AS "0-28d Female",
COUNT(CASE WHEN AGE(deduped.visit_date, deduped.birth_date) >= interval '29 days'AND AGE(deduped.visit_date, deduped.birth_date) < interval '5 years'AND deduped.gender = 'Male' THEN 1 END) AS "29d-4y Male",
COUNT(CASE WHEN AGE(deduped.visit_date, deduped.birth_date) >= interval '29 days'AND AGE(deduped.visit_date, deduped.birth_date) < interval '5 years'AND deduped.gender = 'Female' THEN 1 END) AS "29d-4y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(deduped.visit_date, deduped.birth_date)) BETWEEN 5 AND 9 AND deduped.gender = 'Male' THEN 1 END) AS "5-9y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(deduped.visit_date, deduped.birth_date)) BETWEEN 5 AND 9 AND deduped.gender = 'Female' THEN 1 END) AS "5-9y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(deduped.visit_date, deduped.birth_date)) BETWEEN 10 AND 19 AND deduped.gender = 'Male' THEN 1 END) AS "10-19y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(deduped.visit_date, deduped.birth_date)) BETWEEN 10 AND 19 AND deduped.gender = 'Female' THEN 1 END) AS "10-19y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(deduped.visit_date, deduped.birth_date)) >= 20 AND deduped.gender = 'Male' THEN 1 END) AS "20y+ Male",
COUNT(CASE WHEN DATE_PART('year', AGE(deduped.visit_date, deduped.birth_date)) >= 20 AND deduped.gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM (
    SELECT DISTINCT ON (d.patient_id, DATE_TRUNC('month', v.date_created))
        d.patient_id,
        v.date_created::date AS visit_date,
        d.birth_date,
        d.gender
    FROM public.patient_visit v
    INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
    INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
    INNER JOIN public.clinic c ON c.id = s.clinic_id
    INNER JOIN public.encounter e ON e.clinic_session_id = s.id
    INNER JOIN public.patient_disease n ON n.encounter_id = e.id
    WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      AND e.origin = 'op'
    ORDER BY d.patient_id, DATE_TRUNC('month', v.date_created), v.date_created
) AS deduped;

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

----- Reattendance Count -----
SELECT 
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) < interval '29 days'AND rev.gender = 'Male' THEN 1 END) AS "0-28d Male",
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) < interval '29 days'AND rev.gender = 'Female' THEN 1 END) AS "0-28d Female",
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) >= interval '29 days'AND AGE(rev.visit_date, rev.birth_date) < interval '5 years'AND rev.gender = 'Male' THEN 1 END) AS "29d-4y Male",
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) >= interval '29 days'AND AGE(rev.visit_date, rev.birth_date) < interval '5 years'AND rev.gender = 'Female' THEN 1 END) AS "29d-4y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 5 AND 9 AND rev.gender = 'Male' THEN 1 END) AS "5-9y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 5 AND 9 AND rev.gender = 'Female' THEN 1 END) AS "5-9y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 10 AND 19 AND rev.gender = 'Male' THEN 1 END) AS "10-19y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 10 AND 19 AND rev.gender = 'Female' THEN 1 END) AS "10-19y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) >= 20 AND rev.gender = 'Male' THEN 1 END) AS "20y+ Male",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) >= 20 AND rev.gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM (
    SELECT 
        d.patient_id,
        v.date_created::date AS visit_date,
        d.birth_date,
        d.gender,
        n.disease_id
    FROM public.patient_visit v
    INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
    INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
    INNER JOIN public.clinic c ON c.id = s.clinic_id
    INNER JOIN public.encounter e ON e.clinic_session_id = s.id
    INNER JOIN public.patient_disease n ON n.encounter_id = e.id
    WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      AND e.origin = 'op'
      -- keep only re-attendance (exclude the first visit for that condition in the month)
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
) AS rev;


---- Reattandance Fix ----
SELECT 
TO_CHAR(visit_date, 'YYYYMM') AS report_month,
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) < interval '29 days'AND rev.gender = 'Male' THEN 1 END) AS "0-28d Male",
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) < interval '29 days'AND rev.gender = 'Female' THEN 1 END) AS "0-28d Female",
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) >= interval '29 days'AND AGE(rev.visit_date, rev.birth_date) < interval '5 years'AND rev.gender = 'Male' THEN 1 END) AS "29d-4y Male",
COUNT(CASE WHEN AGE(rev.visit_date, rev.birth_date) >= interval '29 days'AND AGE(rev.visit_date, rev.birth_date) < interval '5 years'AND rev.gender = 'Female' THEN 1 END) AS "29d-4y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 5 AND 9 AND rev.gender = 'Male' THEN 1 END) AS "5-9y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 5 AND 9 AND rev.gender = 'Female' THEN 1 END) AS "5-9y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 10 AND 19 AND rev.gender = 'Male' THEN 1 END) AS "10-19y Male",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) BETWEEN 10 AND 19 AND rev.gender = 'Female' THEN 1 END) AS "10-19y Female",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) >= 20 AND rev.gender = 'Male' THEN 1 END) AS "20y+ Male",
COUNT(CASE WHEN DATE_PART('year', AGE(rev.visit_date, rev.birth_date)) >= 20 AND rev.gender = 'Female' THEN 1 END) AS "20y+ Female"
FROM (
    SELECT 
        d.patient_id,
        d.date_created::date AS visit_date,
        d.birth_date,
        d.gender,
        d.disease_id
    FROM reporting.patient_diagnosis d
    --WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      --AND e.origin = 'op'
      -- keep only re-attendance (exclude the first visit for that condition in the month)
      where d.date_created > (
            SELECT MIN(date_created)
            FROM reporting.patient_diagnosis
            WHERE DATE_TRUNC('month', date_created) = DATE_TRUNC('month', d.date_created)
      )
) AS rev
GROUP BY TO_CHAR(visit_date, 'YYYYMM')
ORDER BY report_month DESC;