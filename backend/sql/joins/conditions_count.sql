SELECT 
a.disease_id,
  g.name AS disease,
  COUNT(a.disease_id) AS total_cases
FROM public.patient_disease a
INNER JOIN public.encounter e ON e.id = a.encounter_id
INNER JOIN public.clinic_session c ON c.id = e.clinic_session_id
INNER JOIN public.patient_visit v ON v.id = c.patient_visit_id 
INNER JOIN public.registered_patient_detail d ON d.patient_id = v.patient_id
INNER JOIN public.clinic n ON n.id = c.clinic_id 
INNER JOIN public.visit_type t ON t.id = c.visit_type_id
inner JOIN public.disease g ON g.id = a.disease_id 
WHERE a.date_created BETWEEN '2025-06-01' AND '2025-06-30'
GROUP BY a.disease_id, g.name
ORDER BY total_cases DESC;