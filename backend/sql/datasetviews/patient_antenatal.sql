create view reporting.patient_antenatal as
select 
v.patient_id,
v.id as visit_no,
v.date_created as visit_date,
e.id as encounter_id, 
e.date_created as encounter_date,
c."name" as clinic,
t."name" as visit_type,
e.clinic_session_id, 
e.encounter_notes, 
e.illness_history,  
e.origin,
d.first_name ,
d.last_name ,
d.birth_date ,
d.gender ,
d.nationality_id,
s.clinic_id ,
d.marital_status,    
d.village
from dwh.fact_eafya_patient_visit v
inner join dwh.dim_eafya_registered_patients d on d.patient_id = v.patient_id
inner join dwh.fact_eafya_clinic_session s on s.patient_visit_id = v.id 
inner join dwh.dim_eafya_visit_type t on t.id = s.visit_type_id
inner join dwh.dim_eafya_clinic c on c.id = s.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = s.id
where c.id IN (SELECT mapping_id FROM reporting.materialized_view_ids where name ilike '%antenatal%' and mapping_id > 0)
and e.origin = 'op'
and d.gender = 'Female'
order by v.date_created, v.patient_id