CREATE MATERIALIZED VIEW reporting."105_02_antenatal_12" AS
SELECT 
    TO_CHAR(DATE_TRUNC('month', pi.date_created), 'YYYYMM') AS report_month,
    'AN12' AS hmis_code,

    -- Age groups
    COUNT(DISTINCT CASE WHEN DATE_PART('year', AGE(pa.birth_date)) < 15 
        THEN pa.patient_id END) AS below_15,
    COUNT(DISTINCT CASE WHEN DATE_PART('year', AGE(pa.birth_date)) BETWEEN 15 AND 19 
        THEN pa.patient_id END) AS age_15_19,
    COUNT(DISTINCT CASE WHEN DATE_PART('year', AGE(pa.birth_date)) BETWEEN 20 AND 24 
        THEN pa.patient_id END) AS age_20_24,
    COUNT(DISTINCT CASE WHEN DATE_PART('year', AGE(pa.birth_date)) BETWEEN 25 AND 49 
        THEN pa.patient_id END) AS age_25_49,
    COUNT(DISTINCT CASE WHEN DATE_PART('year', AGE(pa.birth_date)) >= 50 
        THEN pa.patient_id END) AS age_50_plus,

    COUNT(DISTINCT pa.patient_id) AS total
FROM reporting.patient_imaging pi
JOIN reporting.patient_antenatal pa 
    ON pa.patient_visit_id = pi.patient_visit_id
WHERE pi.clinic_id IN (SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%antenatal%' and mapping_id > 0)
  AND pi.imaging_id IN (303)   -- obstetric ultrasound
  AND pa.gender = 'Female'
GROUP BY DATE_TRUNC('month', pi.date_created)
ORDER BY report_month DESC;
