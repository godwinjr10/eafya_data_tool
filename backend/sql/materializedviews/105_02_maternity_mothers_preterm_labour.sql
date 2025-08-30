create materialized view reporting."105_02_maternity_mothers_preterm_labour" as
SELECT COUNT(DISTINCT d.patient_id) as total_mothers_preterm_labour
FROM reporting.patient_admissions h 
INNER JOIN reporting.patient_diagnosis d ON h.encounter_id = d.encounter_id 
WHERE d.disease_name ILIKE '%preterm labour%';



