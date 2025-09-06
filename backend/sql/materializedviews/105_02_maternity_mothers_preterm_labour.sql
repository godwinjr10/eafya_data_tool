CREATE MATERIALIZED VIEW reporting."105_02_maternity_mothers_preterm_labour" AS
SELECT 
    TO_CHAR(h.admission_date, 'YYYYMM') AS report_month,
    'MA06' AS hmis_code,
    COUNT(DISTINCT d.patient_id) as total_mothers_preterm_labour
FROM reporting.patient_admissions h 
INNER JOIN reporting.patient_diagnosis d ON h.encounter_id = d.encounter_id 
WHERE d.disease_name ILIKE '%preterm labour%'
AND admission_ward_id IN ('1')
GROUP BY TO_CHAR(h.admission_date, 'YYYYMM')
ORDER BY report_month;