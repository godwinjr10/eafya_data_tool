select 
v.id,
v.date_created ,
v.patient_id,
c.clinic_id ,
c.id as clinic_session,
e.id as encounter_id,
l."name" ,
d.disease_id ,
s."name" as disease_name,
a.admission_date ,
a.admission_ward_id ,
a.discharge_date ,
a.discharging_doctor_id,
a.is_closed ,
a.patient_visit_id ,
a.is_admission_approved ,
w.name as ward_name,
m.blood_loss_volume ,
m.blood_pressure,
m.cord_normal,
m.delivery_comments ,
m.delivery_mode ,
m.delivery_time ,
m.drugs_given ,
m.first_stage_duration ,
m.gravidity ,
m.induced_labour ,
m.induction_drug_route ,
m.induction_drugs ,
m.membranes_complete ,
m.mother_status ,
m.parity ,
m.placenta_complete ,
m.placental_weight ,
m.pulse ,
m.respiratory_rate ,
m.ruptured_membranes,
m.second_stage_duration ,
m.temperature ,
m.vaginal_exams_count,
m.first_stage_duration ,
m.patient_admission_id ,
m.parity 
from public.patient_visit v 
inner join public.clinic_session c on c.patient_visit_id = v.id
inner join public.clinic l on l.id = c.clinic_id 
inner join public.encounter e on e.clinic_session_id = c.id
inner join public.patient_disease d on d.encounter_id = e.id 
inner join public.disease s on s.id = d.disease_id 
inner join public.patient_admission a on a.encounter_id = e.id 
inner join public.ward w on w.id = a.admission_ward_id 
left outer join public.patient_labour_monitor m on m.patient_admission_id = d.id
where v.patient_id = 'UG-YGK-412'
order by date_created desc;

--select * from clinic_session c;
--select * from patient_disease d;
--select * from patient_admission a where a.encounter_id = '535260'
--select * from bed_movement bm 
select * from patient_labour_monitor m where m.patient_admission_id = 67275;
select * from newborn order by date_created desc;
where n.patient_labour_monitor_id = 10536
order by date_created desc;