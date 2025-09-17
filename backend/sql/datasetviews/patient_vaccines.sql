create view reporting.patient_vaccines as 
select 
r.patient_id,
c.patient_visit_id ,
r.date_created as registered_date,
r.birth_date,
r.gender,
r.first_name ,
r.last_name ,
m.administered_on ,
m.administered_in_premise,
l.name as clinic_name,
m.vaccine_id,
i.name as vaccine_name,
i.is_children_vaccine
from dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id  
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id
inner join dwh.fact_eafya_vaccine m on m.clinic_session_id = c.id
inner join dwh.dim_eafya_vaccine i on i.id = m.vaccine_id