create view reporting.inpatient_maternal_conditions as
select
    e.id AS encounter_id,
    v.id as visit_id,
    a.id as admission_id,
    r.patient_id,
    r.gender,
    r.birth_date,
    d.date_created as diagnosis_date,
    a.admission_date,
    d.disease_id,
    i.name AS diagnosis,
    m.delivery_mode,
    m.blood_pressure AS mother_blood_pressure,
    m.blood_loss_volume AS mother_blood_loss_volume,
    p.time_of_death,
    p.place_of_death,
    n.baby_weight,
    n.baby_status,
    n.baby_gender,
    n.date_created AS newborn_date
FROM dwh.dim_eafya_registered_patients r
INNER JOIN dwh.fact_eafya_patient_visit v ON v.patient_id = r.patient_id
INNER JOIN dwh.fact_eafya_admissions a ON a.patient_visit_id = v.id
INNER JOIN dwh.fact_eafya_encounters e ON e.id = a.encounter_id
INNER JOIN dwh.fact_eafya_patient_disease d ON d.encounter_id = e.id
INNER JOIN dwh.dim_eafya_disease i ON i.id = d.disease_id
LEFT JOIN dwh.fact_eafya_deceased_patient p ON p.admission_id = a.id
LEFT JOIN dwh.fact_eafya_labour_monitor m ON m.patient_admission_id = a.id
LEFT JOIN dwh.fact_eafya_newborn n ON n.patient_admission_id = a.id
where e.origin = 'ip'