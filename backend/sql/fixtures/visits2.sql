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


------ New Attendance (first visit of the month per patient)
SELECT DISTINCT ON (d.patient_id, DATE_TRUNC('month', v.date_created::date))
  d.patient_id,
  d.gender,
  d.birth_date,
  v.id AS visit_id,
  v.date_created::date AS visit_date,
  v.is_closed,
  c.id AS clinic_id,
  c.name AS clinic_name,
  s.date_created AS session_date,
  'New Attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
ORDER BY d.patient_id, DATE_TRUNC('month', v.date_created::date), visit_date;

-----
---New Attendance query → first visit per patient/month.
---Re-attendance query → all later visits in the same month.

---
SELECT
  TO_CHAR(v.date_created, 'YYYYMM') AS report_month,
  COUNT(DISTINCT d.patient_id) AS re_attendance
FROM public.patient_visit v
JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND d.patient_id IN (
    SELECT patient_id
    FROM public.patient_visit
    WHERE date_created BETWEEN '2025-01-01' AND '2025-01-31'
    GROUP BY patient_id
    HAVING COUNT(*) > 1  -- only patients with more than 1 visit
  )
GROUP BY TO_CHAR(v.date_created, 'YYYYMM')
ORDER BY report_month;

----
SELECT
  TO_CHAR(v.date_created, 'YYYYMM') AS report_month,
  COUNT(DISTINCT d.patient_id) AS new_attendance
FROM public.patient_visit v
JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
GROUP BY TO_CHAR(v.date_created, 'YYYYMM')
ORDER BY report_month;

-----
SELECT
  TO_CHAR(sub.visit_month, 'YYYYMM') AS report_month,

  COUNT(CASE WHEN sub.age_days BETWEEN 0 AND 28 AND sub.gender = 'Male'   THEN 1 END) AS "0-28d Male Re",
  COUNT(CASE WHEN sub.age_days BETWEEN 0 AND 28 AND sub.gender = 'Female' THEN 1 END) AS "0-28d Female Re",
  COUNT(CASE WHEN sub.age_days >= 29 AND sub.age_years < 5 AND sub.gender = 'Male'   THEN 1 END) AS "29d-4y Male Re",
  COUNT(CASE WHEN sub.age_days >= 29 AND sub.age_years < 5 AND sub.gender = 'Female' THEN 1 END) AS "29d-4y Female Re",
  COUNT(CASE WHEN sub.age_years BETWEEN 5 AND 9  AND sub.gender = 'Male'   THEN 1 END) AS "5-9y Male Re",
  COUNT(CASE WHEN sub.age_years BETWEEN 5 AND 9  AND sub.gender = 'Female' THEN 1 END) AS "5-9y Female Re",
  COUNT(CASE WHEN sub.age_years BETWEEN 10 AND 19 AND sub.gender = 'Male'  THEN 1 END) AS "10-19y Male Re",
  COUNT(CASE WHEN sub.age_years BETWEEN 10 AND 19 AND sub.gender = 'Female' THEN 1 END) AS "10-19y Female Re",
  COUNT(CASE WHEN sub.age_years >= 20 AND sub.gender = 'Male'   THEN 1 END) AS "20y+ Male Re",
  COUNT(CASE WHEN sub.age_years >= 20 AND sub.gender = 'Female' THEN 1 END) AS "20y+ Female Re"
FROM (
  SELECT DISTINCT
    d.patient_id,
    d.gender,
    d.birth_date,
    DATE_TRUNC('month', v.date_created::date) AS visit_month,
    (v.date_created::date - d.birth_date::date) AS age_days,
    DATE_PART('year', AGE(v.date_created::date, d.birth_date::date)) AS age_years
  FROM public.patient_visit v
  INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
  INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
  INNER JOIN public.clinic c ON c.id = s.clinic_id
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
    AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
    AND d.patient_id IN (
      SELECT patient_id
      FROM public.patient_visit
      WHERE date_created BETWEEN '2025-01-01' AND '2025-01-31'
      GROUP BY patient_id
      HAVING COUNT(*) > 1   -- only patients with more than one visit
    )
) sub
GROUP BY TO_CHAR(sub.visit_month, 'YYYYMM')
ORDER BY report_month;

----
SELECT
  EXTRACT(YEAR FROM sub.visit_month)::INT   AS report_year,
  EXTRACT(MONTH FROM sub.visit_month)::INT  AS report_month,
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
  SELECT DISTINCT
    d.patient_id,
    d.gender,
    AGE(v.date_created::date, d.birth_date::date) AS age,
    DATE_TRUNC('month', v.date_created::date)     AS visit_month
  FROM public.patient_visit v
  INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
  INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
  INNER JOIN public.clinic c ON c.id = s.clinic_id
  WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
    AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
) sub
GROUP BY EXTRACT(YEAR FROM sub.visit_month), EXTRACT(MONTH FROM sub.visit_month)
ORDER BY report_year, report_month;

--- line listing
SELECT DISTINCT ON (d.patient_id, DATE_TRUNC('month', v.date_created::date))
  d.patient_id,
  d.gender,
  d.birth_date,
  v.id AS visit_id,
  v.date_created::date AS visit_date,
  v.is_closed,
  c.id AS clinic_id,
  c.name AS clinic_name,
  v.date_created AS session_date,
  d.birth_date,
  --(v.date_created::date - d.birth_date::date) AS age_days,
  AGE(v.date_created::date, d.birth_date::date) AS age_years,
  'New Attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
ORDER BY d.patient_id, DATE_TRUNC('month', v.date_created::date), v.date_created;

--line listing 2
--(one row per patient per month if patient had ≥2 visits that month; record shows their first visit date + re-attendance flag)
SELECT
  d.patient_id,
  d.gender,
  d.birth_date,
  v.id AS visit_id,
  v.date_created::date AS visit_date,
  v.is_closed,
  c.id AS clinic_id,
  c.name AS clinic_name,
  s.date_created AS session_date,
  --(v.date_created::date - d.birth_date::date) AS age_days,
  AGE(v.date_created::date, d.birth_date::date) AS age_years,
  'Re-attendance' AS attendance_type
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id
INNER JOIN public.clinic c ON c.id = s.clinic_id
WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
  AND c.id IN (3,14,2,17,6,5,7,9,10,11,16,8,1,4,42)
  AND d.patient_id IN (
    SELECT distinct patient_id
    FROM public.patient_visit
    WHERE date_created BETWEEN '2025-01-01' AND '2025-01-31'
    GROUP BY patient_id
    HAVING COUNT(*) > 1   -- ensures only patients with multiple visits
  )
ORDER BY d.patient_id, v.date_created;


