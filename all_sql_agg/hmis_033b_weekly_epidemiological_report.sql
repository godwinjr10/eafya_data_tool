-- HMIS 033b: HEALTH UNIT WEEKLY EPIDEMIOLOGICAL SURVEILLANCE REPORT
-- Based on actual database structure from dump file
-- Uses: patient_disease, encounter, disease, daily_inpatient_statistic, ward tables

-- ============================================================================
-- SECTION 1: CASES AND DEATHS THIS WEEK (Main Disease Surveillance)
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- Disease codes and counts
    d.five_character_icd_code as disease_code,
    d.name as disease_name,
    COUNT(pd.id) as total_cases_this_week,
    COUNT(CASE WHEN pd.classification = 'DEATH' THEN 1 END) as total_deaths_this_week,
    COUNT(CASE WHEN pd.is_surveilled = true THEN 1 END) as tested_cases,
    COUNT(CASE WHEN pd.is_surveilled = true AND pd.classification = 'CONFIRMED' THEN 1 END) as positive_cases

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
JOIN public.disease d ON pd.disease_id = d.id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
    AND pd.annulled_at IS NULL
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created),
    d.five_character_icd_code,
    d.name
ORDER BY d.name
;

-- ============================================================================
-- SECTION 2: OPD AND EMTCT SUMMARY
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- OPD Summary
    COUNT(CASE WHEN e.origin = 'OP' THEN 1 END) as opd_new_attendance,
    COUNT(*) as total_opd_attendance,
    COUNT(CASE WHEN pd.classification = 'DEATH' THEN 1 END) as total_deaths,
    
    -- EMTCT Summary (assuming EMTCT encounters have specific clinic_session_id)
    COUNT(CASE WHEN e.clinic_session_id IN (SELECT id FROM public.clinic_session WHERE name LIKE '%EMTCT%') THEN 1 END) as expected_emtct_mothers_on_appt,
    COUNT(CASE WHEN e.clinic_session_id IN (SELECT id FROM public.clinic_session WHERE name LIKE '%EMTCT%') AND e.encounter_notes LIKE '%missed%' THEN 1 END) as emtct_missed_appointments

FROM public.encounter e
LEFT JOIN public.patient_disease pd ON e.id = pd.encounter_id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created)
;

-- ============================================================================
-- SECTION 3: OTHER CONDITIONS (Priority Diseases)
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- Epidemic Prone Diseases
    d.five_character_icd_code as disease_code,
    d.name as disease_name,
    COUNT(pd.id) as total_cases_this_week,
    COUNT(CASE WHEN pd.classification = 'DEATH' THEN 1 END) as total_deaths_this_week,
    COUNT(CASE WHEN pd.is_surveilled = true THEN 1 END) as tested_cases,
    COUNT(CASE WHEN pd.is_surveilled = true AND pd.classification = 'CONFIRMED' THEN 1 END) as positive_cases

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
JOIN public.disease d ON pd.disease_id = d.id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
    AND pd.annulled_at IS NULL
    AND d.name ILIKE ANY (ARRAY['%malaria%', '%dysentery%', '%cholera%', '%measles%', '%typhoid%', '%hepatitis%', '%tuberculosis%', '%leprosy%', '%anthrax%', '%plague%', '%yellow fever%', '%dengue%', '%chikungunya%', '%influenza%', '%meningitis%', '%pneumonia%', '%diarrhea%', '%diphtheria%', '%pertussis%', '%brucellosis%', '%schistosomiasis%', '%trachoma%', '%trypanosomiasis%', '%kala azar%', '%nodding syndrome%', '%adverse drug reaction%', '%covid%'])
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created),
    d.five_character_icd_code,
    d.name
ORDER BY d.name
;

-- ============================================================================
-- SECTION 4: SUMMARY OF MALARIA CASES TESTED AND TREATED
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- Malaria Summary
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.classification = 'SUSPECTED' THEN 1 END) as suspected_malaria_fever,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%RDT%' THEN 1 END) as cases_tested_with_rdt,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%RDT%' AND pd.classification = 'CONFIRMED' THEN 1 END) as rdt_positive_cases,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%microscopy%' THEN 1 END) as cases_tested_with_microscopy,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%microscopy%' AND pd.classification = 'CONFIRMED' THEN 1 END) as microscopy_positive_cases,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = false AND pd.classification = 'TREATED' THEN 1 END) as not_tested_cases_treated,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%RDT%' AND pd.classification != 'CONFIRMED' AND pd.classification = 'TREATED' THEN 1 END) as rdt_negative_cases_treated,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%RDT%' AND pd.classification = 'CONFIRMED' AND pd.classification = 'TREATED' THEN 1 END) as rdt_positive_cases_treated,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%microscopy%' AND pd.classification != 'CONFIRMED' AND pd.classification = 'TREATED' THEN 1 END) as microscopy_negative_cases_treated,
    COUNT(CASE WHEN d.name ILIKE '%malaria%' AND pd.is_surveilled = true AND pd.comment ILIKE '%microscopy%' AND pd.classification = 'CONFIRMED' AND pd.classification = 'TREATED' THEN 1 END) as microscopy_positive_cases_treated

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
JOIN public.disease d ON pd.disease_id = d.id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
    AND pd.annulled_at IS NULL
    AND d.name ILIKE '%malaria%'
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created)
;

