SELECT id, lab_test_id, "result", sample_collected_by_id, sample_collection_time, status, date_created, last_updated
FROM dwh.fact_eafya_patient_lab_test
where lab_test_id = 823
and "result" is not null


SELECT 
p.patient_id, 
p.birth_date, 
p.gender, 
p.encounter_id, 
p.clinic, 
p.patient_visit_id, 
p.date_created,
l.lab_test_id, 
l.lab_test,
l."result"
FROM reporting.patient_antenatal p
inner join reporting.patient_lab_test l on l.encounter_id = p.encounter_id
where l.lab_test_id = 823
and l."result" is not null