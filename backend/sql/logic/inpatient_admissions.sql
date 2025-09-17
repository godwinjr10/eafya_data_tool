SELECT 
a.id, 
a.admission_date, 
a.date_created, 
w."name" as ward,
s.disease_id,
g."name" as disease,
a.admitting_doctor_id, 
a."comments", 
a.created_by_id, 
a.date_created
--a.discharge_care_plan, 
--a.discharge_date, 
--a.discharge_encounter_id, 
--a.discharging_doctor_id, 
--a.encounter_id
FROM public.patient_admission a
inner join public.encounter e on e.id = a.encounter_id
inner join public.clinic_session c on c.id = e.clinic_session_id
inner join public.patient_visit v on v.id = c.patient_visit_id 
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic n on n.id = c.clinic_id 
inner join public.visit_type t on t.id = c.visit_type_id
inner join public.ward w on w.id = a.admission_ward_id 
left outer join public.patient_disease s on s.encounter_id = e.id  
left outer join public.disease g on g.id = s.disease_id 
where admission_date between '2025-06-01' and '2025-06-30'