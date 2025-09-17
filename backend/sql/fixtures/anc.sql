select 
v.patient_id,
v.id as visit_no,
v.date_created as visit_date,
e.id as encounter_id, 
e.date_created,
c."name" as clinic,
t."name" as visit_type,
e.clinic_session_id, 
e.encounter_notes, 
e.illness_history,  
e.origin,
d.first_name ,
d.last_name ,
d.birth_date ,
d.gender ,
d.ethnicity ,
d.nationality_id,
s.clinic_id  
from public.patient_visit v
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic_session s on s.patient_visit_id = v.id 
inner join public.visit_type t on t.id = s.visit_type_id
inner join public.clinic c on c.id = s.clinic_id 
inner join public.encounter e on e.clinic_session_id = s.id 
where c.id = 1
and v.date_created between '2025-01-01' and '2025-01-31'
--and  v.patient_id  ='UG-VNC-211'
and e.origin = 'op'
order by v.date_created, v.patient_id 

------ ANC VISIT COUNTS per patient ------
select distinct on (v.visit_id)
  v.visit_id,
  v.patient_id,
  v.visit_date,
  c."name" as clinic,
  t."name" as visit_type,
  d.first_name,
  d.last_name,
  d.birth_date,
  d.gender,
  d.ethnicity,
  d.nationality_id,
  e.origin,
  v.visit_count
from (
  select
    v.id as visit_id,
    v.patient_id,
    v.date_created as visit_date,
    row_number() over (
      partition by v.patient_id order by v.date_created
    ) as visit_count
  from public.patient_visit v
) v
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic_session s on s.patient_visit_id = v.visit_id
inner join public.visit_type t on t.id = s.visit_type_id
inner join public.clinic c on c.id = s.clinic_id
inner join public.encounter e on e.clinic_session_id = s.id
where c.id = 1
  and v.patient_id = 'UG-PSX-235'
  and d.gender = 'Female'
order by v.visit_id, e.date_created;

---- ANC VISITS WITHIN A MONTH ----
select distinct on (v.visit_id)
  v.visit_id,
  v.patient_id,
  v.visit_date,
  to_char(v.visit_date, 'YYYYMM') as reporting_month,  -- add reporting month
  c."name" as clinic,
  t."name" as visit_type,
  d.first_name,
  d.last_name,
  d.birth_date,
  d.gender,
  d.ethnicity,
  d.nationality_id,
  e.origin,
  v.visit_count
from (
  select
    v.id as visit_id,
    v.patient_id,
    v.date_created as visit_date,
    row_number() over (
      partition by v.patient_id order by v.date_created
    ) as visit_count
  from public.patient_visit v
) v
inner join public.registered_patient_detail d on d.patient_id = v.patient_id
inner join public.clinic_session s on s.patient_visit_id = v.visit_id
inner join public.visit_type t on t.id = s.visit_type_id
inner join public.clinic c on c.id = s.clinic_id
inner join public.encounter e on e.clinic_session_id = s.id
where c.id = 1
  --and v.patient_id = 'UG-PSX-235'
  and d.gender = 'Female'
  and v.visit_date between '2025-01-01' and '2025-01-31'
  and e.origin = 'op'
  and v.visit_count = 1
order by v.visit_id, e.date_created;