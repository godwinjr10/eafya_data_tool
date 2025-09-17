select
v.date_created AS visit_date,
d.patient_id,
c.name AS clinic_name,
v.id AS visit_id,
e.id AS encounter_id ,
a.disease_id,
d.gender,
d.birth_date,
AGE(v.date_created::date, d.birth_date::date) AS age,
  --v.is_closed,
  --c.id AS clinic_id,
e.created_by_id,
e.date_created as encounter_date,
e.encounter_notes,
e.illness_history,
e.origin,
--t.id as triagle_id,
m.triage_id,
y.caption ,
m.value ,
m.vital_type_id,
m.taken_at ,
g.imaging_id ,
i."name" as imaging_name,
g.performed_at ,
g.procedure_notes ,
g.remarks ,
g."result" ,
g.status,
w."name" as lab_test,
n.lab_test_id ,
n.parent_id ,
n."result" ,
n.status ,
r."name" as drug_name,
o.dosage ,
o.duration ,
o.frequency ,
o.route,
o.pharmacology_id ,
o.description ,
z."comment" ,
z.date_created as therate_date,
z.major_theater_id ,
h."name" as theatre_name,
z.major_theater_room_id ,
z.performed_at ,
z.scheduled_date ,
z.scheduled_time 
--m.encounter_id,
--s.id as clinic_session_id,
--t.clinic_session_id as triagle_clinic_session_id
FROM public.patient_visit v
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id 
INNER JOIN public.clinic_session s ON s.patient_visit_id = v.id 
INNER JOIN public.clinic c ON c.id = s.clinic_id 
LEFT JOIN public.encounter e ON e.clinic_session_id = s.id 
LEFT JOIN public.patient_disease a ON a.encounter_id = e.id  
LEFT JOIN public.vital_monitor m on m.patient_id = v.patient_id 
LEFT join public.triage t on t.id = m.triage_id  
LEFT join public.vital_type y on y.id = m.vital_type_id  
LEFT join public.patient_imaging g on g.encounter_id = e.id  
left join public.imaging i on i.id = g.imaging_id 
left join public.patient_lab_test n on n.encounter_id = e.id 
left join public.lab_test w on w.id = n.lab_test_id 
left join public.patient_drug o on o.encounter_id = e.id 
left join public.pharmacology r on r.id = o.pharmacology_id 
left join public.patient_major_theater z on z.encounter_id = e.id 
left join public.major_theater h on h.id = z.major_theater_id 
--WHERE v.date_created BETWEEN '2025-01-01' AND '2025-01-31'
--AND c.id IN (3, 14, 2, 17, 6, 5, 7, 9, 10, 11, 16, 8, 1, 4, 42)
and d.patient_id in ('UG-AEY-198') 

--select * from public.encounter e
--select * from public.triage t
--select * from public.vital_monitor m
--select * from public.triage 
--select * from public.vital_type  
--select * from public.patient_imaging
--select * from public.imaging i 
--select * from public.patient_disease,
--select * from public.patient_lab_test
--select * from public.patient_drug
--select * from public.pharmacology
--select * from public.patient_major_theater
--select * from public.major_theater
select * from public.patient_labour_monitor 
select * from public.newborn 
select * from public.patient_relationship
