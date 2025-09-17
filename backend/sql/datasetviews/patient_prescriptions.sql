create view reporting.patient_prescriptions as 
select 
v.patient_id,
v.id as visit_no,
v.date_created as visit_date,
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
d.nationality_id ,
s.clinic_id ,
n.disease_id ,
g."name" as disease_name,
g.simplified_name,
n.date_created as diagnosised_date,
n.classification ,
p.id as treatment_id,
p.date_created as treatment_date,
p.encounter_id as treatment_encounter ,
p.pharmacology_id ,
l."name" as drug_name,
p.dosage ,
p.duration ,
p.frequency ,
p.route 
from dwh.fact_eafya_patient_visit v
inner join dwh.dim_eafya_registered_patients d on d.patient_id = v.patient_id
inner join dwh.fact_eafya_clinic_session s on s.patient_visit_id = v.id 
inner join dwh.dim_eafya_visit_type t on t.id = s.visit_type_id
inner join dwh.dim_eafya_clinic c on c.id = s.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = s.id 
inner join dwh.fact_eafya_patient_disease n on n.encounter_id = e.id 
inner join dwh.dim_eafya_disease g on g.id = n.disease_id 
inner join dwh.fact_eafya_prescription p on p.encounter_id = e.id 
inner join dwh.dim_eafya_pharmacology l on l.id = p.pharmacology_id 
order by v.date_created 