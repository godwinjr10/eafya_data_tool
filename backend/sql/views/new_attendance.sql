create view reporting.new_attendance as 
SELECT 
DISTINCT ON (d.patient_id, DATE_TRUNC('month', v.date_created))
d.patient_id,
v.id AS visit_no,
v.date_created::date AS visit_date,
c.name AS clinic_name,
d.gender,
d.birth_date::date,
AGE(v.date_created::date, d.birth_date::date) AS age_years,
DATE_TRUNC('month', v.date_created)::date AS report_month
FROM dwh.fact_eafya_patient_visit v
INNER JOIN dwh.dim_eafya_registered_patients d ON d.patient_id = v.patient_id
INNER JOIN dwh.fact_eafya_clinic_session s ON s.patient_visit_id = v.id
INNER JOIN dwh.dim_eafya_clinic c ON c.id = s.clinic_id
INNER JOIN dwh.fact_eafya_encounters e ON e.clinic_session_id = s.id
INNER JOIN dwh.fact_eafya_patient_disease n ON n.encounter_id = e.id
WHERE e.origin = 'op'
ORDER BY d.patient_id, DATE_TRUNC('month', v.date_created), v.date_created;



