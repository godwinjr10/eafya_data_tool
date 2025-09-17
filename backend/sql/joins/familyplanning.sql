SELECT r.id, 
r.patient_id, 
r.birth_date, 
r.gender,
c.patient_visit_id,
l.name as clinic_name,
f.encounter_id,
b.date_created as fp_administered_date,
b.family_planning_id,
a.name as family_planning_method_administered,
f.treatment_stage
FROM public.registered_patient_detail r
inner join patient_visit v on v.patient_id = r.patient_id
inner join clinic_session c on c.patient_visit_id = v.id
inner join clinic l on l.id = c.clinic_id 
inner join encounter e on e.clinic_session_id = c.id
inner join patient_family_planning f on f.encounter_id = e.id
inner join administered_family_planning b on b.patient_family_planning_id = f.id
inner join family_planning a on a.id = b.family_planning_id