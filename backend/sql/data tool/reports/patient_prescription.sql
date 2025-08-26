SELECT 
    pp.patient_id, 
    pp.birth_date, 
    -- Calculate age from birth_date
    DATE_PART('year', AGE(pp.birth_date)) AS age,
    pp.gender, 
    pp."name" AS clinic_name, 
    pp.visit_type_name, 
    pp.drug_name, 
    pp.date_created, 
    pp.dosage, 
    pp.duration, 
    pp.frequency, 
    -- User details
    u.first_name || ' ' || COALESCE(u.other_name || ' ', '') || u.last_name AS clinician,
    -- Role details
    r."name" AS role
FROM 
    reporting.patient_prescription pp
INNER JOIN 
    dwh.dim_eafya_system_user u ON pp.created_by_id = u.id
INNER JOIN 
    dwh.dim_eafya_role r ON u.role_id = r.id
ORDER BY 
    pp.date_created DESC;











-- -- Clinician with Most Unique Patients and Their Clinic
-- SELECT 
--     u.first_name || ' ' || COALESCE(u.other_name || ' ', '') || u.last_name AS clinician,
--     pp."name" AS clinic_name,
--     COUNT(DISTINCT pp.patient_id) AS patients_seen
-- FROM reporting.patient_prescription pp
-- JOIN dwh.dim_eafya_system_user u ON pp.created_by_id = u.id
-- GROUP BY clinician, clinic_name
-- ORDER BY patients_seen DESC
-- ;



-- --patients per clinic
-- SELECT 
--     pp."name" AS clinic_name,
--     COUNT(DISTINCT pp.patient_id) AS patient_count
-- FROM reporting.patient_prescription pp
-- GROUP BY pp."name"
-- ORDER BY patient_count DESC;



-- --prescriptions by age group
-- SELECT 
--     pp."name" AS clinic_name,
--     CASE 
--         WHEN DATE_PART('year', AGE(pp.birth_date)) < 18 THEN '0-17'
--         WHEN DATE_PART('year', AGE(pp.birth_date)) BETWEEN 18 AND 35 THEN '18-35'
--         WHEN DATE_PART('year', AGE(pp.birth_date)) BETWEEN 36 AND 50 THEN '36-50'
--         WHEN DATE_PART('year', AGE(pp.birth_date)) BETWEEN 51 AND 65 THEN '51-65'
--         ELSE '65+'
--     END AS age_group,
--     COUNT(*) AS total
-- FROM reporting.patient_prescription pp
-- GROUP BY clinic_name, age_group
-- ORDER BY clinic_name, age_group;







-- --prescriptions per drug
-- SELECT 
--     pp.drug_name, 
--     COUNT(*) AS total_prescriptions
-- FROM reporting.patient_prescription pp
-- GROUP BY pp.drug_name
-- ORDER BY total_prescriptions DESC;



-- --prescriptions per clinic
-- SELECT 
--     pp."name" AS clinic_name, 
--     COUNT(*) AS total
-- FROM reporting.patient_prescription pp
-- GROUP BY pp."name"
-- ORDER BY total DESC;


-- --Daily Prescription Count by Clinic and Drug (Last 30 Days)
-- SELECT 
--     pp.date_created::date AS prescription_date,
--     pp."name" AS clinic_name,
--     pp.drug_name,
--     COUNT(*) AS total
-- FROM reporting.patient_prescription pp
-- WHERE pp.date_created >= CURRENT_DATE - INTERVAL '30 days'
-- GROUP BY prescription_date, clinic_name, drug_name
-- ORDER BY prescription_date, clinic_name, drug_name;



