create view reporting.patient_triage as 
select
m.patient_id,
r.birth_date ,
r.first_name ,
r.last_name,
r.nationality_id,
r.gender,
m.id as vital_monitor_id,
m.patient_labour_monitor_id,
m.encounter_id ,
m.admission_id,
m.taken_at,
m.triage_id,
m.vital_type_id,
v.caption,
m.value,
v.place_holder_hint
from dwh.fact_eafya_vitals_monitor m 
inner join dwh.fact_eafya_triage t on t.id = m.triage_id  
inner join dwh.dim_eafya_vital_type v on v.id = m.vital_type_id  
inner join dwh.dim_eafya_registered_patients r on r.patient_id = m.patient_id