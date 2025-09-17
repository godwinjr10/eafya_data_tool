create view reporting.patient_deceased as 
select 
p.id ,
p.admission_id ,
p.date_created ,
p.patient_id ,
p.patient_visit_id ,
p.place_of_death,
p.time_of_death 
from dwh.fact_eafya_deceased_patient p