create view reporting.patient_bed_admissions as 
select
r.id, 
r.birth_date, 
r.gender,
r.patient_id, 
d.id as patient_admission_id,
d.admission_ward_id ,
d.encounter_id,
d.patient_visit_id,
--v.referring_facility,
d.admission_date,
d.medical_discharge_date,
w.name as ward_name,
m.name as room_name,
b.id as bed_id,
b.bed_type,
b.name as bed_name
FROM dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_admissions d on d.patient_visit_id = v.id
inner join dwh.dim_eafya_ward w on w.id = d.admission_ward_id 
inner join dwh.dim_eafya_room m on m.ward_id = w.id
inner join dwh.dim_eafya_bed b on b.room_id = m.id