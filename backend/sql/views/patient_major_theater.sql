create view reporting.patient_major_theater as 
SELECT
    r.patient_id,
    r.date_created as registered_date,
    v.id as visit_no,
    r.first_name,
    r.last_name,
    r.birth_date,
    r.gender,
    m.id as theater_id,
    m.major_theater_name,
    f.major_theater_category AS category,
    x.major_theater_room AS room,
    p.date_created,
    p.scheduled_date,
    p.scheduled_time,
    p.id AS patient_major_theatre_id,
    m.id AS major_theater_id,
    p.major_theater_room_id,
    e.id as enounter_id,
    e.origin ,
    e.encounter_notes ,
    e.illness_history,
    e.clinic_session_id,
    l.id as clinic_id,
    t."name" as visit_type,
    p.administered_by_id,
    p.created_by_id
FROM dwh.dim_eafya_registered_patients r
inner join dwh.fact_eafya_patient_visit v on v.patient_id = r.patient_id
inner join dwh.fact_eafya_clinic_session c on c.patient_visit_id = v.id
inner join dwh.dim_eafya_visit_type t on t.id = c.visit_type_id
inner join dwh.dim_eafya_clinic l on l.id = c.clinic_id 
inner join dwh.fact_eafya_encounters e on e.clinic_session_id = c.id
INNER JOIN dwh.fact_eafya_patient_major_theatre p ON p.encounter_id = e.id
INNER JOIN dwh.dim_eafya_major_theatre m ON m.id = p.major_theater_id
INNER JOIN dwh.dim_eafya_major_theatre_category f ON f.id = m.major_theater_category_id
INNER JOIN dwh.dim_eafya_major_theatre_room x ON x.id = p.major_theater_room_id