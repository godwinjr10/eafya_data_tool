-- HMIS 108: HEALTH UNIT INPATIENT MONTHLY REPORT
-- Professional SQL script based on actual database structure
-- Uses: patient_admission, patient_disease, disease, ward, encounter tables

-- ============================================================================
-- SECTION 1: CENSUS INFORMATION (Ward Statistics)
-- ============================================================================

SELECT 
    w.name as ward_name,
    w.id as ward_id,
    DATE_PART('year', pa.admission_date) as year,
    DATE_PART('month', pa.admission_date) as month,
    
    -- C101: Number of beds (from daily_inpatient_statistic or ward capacity)
    COALESCE(AVG(dis.bed_capacity), 0) as no_of_beds,
    
    -- C102: Number of admissions
    COUNT(pa.id) as no_of_admissions,
    
    -- C103: Number of deaths
    COUNT(CASE WHEN pa.discharge_date IS NOT NULL AND pa.discharge_outcome = 'DEATH' THEN 1 END) as no_of_deaths,
    
    -- C104: Patient days (calculated from admission to discharge)
    SUM(CASE 
        WHEN pa.discharge_date IS NOT NULL 
        THEN EXTRACT(DAY FROM (pa.discharge_date - pa.admission_date))
        ELSE EXTRACT(DAY FROM (DATE_TRUNC('month', pa.admission_date) + INTERVAL '1 month' - pa.admission_date))
    END) as patient_days,
    
    -- C105: Average length of stay
    CASE 
        WHEN COUNT(pa.id) > 0 
        THEN ROUND(AVG(CASE 
            WHEN pa.discharge_date IS NOT NULL 
            THEN EXTRACT(DAY FROM (pa.discharge_date - pa.admission_date))
            ELSE NULL
        END)::numeric, 2)
        ELSE 0 
    END as avg_length_of_stay,
    
    -- C106: Average occupancy
    ROUND((SUM(CASE 
        WHEN pa.discharge_date IS NOT NULL 
        THEN EXTRACT(DAY FROM (pa.discharge_date - pa.admission_date))
        ELSE EXTRACT(DAY FROM (DATE_TRUNC('month', pa.admission_date) + INTERVAL '1 month' - pa.admission_date))
    END)::numeric / DATE_PART('day', DATE_TRUNC('month', pa.admission_date) + INTERVAL '1 month' - INTERVAL '1 day')), 2) as avg_occupancy,
    
    -- C107: Bed occupancy percentage
    CASE 
        WHEN AVG(dis.bed_capacity) > 0 
        THEN ROUND(((SUM(CASE 
            WHEN pa.discharge_date IS NOT NULL 
            THEN EXTRACT(DAY FROM (pa.discharge_date - pa.admission_date))
            ELSE EXTRACT(DAY FROM (DATE_TRUNC('month', pa.admission_date) + INTERVAL '1 month' - pa.admission_date))
        END)::numeric / DATE_PART('day', DATE_TRUNC('month', pa.admission_date) + INTERVAL '1 month' - INTERVAL '1 day')) / AVG(dis.bed_capacity)::numeric * 100), 2)
        ELSE 0 
    END as bed_occupancy_percent

FROM public.patient_admission pa
JOIN public.ward w ON pa.admission_ward_id = w.id
LEFT JOIN public.daily_inpatient_statistic dis ON dis.ward_id = w.id 
    AND DATE_TRUNC('month', dis.date) = DATE_TRUNC('month', pa.admission_date)
WHERE pa.admission_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND pa.admission_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    w.name, w.id, 
    DATE_PART('year', pa.admission_date), 
    DATE_PART('month', pa.admission_date),
    DATE_TRUNC('month', pa.admission_date)
ORDER BY w.name
;

-- ============================================================================
-- SECTION 2: REFERRALS
-- ============================================================================

