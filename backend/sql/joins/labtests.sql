SELECT 
r.patient_id, 
r.birth_date,
r.gender,
c.patient_visit_id,
l.name as clinic_name,
e.id as encounter_id,
t.date_created as lab_test_date,
t.lab_test_id,
t.result as lab_test_result,
t.status as lab_test_status,
s.name as lab_test_name
FROM public.registered_patient_detail r
inner join patient_visit v on v.patient_id = r.patient_id
inner join clinic_session c on c.patient_visit_id = v.id
inner join clinic l on l.id = c.clinic_id 
inner join encounter e on e.clinic_session_id = c.id
inner join patient_lab_test t on t.encounter_id = e.id
inner join lab_test s on s.id = t.lab_test_id