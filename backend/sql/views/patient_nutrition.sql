create view reporting.patient_nutrition as 
SELECT 
r.patient_id, 
r.date_created as registered_date,
c.patient_visit_id,
v.date_created as visit_date,
e.date_created as encounter_date,
r.birth_date, 
r.gender,
e.id as encounter_id,
e.origin ,
e.encounter_notes ,
e.illness_history ,
c.id as clinic_session_id,
l.id as clinic_id,
l."name" as clinic_name
FROM dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = c.id
where l.id = 9