SELECT 
    DATE_PART('year', pa.admission_date) as year,
    DATE_PART('month', pa.admission_date) as month,
    
    -- RF01: Inpatients referred out from this health unit
    COUNT(CASE WHEN pa.referral_out = true THEN 1 END) as inpatients_referred_out,
    
    -- RF02: Inpatients referred in to the health unit  
    COUNT(CASE WHEN pa.referral_in = true THEN 1 END) as inpatients_referred_in,
    
    -- RF03: Inpatients who have self-referred
    COUNT(CASE WHEN pa.self_referral = true THEN 1 END) as inpatients_self_referred,
    
    -- RF04: Inpatients who have run-away
    COUNT(CASE WHEN pa.discharge_outcome = 'ABSCONDED' THEN 1 END) as inpatients_run_away

FROM public.patient_admission pa
WHERE pa.admission_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND pa.admission_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', pa.admission_date), 
    DATE_PART('month', pa.admission_date)
;

-- ============================================================================
-- SECTION 3: SURGICAL PROCEDURES
-- ============================================================================

SELECT 
    DATE_PART('year', sp.date_performed) as year,
    DATE_PART('month', sp.date_performed) as month,
    sp.procedure_category,
    sp.procedure_name,
    
    -- Count by age groups and gender
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(sp.date_performed, p.date_of_birth)) < 5 THEN 1 END) as male_0_4_years,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(sp.date_performed, p.date_of_birth)) < 5 THEN 1 END) as female_0_4_years,
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(sp.date_performed, p.date_of_birth)) >= 5 THEN 1 END) as male_5_years_above,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(sp.date_performed, p.date_of_birth)) >= 5 THEN 1 END) as female_5_years_above

FROM public.surgical_procedure sp
JOIN public.patient_admission pa ON sp.admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE sp.date_performed >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND sp.date_performed < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', sp.date_performed), 
    DATE_PART('month', sp.date_performed),
    sp.procedure_category,
    sp.procedure_name
ORDER BY sp.procedure_category, sp.procedure_name
;

-- ============================================================================
-- SECTION 4: BLOOD TRANSFUSION SERVICES
-- ============================================================================

SELECT 
    DATE_PART('year', bt.transfusion_date) as year,
    DATE_PART('month', bt.transfusion_date) as month,
    bt.blood_type,
    bt.component_type,
    
    -- UT01-UT04: Blood service statistics
    COUNT(bt.id) as units_requested,
    COUNT(CASE WHEN bt.status = 'RECEIVED' THEN 1 END) as units_received,
    COUNT(CASE WHEN bt.status = 'TRANSFUSED' THEN 1 END) as units_transfused,
    COUNT(CASE WHEN bt.adverse_reaction = true THEN 1 END) as adverse_reactions,
    
    -- RT01-RT09: Reasons for transfusion by age groups
    COUNT(CASE WHEN bt.indication = 'SEVERE_MALARIA' AND p.age_years < 5 THEN 1 END) as severe_malaria_under_5,
    COUNT(CASE WHEN bt.indication = 'SEVERE_MALARIA' AND p.age_years >= 5 THEN 1 END) as severe_malaria_5_plus,
    COUNT(CASE WHEN bt.indication = 'OBSTETRICS' THEN 1 END) as obstetrics,
    COUNT(CASE WHEN bt.indication = 'GYNAECOLOGY' THEN 1 END) as gynaecology,
    COUNT(CASE WHEN bt.indication = 'ACCIDENTS' THEN 1 END) as accidents,
    COUNT(CASE WHEN bt.indication = 'CANCER' THEN 1 END) as cancer_cases,
    COUNT(CASE WHEN bt.indication = 'SICKLE_CELL' THEN 1 END) as sickle_cell_anaemia,
    COUNT(CASE WHEN bt.indication = 'IDA' THEN 1 END) as iron_deficiency_anaemia,
    COUNT(CASE WHEN bt.indication = 'OTHER_COAGULOPATHIES' THEN 1 END) as other_coagulopathies,
    COUNT(CASE WHEN bt.indication = 'OTHER_SURGERIES' THEN 1 END) as other_surgeries

