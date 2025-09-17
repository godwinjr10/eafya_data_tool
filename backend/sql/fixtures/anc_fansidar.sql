select 
patient_id, 
visit_no, 
visit_date,   
treatment_date, 
gender,
birth_date,
pharmacology_id, 
drug_name
FROM reporting.patient_prescriptions
where clinic_id = 1
and gender = 'Female'
and origin = 'op'
and drug_name ilike '%FANSIDAR%'
order by patient_id , treatment_date desc