SELECT 
r.patient_id, 
r.date_created as patient_registered_date,
r.birth_date, 
r.gender,
c.patient_visit_id,
e.id as encounter_id,
c.id as clinic_session_id,
s.id as patient_admission_id,
l.id as clinic_id,
w.id as ward_id,
l.name as clinic_name,
s.admission_date,
w.name as ward_name
FROM public.registered_patient_detail r
inner join patient_visit v on v.patient_id = r.patient_id
inner join clinic_session c on c.patient_visit_id = v.id
inner join clinic l on l.id = c.clinic_id 
inner join encounter e on e.clinic_session_id = c.id
inner join patient_admission s on s.encounter_id = e.id
inner join ward w on w.id = s.admission_ward_id
where w.id = 4