-- ============================================================================
-- SECTION 5: SUMMARY OF TUBERCULOSIS CASES TESTED AND TREATED
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- TB Summary
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' THEN 1 END) as clients_screened_for_tb_at_all_entry_points,
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' AND pd.classification = 'SUSPECTED' THEN 1 END) as presumptive_tb_cases_identified_at_all_entry_points,
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' AND pd.classification IN ('CONFIRMED', 'DIAGNOSED') THEN 1 END) as new_and_relapse_diagnosed_and_registered,
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' AND pd.classification = 'TREATED' THEN 1 END) as new_and_relapse_tb_cases_started_on_treatment,
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' AND pd.is_surveilled = true THEN 1 END) as bacteriologically_tb_cases_registered,
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' AND pd.is_surveilled = true AND pd.comment ILIKE '%genexpert%' THEN 1 END) as bacteriologically_confirmed_tb_cases_tested_with_genexpert,
    COUNT(CASE WHEN d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%' AND pd.comment ILIKE '%contact%' THEN 1 END) as number_of_tb_contacts_traced_and_screened

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
JOIN public.disease d ON pd.disease_id = d.id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
    AND pd.annulled_at IS NULL
    AND (d.name ILIKE '%tuberculosis%' OR d.name ILIKE '%TB%')
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created)
;

-- ============================================================================
-- SECTION 6: TRACER MEDICINES - STOCK BALANCE
-- ============================================================================

SELECT 
    DATE_TRUNC('week', CURRENT_DATE) as week_start,
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days' as week_end,
    DATE_PART('week', CURRENT_DATE) as week_number,
    DATE_PART('year', CURRENT_DATE) as year,
    
    -- Tracer Medicines Stock Balance
    COALESCE(SUM(CASE WHEN i.name LIKE '%Artemether/Lumefantrine%20/120%' THEN i.quantity_on_hand ELSE 0 END), 0) as artemether_lumefantrine_20_120_mg_tablet,
    COALESCE(SUM(CASE WHEN i.name LIKE '%ORS%zinc%' THEN i.quantity_on_hand ELSE 0 END), 0) as ors_sachets_with_zinc_tablet,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Measles%Rubella%Vaccine%' THEN i.quantity_on_hand ELSE 0 END), 0) as measles_rubella_vaccine_vial,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Amoxicillin%250mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as amoxicillin_dispersible_250mg_tablets,
    COALESCE(SUM(CASE WHEN i.name LIKE '%DMPA%' THEN i.quantity_on_hand ELSE 0 END), 0) as depot_medroxyprogesterone_acetate_dmpa_im_sc,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Artesunate%60mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as artesunate_60_mg_vial,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Sulfadoxine/Pyrimethamine%' THEN i.quantity_on_hand ELSE 0 END), 0) as sulfadoxine_pyrimethamine_tablet,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Malaria%RDT%' THEN i.quantity_on_hand ELSE 0 END), 0) as malaria_rapid_diagnostic_tests

FROM public.items i
WHERE i.date_updated >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
GROUP BY DATE_TRUNC('week', CURRENT_DATE), DATE_PART('week', CURRENT_DATE), DATE_PART('year', CURRENT_DATE)
;

-- ============================================================================
-- SECTION 7: HIV TESTING KITS, TB, & EMTCT DRUGS - STOCK BALANCE
-- ============================================================================

