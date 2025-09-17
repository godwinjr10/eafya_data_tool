select 
m.id,
m.blood_pressure ,
m.delivered_by_id,
m.delivery_comments ,
m.delivery_mode ,
m.delivery_time ,
m.drugs_given ,
m.first_stage_duration ,
m.gravidity ,
m.induced_labour ,
m.mother_status ,
m.patient_admission_id ,
m.placenta_complete ,
m.placental_weight,
n.baby_head_circumference ,
n.baby_height,
n.baby_status ,
n.baby_weight ,
n.created_by_id ,
n.date_created ,
n.first_apgar_score ,
n.resuscitation ,
n.second_apgar_score ,
n.abdomen_condition ,
n.anus_condition ,
n.assesed_by_id ,
n.back_condition ,
n.chest_condition ,
n.ears_condition ,
n.eyes_condition ,
n.first_name ,
n.gender ,
n.last_name ,
n.baby_gender 
from public.patient_labour_monitor m 
inner join public.newborn n on n.patient_labour_monitor_id = m.id 
order by m.date_created desc;

select * from public.newborn n ;
select * from public.patient_labour_monitor m 
where m.delivery_time is not null