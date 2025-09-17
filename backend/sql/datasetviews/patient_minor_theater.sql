create view reporting.patient_minor_theater as 
SELECT
    r.patient_id,
    r.date_created as registered_date,
    v.id as visit_no,
    r.first_name,
    r.last_name,
    r.birth_date,
    r.gender,
    l.id as clinic_id,
    l."name" as clinic_name,
    t."name" as visit_type,
    m.id as minor_id,
    m.minor_theater_name,
    f.id as category_id,
    f.minor_theater_categroy AS category,
    p.date_created,
    p.treatment_duration,
    p.id AS patient_minor_theatre_id,
    p.minor_theater_id,
    p.encounter_id,
    e.id as enounter_id,
    e.origin ,
    e.encounter_notes ,
    e.illness_history,
    e.clinic_session_id,
    p.created_by_id
FROM dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_visit_type t on t.id = c.visit_type_id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = c.id
INNER JOIN dwh.fact_eafya_patient_minor_theatre p ON p.encounter_id = e.id 
INNER JOIN dwh.dim_eafya_minor_theatre m ON m.id = p.minor_theater_id 
INNER JOIN dwh.dim_eafya_minor_theatre_category f ON f.id = m.minor_theater_category_id