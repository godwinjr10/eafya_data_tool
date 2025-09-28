create view reporting.inpatient_conditions as 
SELECT 
d.patient_id ,
d.first_name ,
d.last_name,
d.gender ,
d.birth_date ,
v.id as visit_no,
v.date_created as visit_date,
a.date_created as diagnosised_date,
a.encounter_id,
m.disease_id,
s."name" as disease,
s.simplified_name,
m.classification,
a.created_by_id, 
e.encounter_notes ,
e.illness_history ,
e.origin ,
n.id as clinic_id,
n."name" as clinic_name,
c.closed_at ,
c.visit_type_id ,
t."name" as visit_name,
p.time_of_death,
p.place_of_death
FROM dwh.fact_eafya_patient_disease m
inner join dwh.dim_eafya_disease s on s.id = m.disease_id 
inner join dwh.fact_eafya_encounters e on e.id = m.encounter_id
inner join dwh.fact_eafya_clinic_session c on c.id = e.clinic_session_id
inner join dwh.fact_eafya_patient_visit v on v.id = c.patient_visit_id 
inner join dwh.dim_eafya_registered_patients d on d.patient_id = v.patient_id
inner join dwh.dim_eafya_clinic n on n.id = c.clinic_id 
inner join dwh.dim_eafya_visit_type t on t.id = c.visit_type_id 
inner join dwh.fact_eafya_admissions a on a.patient_visit_id = v.id
left join dwh.fact_eafya_deceased_patient p on p.admission_id = a.id
where e.origin = 'ip'