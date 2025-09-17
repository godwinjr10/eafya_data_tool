create view reporting.patient_labtests as 
SELECT 
r.patient_id, 
r.first_name,
r.last_name,
r.birth_date,
r.gender,
v.id as visit_id,
v.date_created as visit_date,
t.date_created as lab_test_date,
c.clinic_id,
l.name as clinic_name,
e.id as encounter_id,
e.origin,
e.encounter_notes,
e.illness_history ,
t.lab_test_id,
t.parent_id,
s.name as lab_test_name,
t.result ,
t.status
FROM dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = c.id
inner join dwh.fact_eafya_patient_lab_test t on t.encounter_id = e.id
inner join dwh.dim_eafya_lab_test s on s.id = t.lab_test_id