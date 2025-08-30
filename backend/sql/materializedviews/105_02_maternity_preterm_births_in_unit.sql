create materialized view reporting."105_02_maternity_preterm_births_in_unit" as
SELECT COUNT(DISTINCT d.patient_id) as total_preterm_births_in_unit
FROM reporting.patient_admissions h 
INNER JOIN reporting.patient_diagnosis d ON h.encounter_id = d.encounter_id 
WHERE d.disease_name ILIKE '%preterm labour%';



