select 
r.patient_id,
r.birth_date,
d.date_created as diagnosis_date,
r.date_created as patient_registered_date,
r.gender,
v.id as patient_visit_id,
c.id as clinic_session_id,
s.id as clinic_id,
s.name as clinic_name,
e.id as encounter_id,
d.disease_id,
h.eafya_disease_id,
h.eafya_disease_name,
h.hmis_code,
h.hmis_condition,
h.icd_10_code,
h.icd_10_description,
dp.date_created as death_date_created,
dp.death_certificate_id,
dp.place_of_death,
dp.time_of_death
from registered_patient_detail r
inner join patient_visit v on v.patient_id = r.patient_id
inner join deceased_patient dp on dp.patient_visit_id = v.id 
inner join clinic_session c on c.patient_visit_id = v.id
inner join clinic s on s.id = c.clinic_id
inner join encounter e on e.clinic_session_id = c.id
inner join patient_disease d on d.encounter_id = e.id
inner join dhis2_eafya_icd_mapping h on h.eafya_disease_id = d.disease_id 