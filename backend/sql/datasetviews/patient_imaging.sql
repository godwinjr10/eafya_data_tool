create view reporting.patient_imaging as 
select 
r.patient_id,
r.date_created as registered_date,
r.birth_date,
r.gender,
l.id as clinic_id,
l."name" as clinic_name,
v.id as visit_no,
v.date_created as visit_date,
p.date_created,
p.imaging_id,
g.name as imaging_name,
f.id as category_id,
f.name as category,
p.result,
p.status,
p.last_updated,
p.id as patient_imaging_id,
e.id as encounter_id,
e.origin ,
e.encounter_notes ,
e.illness_history,
p.created_by_id,
e.clinic_session_id,
t."name" as visit_type
from dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_visit_type t on t.id = c.visit_type_id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = c.id
inner join dwh.fact_eafya_patient_imaging p on p.encounter_id = e.id
inner join dwh.dim_eafya_imaging g on g.id = p.imaging_id
inner join dwh.dim_eafya_imaging_category f on f.id = g.imaging_category_id 