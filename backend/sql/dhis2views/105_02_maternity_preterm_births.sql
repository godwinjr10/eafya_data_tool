CREATE VIEW reporting."105_02_maternity_preterm_births" AS
select 
TO_CHAR(d.diagnosised_date, 'YYYYMM') AS report_month,
'MA06' AS hmis_code,
COUNT(DISTINCT d.patient_id) as total_preterm_labour
from reporting.patient_conditions d
inner join reporting.patient_admissions h on h.encounter_id = d.encounter_id
where d.disease ilike '%preterm%'
AND h.admission_ward_id IN (SELECT mapping_id FROM reporting.customizationset where name ilike '%maternity ward%' and mapping_id > 0)
GROUP BY TO_CHAR(d.diagnosised_date, 'YYYYMM')
ORDER BY report_month;



