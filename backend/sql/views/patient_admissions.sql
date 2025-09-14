create view reporting.patient_admissions as 
SELECT
    r.patient_id,
    r.gender,
    r.birth_date,
    r.first_name ,
    r.last_name ,
    d.admission_date,
    d.admission_ward_id,
    c.id as cinic_id,
    c."name" as clinic_name,
    w.id as ward_id,
    w.name AS admission_ward_name,
    d.admitting_doctor_id,
    d.assigned_doctor_id,
    d.brought_in_by_id,
    d.comments,
    d.created_by_id,
    d.date_created,
    d.discharge_care_plan,
    d.discharge_date,
    d.discharge_encounter_id,
    d.discharging_doctor_id,
    d.encounter_id AS admission_encounter_id,
     e.id as encounter_id,
     e.origin ,
     e.encounter_notes ,
     e.illness_history ,
    d.escorting_nurse_id,
    d.is_closed,
    d.last_updated,
    d.medical_discharge_date,
    d.receiving_nurse_id,
    d.released_by_id,
    d.is_admission_approved,
    d.patient_visit_id
FROM dwh.fact_eafya_admissions d
INNER JOIN dwh.fact_eafya_encounters e ON e.id = d.encounter_id
INNER JOIN dwh.dim_eafya_ward w ON w.id = d.admission_ward_id
inner join dwh.fact_eafya_patient_visit v on v.id = d.patient_visit_id
inner join dwh.fact_eafya_clinic_session s on s.patient_visit_id = v.id 
inner join dwh.dim_eafya_clinic c on c.id = s.clinic_id 
inner join dwh.dim_eafya_registered_patients r on r.patient_id = v.patient_id 