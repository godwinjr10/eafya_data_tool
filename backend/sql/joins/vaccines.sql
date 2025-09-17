select 
r.id,
r.patient_id as patient_number,
r.birth_date,
r.gender,
v.referring_facility,
c.date_created,
c.patient_visit_id ,
l.name as clinic_name,
m.comment as administered_vaccine_comment,
m.vaccine_id,
i.name as vaccine_name,
i.is_children_vaccine
from registered_patient_detail r
inner join patient_visit v on v.patient_id = r.patient_id  
inner join clinic_session c on c.patient_visit_id = v.id
inner join clinic l on l.id = c.clinic_id
inner join administered_vaccine m on m.clinic_session_id = c.id
inner join vaccine i on i.id = m.vaccine_id