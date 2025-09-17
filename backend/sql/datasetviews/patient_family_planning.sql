create view reporting.patient_family_planning as 
select distinct 
v.id as visit_no,
v.date_created as visit_date,
p.date_created as planning_date_created,
a.administered_on ,
g.patient_id ,
g.first_name ,
g.last_name,
g.gender ,
g.birth_date ,
p.encounter_id ,
n.id as clinic_id,
n."name" as clinic_name,
p.family_planning_id ,
p.is_new_to_method ,
p.treatment_stage, 
e.origin ,
e.encounter_notes ,
e.illness_history ,
a.administered_at ,
a.date_created as fp_date_created ,
a.family_planning_id as administered_family_planning_id,
f."name" as family_planning_method,
f.description, 
d.id as category_id,
d."name" as category,
c.visit_type_id ,
t."name" as visit_name
from dwh.fact_eafya_patient_family_planning p
inner join dwh.fact_eafya_encounters e on e.id = p.encounter_id 
inner join dwh.fact_eafya_administered_family_planning a on a.patient_family_planning_id = p.id 
inner join dwh.dim_eafya_family_planning f ON f.id = a.family_planning_id
inner join dwh.dim_eafya_family_planning_category d on d.id = f.family_planning_category_id
inner join dwh.fact_eafya_clinic_session c on c.id = e.clinic_session_id
inner join dwh.fact_eafya_patient_visit v on v.id = c.patient_visit_id 
inner join dwh.dim_eafya_registered_patients g on g.patient_id = v.patient_id
inner join dwh.dim_eafya_clinic n on n.id = c.clinic_id 
inner join dwh.dim_eafya_visit_type t on t.id = c.visit_type_id 
order by v.date_created desc