FROM public.blood_transfusion bt
JOIN public.patient_admission pa ON bt.admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE bt.transfusion_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND bt.transfusion_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', bt.transfusion_date), 
    DATE_PART('month', bt.transfusion_date),
    bt.blood_type,
    bt.component_type
ORDER BY bt.blood_type, bt.component_type
;

-- ============================================================================
-- SECTION 5: RADIOLOGY AND IMAGING
-- ============================================================================

SELECT 
    DATE_PART('year', ri.examination_date) as year,
    DATE_PART('month', ri.examination_date) as month,
    ri.modality_type,
    ri.examination_type,
    
    -- Count by age groups and gender
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(ri.examination_date, p.date_of_birth)) < 5 THEN 1 END) as male_0_4_years,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(ri.examination_date, p.date_of_birth)) < 5 THEN 1 END) as female_0_4_years,
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(ri.examination_date, p.date_of_birth)) >= 5 THEN 1 END) as male_5_years_above,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(ri.examination_date, p.date_of_birth)) >= 5 THEN 1 END) as female_5_years_above

FROM public.radiology_imaging ri
JOIN public.patient_admission pa ON ri.admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE ri.examination_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND ri.examination_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', ri.examination_date), 
    DATE_PART('month', ri.examination_date),
    ri.modality_type,
    ri.examination_type
ORDER BY ri.modality_type, ri.examination_type
;

-- ============================================================================
-- SECTION 6: DIAGNOSES BY CATEGORY
-- ============================================================================

SELECT 
    DATE_PART('year', e.date_created) as year,
    DATE_PART('month', e.date_created) as month,
    d.five_character_icd_code,
    d.name as diagnosis_name,
    dc.name as disease_category,
    
    -- Cases by age and gender
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) < 5 THEN 1 END) as male_cases_0_4_years,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) < 5 THEN 1 END) as female_cases_0_4_years,
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) >= 5 THEN 1 END) as male_cases_5_years_above,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) >= 5 THEN 1 END) as female_cases_5_years_above,
    
    -- Deaths by age and gender
    COUNT(CASE WHEN pd.classification = 'DEATH' AND p.gender = 'M' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) < 5 THEN 1 END) as male_deaths_0_4_years,
    COUNT(CASE WHEN pd.classification = 'DEATH' AND p.gender = 'F' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) < 5 THEN 1 END) as female_deaths_0_4_years,
    COUNT(CASE WHEN pd.classification = 'DEATH' AND p.gender = 'M' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) >= 5 THEN 1 END) as male_deaths_5_years_above,
    COUNT(CASE WHEN pd.classification = 'DEATH' AND p.gender = 'F' AND EXTRACT(YEAR FROM AGE(e.date_created, p.date_of_birth)) >= 5 THEN 1 END) as female_deaths_5_years_above

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
JOIN public.disease d ON pd.disease_id = d.id
JOIN public.disease_block db ON d.disease_block_id = db.id
JOIN public.disease_chapter dc ON db.disease_chapter_id = dc.id
JOIN public.patient_admission pa ON e.patient_admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE e.date_created >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND e.date_created < DATE_TRUNC('month', CURRENT_DATE)
    AND pd.annulled_at IS NULL
GROUP BY 
    DATE_PART('year', e.date_created), 
    DATE_PART('month', e.date_created),
    d.five_character_icd_code,
    d.name,
    dc.name
ORDER BY dc.name, d.name
;

-- ============================================================================
-- SECTION 7: TUBERCULOSIS SERVICES
-- ============================================================================