SELECT 
    DATE_TRUNC('week', CURRENT_DATE) as week_start,
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days' as week_end,
    DATE_PART('week', CURRENT_DATE) as week_number,
    DATE_PART('year', CURRENT_DATE) as year,
    
    -- HIV Testing Kits, TB, & EMTCT Drugs Stock Balance
    COALESCE(SUM(CASE WHEN i.name LIKE '%Determine%HIV%' THEN i.quantity_on_hand ELSE 0 END), 0) as determine_hiv_1_2_screening_test,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Stat-pack%HIV%' THEN i.quantity_on_hand ELSE 0 END), 0) as statpack_hiv_confirmatory_rapid_tests,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Abacavir/Lamivudine/Dolutegravir%' THEN i.quantity_on_hand ELSE 0 END), 0) as abacavir_lamivudine_dolutegravir_abc_3tc_dtg_600_300_50mg,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Nevirapine%10mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as nevirapine_nvp_10mg_ml_oral_susp,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Tenofovir/Lamivudine/Dolutegravir%' THEN i.quantity_on_hand ELSE 0 END), 0) as tenofovir_lamivudine_dolutegravir_tdf_3tc_dtg_300_300_50mg,
    COALESCE(SUM(CASE WHEN i.name LIKE '%RHZ%75/50/150mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as rhz_75_50_150mg_blisters_of_28_tablets,
    COALESCE(SUM(CASE WHEN i.name LIKE '%RHZE%150/75/400/275mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as rhze_150_75_400_275mg_blisters_of_28_tablets,
    COALESCE(SUM(CASE WHEN i.name LIKE '%RH%150/75mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as rh_150_75mg_blister_of_28_tablets,
    COALESCE(SUM(CASE WHEN i.name LIKE '%RH%75/50mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as rh_75_50mg_blister_of_28_tablets,
    COALESCE(SUM(CASE WHEN i.name LIKE '%Rifapentine/Isoniazid%300/300mg%' THEN i.quantity_on_hand ELSE 0 END), 0) as rifapentine_isoniazid_300_300mg

FROM public.items i
WHERE i.date_updated >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
GROUP BY DATE_TRUNC('week', CURRENT_DATE), DATE_PART('week', CURRENT_DATE), DATE_PART('year', CURRENT_DATE)
;

-- ============================================================================
-- SECTION 8: SUMMARY OF GENEXPERT REPORT FOR GENEXPERT/TRUENAT SITES ONLY
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- GeneXpert Summary
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.is_surveilled = true THEN 1 END) as no_of_samples_tested,
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.comment ILIKE '%rejected%' THEN 1 END) as no_of_samples_rejected,
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.comment ILIKE '%MTB%' AND pd.classification = 'CONFIRMED' THEN 1 END) as total_mtb_detected,
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.comment ILIKE '%rifampicin%' AND pd.comment ILIKE '%resistant%' THEN 1 END) as total_no_rif_r,
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.comment ILIKE '%error%' THEN 1 END) as no_of_errors_invalid_results,
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.comment ILIKE '%module%' THEN 1 END) as no_genexpert_modules_working,
    COUNT(CASE WHEN pd.comment ILIKE '%genexpert%' AND pd.comment ILIKE '%cartridge%' THEN 1 END) as no_of_cartridges_remaining

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
    AND pd.annulled_at IS NULL
    AND pd.comment ILIKE '%genexpert%'
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created)
;

-- ============================================================================
-- SECTION 9: SUMMARY OF TPT INITIATION
-- ============================================================================

SELECT 
    DATE_TRUNC('week', e.date_created) as week_start,
    DATE_TRUNC('week', e.date_created) + INTERVAL '6 days' as week_end,
    DATE_PART('week', e.date_created) as week_number,
    DATE_PART('year', e.date_created) as year,
    
    -- TPT (Tuberculosis Preventive Treatment) Summary
    COUNT(CASE WHEN pd.comment ILIKE '%TPT%' AND pd.comment ILIKE '%adult%' AND pd.classification = 'TREATED' THEN 1 END) as number_of_adult_art_clients_initiated_tpt,
    COUNT(CASE WHEN pd.comment ILIKE '%TPT%' AND (pd.comment ILIKE '%child%' OR pd.comment ILIKE '%adolescent%') AND pd.classification = 'TREATED' THEN 1 END) as number_of_children_and_adolescents_on_art_who_started_tpt,
    COUNT(CASE WHEN pd.comment ILIKE '%TPT%' AND pd.comment ILIKE '%contact%' AND pd.comment ILIKE '%0-4%' AND pd.classification = 'TREATED' THEN 1 END) as number_of_children_0_4_yrs_who_are_contacts_of_tb_patients_initiated_on_tpt,
    COUNT(CASE WHEN pd.comment ILIKE '%TPT%' AND pd.comment ILIKE '%contact%' AND pd.comment ILIKE '%5+%' AND pd.classification = 'TREATED' THEN 1 END) as number_of_children_5_yrs_and_above_who_are_contacts_of_tb_patients_initiated_on_tpt

FROM public.patient_disease pd
JOIN public.encounter e ON pd.encounter_id = e.id
WHERE e.date_created >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
    AND e.date_created < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
    AND pd.annulled_at IS NULL
    AND pd.comment ILIKE '%TPT%'
GROUP BY 
    DATE_TRUNC('week', e.date_created), 
    DATE_PART('week', e.date_created), 
    DATE_PART('year', e.date_created)
; 