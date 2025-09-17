SELECT 
v.id as visit_no,
v.date_created as visit_date,
c."name" as clinic_name,
r.patient_id ,
r.first_name ,
r.last_name ,
r.birth_date ,
r.gender ,
r.ethnicity ,
r.nationality_id ,
m.id as labour_id, 
m.bba, 
m.blood_loss_volume, 
m.blood_pressure,
m.cord_normal, 
m.date_created, 
m.delivery_comments, 
m.delivery_mode, 
m.delivery_time, 
m.drugs_given, 
m.episiotomy, 
m.first_stage_duration, 
m.gravidity, 
m.hours_since_rupture, 
m.induced_labour, 
m.induction_drug_route, 
m.induction_drugs,  
m.membranes_complete, 
m.mother_status, 
m.parity, 
m.patient_admission_id, 
m.perineal_tear, 
m.placenta_complete, 
m.placental_weight, 
m.pulse, repair, 
m.respiratory_rate, 
m.ruptured_membranes, 
m.second_stage_duration, 
m.temperature, 
m.vaginal_exams_count, 
m.edd, 
m.lmp, 
m.obstetric_care, 
m.obstetric_complication, 
m.pregnancy_history,
n.id as newborn_id, 
n.baby_head_circumference, 
n.baby_height, 
n.baby_status, 
n.baby_weight,   
n.date_created, 
n.description, 
n.first_apgar_score,  
n.patient_admission_id, 
n.patient_labour_monitor_id, 
n.resuscitation, 
n.second_apgar_score, 
n.abdomen_condition, 
n.anus_condition, 
n.back_condition, 
n.chest_condition, 
n.ears_condition, 
n.eyes_condition, 
n.first_name, 
n.gender, 
n.general_condition, 
n.genitalia_condition, 
n.head_condition, 
n.hip_joints_condition, 
n.last_name, 
n.lower_limbs_condition, 
n.mouth_condition, 
n.neck_condition, 
n.newborn_complication, 
n.newborn_pmtct, 
n.nose_condition, 
n.other_name, 
n.reflexes_condition, 
n.third_apgar_score, 
n.upper_limbs_condition, 
n.baby_gender,
a.id as admission_id, 
a.admission_date, 
a.admission_ward_id,   
a."comments", 
a.date_created, 
a.discharge_care_plan, 
a.discharge_date, 
a.discharge_encounter_id, 
a.discharging_doctor_id, 
a.encounter_id, 
a.escorting_nurse_id, 
a.is_closed, 
a.medical_discharge_date, 
a.patient_visit_id, 
a.receiving_nurse_id, 
a.released_by_id, 
a.is_admission_approved,
e.id as encounter_id, 
e.clinic_session_id, 
e.date_created, 
e.encounter_notes, 
e.illness_history,  
e.origin,
d.disease_id ,
g."name" as disease_name,
g.simplified_name 
FROM public.patient_labour_monitor m
left join public.newborn n on n.patient_labour_monitor_id = m.id 
inner join public.patient_admission a on a.id = m.patient_admission_id
inner join public.patient_visit v on v.id = a.patient_visit_id
inner join public.clinic_session s on s.patient_visit_id = v.id 
inner join public.clinic c on c.id = s.clinic_id 
inner join public.encounter e on e.clinic_session_id = s.id 
inner join public.registered_patient_detail r on r.patient_id = v.patient_id 
left join public.patient_disease d on d.encounter_id = e.id 
left outer join public.disease g on g.id = d.disease_id 
where m.date_created between '2025-09-01' and '2025-09-11'
--and r.patient_id in ('UG-MNG-367', 'UG-WXP-352', 'UG-LCS-427', 'UG-NMM-622', 'UG-MQV-625')
and r.patient_id = 'UG-NMM-622'

--select * from clinic_session s
--select * from clinic c 



----------Patient Visits 
select 
v.id as visit_no,
v.date_created as visit_date,
v.patient_id,
c."name" as clinic,
t."name" as visit_type,
e.id as encounter_id, 
e.clinic_session_id, 
e.encounter_notes, 
e.illness_history,  
e.origin,
d.first_name ,
d.last_name ,
d.birth_date ,
d.gender ,
d.ethnicity ,
d.nationality_id ,
s.clinic_id ,
--s.closed_at ,
--n.disease_id ,
g."name" as disease_name,
g.simplified_name,
n.date_created as diagnosised_date,
n.classification 
from public.patient_visit v
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic_session s on s.patient_visit_id = v.id 
inner join public.visit_type t on t.id = s.visit_type_id
inner join public.clinic c on c.id = s.clinic_id 
inner join public.encounter e on e.clinic_session_id = s.id 
left join public.patient_disease n on n.encounter_id = e.id 
left join public.disease g on g.id = n.disease_id 
where v.patient_id  ='UG-NMM-622'
order by v.date_created 


------ OUTPATIENT ANC ------
select 
v.id as visit_no,
v.date_created as visit_date,
v.patient_id,
c."name" as clinic,
t."name" as visit_type,
e.id as encounter_id, 
e.date_created as encounter_date,
e.clinic_session_id, 
e.encounter_notes, 
e.illness_history,  
e.origin,
d.first_name ,
d.last_name ,
d.birth_date ,
d.gender ,
d.ethnicity ,
d.nationality_id ,
--s.clinic_id ,
--s.closed_at ,
--n.disease_id ,
g."name" as disease_name,
g.simplified_name,
n.date_created as diagnosised_date,
n.classification ,
m.administered_on as vaccine_administered_date,
i."name" as vaccine_name,
p.date_created as treatment_date,
l."name" as drug_name,
p.dosage ,
p.duration ,
p.frequency ,
p.route ,
b.date_created as lab_test_date,
--b.lab_test_id ,
w."name" as lab_test,
b.status ,
b."result" ,
u.caption as triage,
x.value as triage_value,
x.taken_at 
from public.patient_visit v
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic_session s on s.patient_visit_id = v.id 
inner join public.visit_type t on t.id = s.visit_type_id
inner join public.clinic c on c.id = s.clinic_id 
inner join public.encounter e on e.clinic_session_id = s.id 
left join public.patient_disease n on n.encounter_id = e.id 
left join public.disease g on g.id = n.disease_id 
left join public.administered_vaccine m on m.clinic_session_id = s.id 
left join public.vaccine i on i.id = m.vaccine_id
left join public.patient_drug p on p.encounter_id = e.id 
left join public.pharmacology l on l.id = p.pharmacology_id 
left join public.patient_lab_test b on b.encounter_id = e.id 
left join public.lab_test w on w.id = b.lab_test_id 
LEFT JOIN public.vital_monitor x on x.patient_id = v.patient_id 
LEFT join public.triage z on z.id = x.triage_id  
LEFT join public.vital_type u on u.id = x.vital_type_id  
where v.patient_id  ='UG-NMM-622'
and e.origin = 'op'
order by v.date_created 

select * from public.visit_type t 
select * from public.patient_visit v
select * from public.clinic c 
select * from public.clinic_session s
select * from public.visit_type t
select * from administered_vaccine m
select * from public.patient_drug p
select * from public.pharmacology p 
select * from public.patient_lab_test b