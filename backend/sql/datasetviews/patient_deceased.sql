create view reporting.patient_deceased as
select 
p.id ,
p.admission_id ,
a.admission_date,
p.date_created ,
p.patient_id ,
p.patient_visit_id ,
p.place_of_death,
p.time_of_death ,
a.ward_id,
a.admission_ward_name as ward_name
from dwh.fact_eafya_deceased_patient p
left outer join reporting.patient_admissions a on a.admission_id = p.admission_id