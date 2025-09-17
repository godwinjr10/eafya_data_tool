SELECT 
r.patient_id, 
r.date_created as patient_registered_date,
r.birth_date, 
r.gender,
c.patient_visit_id,
e.id as encounter_id,
c.id as clinic_session_id,
c.date_created as clinic_session_date,
l.id as clinic_id,
l.name as clinic_name
FROM public.registered_patient_detail r
inner join patient_visit v on v.patient_id = r.patient_id
inner join clinic_session c on c.patient_visit_id = v.id
inner join clinic l on l.id = c.clinic_id 
inner join encounter e on e.clinic_session_id = c.id
where l.id = 41