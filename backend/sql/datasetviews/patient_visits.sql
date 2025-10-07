select 
v.id as visit_id,
v.created_by_id,
v.date_created ,
v.last_updated,
v.is_closed ,
v.patient_id ,
v.process ,
v.referring_facility ,
v.b_referring_facility_id ,
d.birth_date ,
d.date_created ,
d.first_name ,
d.gender ,
d.last_name ,
d.last_updated ,
d.marital_status ,
d.nationality_id ,
d.patient_id ,
d.sub_location ,
d.village ,
d.ethnicity ,
d.category, 
d.date_created,
d.last_updated ,
c.clinic_id ,
n."name" as clinic_name,
c.closed_at ,
c.closed_by_id ,
c.created_by_id ,
c.date_created ,
c.description ,
c.health_education,
c.visit_type_id,
t."name" as visit_type
from public.patient_visit v
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic_session c on c.patient_visit_id = v.id 
inner join public.clinic n on n.id = c.clinic_id 
inner join public.visit_type t on t.id = c.visit_type_id
where v.date_created between '2025-06-01' and '2025-06-30'