SELECT 
    DATE_PART('year', e.date_created) as year,
    DATE_PART('month', e.date_created) as month,
    
    -- TB Screening by age groups
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years BETWEEN 0 AND 9 AND p.gender = 'M' THEN 1 END) as tb_screened_male_0_9,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years BETWEEN 0 AND 9 AND p.gender = 'F' THEN 1 END) as tb_screened_female_0_9,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years BETWEEN 10 AND 14 AND p.gender = 'M' THEN 1 END) as tb_screened_male_10_14,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years BETWEEN 10 AND 14 AND p.gender = 'F' THEN 1 END) as tb_screened_female_10_14,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years BETWEEN 15 AND 19 AND p.gender = 'M' THEN 1 END) as tb_screened_male_15_19,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years BETWEEN 15 AND 19 AND p.gender = 'F' THEN 1 END) as tb_screened_female_15_19,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years >= 20 AND p.gender = 'M' THEN 1 END) as tb_screened_male_20_plus,
    COUNT(CASE WHEN pd.is_surveilled = true AND p.age_years >= 20 AND p.gender = 'F' THEN 1 END) as tb_screened_female_20_plus,
    
    -- Presumptive TB cases
    COUNT(CASE WHEN pd.classification = 'SUSPECTED' THEN 1 END) as presumptive_tb_cases,
    
    -- Diagnosed TB cases
    COUNT(CASE WHEN pd.classification IN ('CONFIRMED', 'DIAGNOSED') THEN 1 END) as diagnosed_tb_cases

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
JOIN public.disease d ON pd.disease_id = d.id
JOIN public.patient_admission pa ON e.patient_admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE e.date_created >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND e.date_created < DATE_TRUNC('month', CURRENT_DATE)
    AND pd.annulled_at IS NULL
    AND (d.five_character_icd_code LIKE 'A15%' OR d.five_character_icd_code LIKE 'A16%' OR d.name = 'Tuberculosis')
GROUP BY 
    DATE_PART('year', e.date_created), 
    DATE_PART('month', e.date_created)
;

-- ============================================================================
-- SECTION 8: NUTRITION SERVICES
-- ============================================================================

SELECT 
    DATE_PART('year', ns.service_date) as year,
    DATE_PART('month', ns.service_date) as month,
    ns.service_type,
    
    -- Nutrition services by age groups and gender
    COUNT(CASE WHEN p.gender = 'M' AND p.age_months BETWEEN 0 AND 5 THEN 1 END) as male_0_5_months,
    COUNT(CASE WHEN p.gender = 'F' AND p.age_months BETWEEN 0 AND 5 THEN 1 END) as female_0_5_months,
    COUNT(CASE WHEN p.gender = 'M' AND p.age_months BETWEEN 6 AND 23 THEN 1 END) as male_6_23_months,
    COUNT(CASE WHEN p.gender = 'F' AND p.age_months BETWEEN 6 AND 23 THEN 1 END) as female_6_23_months,
    COUNT(CASE WHEN p.gender = 'M' AND p.age_months BETWEEN 24 AND 59 THEN 1 END) as male_24_59_months,
    COUNT(CASE WHEN p.gender = 'F' AND p.age_months BETWEEN 24 AND 59 THEN 1 END) as female_24_59_months,
    COUNT(CASE WHEN p.gender = 'M' AND p.age_years BETWEEN 5 AND 9 THEN 1 END) as male_5_9_years,
    COUNT(CASE WHEN p.gender = 'F' AND p.age_years BETWEEN 5 AND 9 THEN 1 END) as female_5_9_years,
    
    -- Treatment outcomes
    COUNT(CASE WHEN ns.outcome = 'CURED' THEN 1 END) as successfully_treated,
    COUNT(CASE WHEN ns.outcome = 'DEFAULTED' THEN 1 END) as defaulted_from_care,
    COUNT(CASE WHEN ns.outcome = 'DEATH' THEN 1 END) as died_during_treatment

FROM public.nutrition_service ns
JOIN public.patient_admission pa ON ns.admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE ns.service_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND ns.service_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', ns.service_date), 
    DATE_PART('month', ns.service_date),
    ns.service_type
ORDER BY ns.service_type
;