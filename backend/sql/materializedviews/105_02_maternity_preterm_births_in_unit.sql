CREATE MATERIALIZED VIEW reporting."105_02_maternity_preterm_births_in_unit" AS
SELECT 
    TO_CHAR(h.admission_date, 'YYYYMM') AS report_month,
    'MA07' AS hmis_code,
    COUNT(DISTINCT d.patient_id) as total_preterm_births_in_unit
FROM reporting.patient_admissions h 
INNER JOIN reporting.patient_diagnosis d ON h.encounter_id = d.encounter_id 
WHERE d.disease_name ILIKE '%preterm labour%'
GROUP BY TO_CHAR(h.admission_date, 'YYYYMM')
ORDER BY report_month;



