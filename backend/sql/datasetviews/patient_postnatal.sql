create view reporting.patient_postnatal as 
SELECT 
r.patient_id, 
c.patient_visit_id,
s.id as patient_admission_id,
v.date_created as visit_date,
e.date_created as encounter_date,
s.admission_date,
r.date_created as patient_registered_date,
r.birth_date, 
r.gender,
e.id as encounter_id,
e.origin ,
e.encounter_notes ,
e.illness_history ,
c.id as clinic_session_id,
l.id as clinic_id,
l."name" as clinic_name,
w.id as ward_id,
w.name as ward_name
FROM dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = c.id
inner join dwh.fact_eafya_admissions s on s.encounter_id = e.id
inner join dwh.dim_eafya_ward w on w.id = s.admission_ward_id
where w.id in (SELECT mapping_id FROM reporting.customizationset where name ilike '%postnantal ward%' and mapping_id > 0)