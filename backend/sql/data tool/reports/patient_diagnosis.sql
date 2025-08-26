SELECT DISTINCT ON (pd.encounter_id, pd.patient_id, pd.disease_id, pd.date_created)
    pd.patient_id, 
    pd.birth_date,
    DATE_PART('year', AGE(pd.birth_date)) AS age,
    pd.gender, 
    pd."name" AS clinic_name, 
    pd.visit_type_name, 
    pd.disease_name, 
    pd.classification, 
    su.first_name || ' ' || COALESCE(su.other_name || ' ', '') || su.last_name AS clinician,
    pd.date_created, 
    pd.last_updated,
    r."name" AS role
FROM 
    reporting.patient_diagnosis pd
INNER JOIN 
    dwh.dim_eafya_system_user su ON pd.created_by_id = su.id
INNER JOIN 
    dwh.dim_eafya_role r ON su.role_id = r.id
ORDER BY 
    pd.encounter_id,
    pd.patient_id,
    pd.disease_id,
    pd.date_created DESC,
    clinician;