CREATE MATERIALIZED VIEW reporting."105_01_attendance" AS
SELECT 
TO_CHAR(visit_date, 'YYYYMM') AS report_month,
'sv6SeKroHPV' as dataelement,
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
    SELECT DISTINCT ON (d.patient_id, DATE_TRUNC('month', d.date_created))
        d.patient_id,
        d.date_created::date AS visit_date,
        d.birth_date,
        d.gender
    FROM reporting.patient_diagnosis d
    --WHERE d.date_created BETWEEN '2025-01-01' AND '2025-01-31'
      --AND e.origin = 'op'
    ORDER BY d.patient_id, DATE_TRUNC('month', d.date_created)
) AS deduped
GROUP BY TO_CHAR(visit_date, 'YYYYMM')
ORDER BY report_month DESC;