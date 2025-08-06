-- =======================================================
-- HMIS 108 HEALTH UNIT INPATIENT MONTHLY REPORT - SQL AGGREGATES
-- =======================================================
-- This script generates aggregate data for the HMIS 108 Inpatient Monthly Report
-- for DHIS2 integration, covering census information, referrals, and surgical procedures

-- =======================================================
-- 1. CENSUS INFORMATION AGGREGATES (Main Inpatient Data)
-- =======================================================

-- Ward-level census data aggregation
CREATE OR REPLACE VIEW reporting.v_hmis_108_census_data AS
SELECT 
    h."facilityId" as facility_id,
    f.facility_name,
    h."reportingPeriod"->>'year' as report_year,
    h."reportingPeriod"->>'month' as report_month,
    h."reportingPeriod"->>'year' || LPAD(h."reportingPeriod"->>'month', 2, '0') as period,
    
    -- Section 1: Census Information - Ward Data
    -- C101: Number of beds by ward type
    (h.data->>'male_medical_beds')::int as c101_male_medical_beds,
    (h.data->>'female_medical_beds')::int as c101_female_medical_beds,
    (h.data->>'paediatrics_beds')::int as c101_paediatrics_beds,
    (h.data->>'maternity_beds')::int as c101_maternity_beds,
    (h.data->>'male_surgical_beds')::int as c101_male_surgical_beds,
    (h.data->>'female_surgical_beds')::int as c101_female_surgical_beds,
    (h.data->>'tb_ward_beds')::int as c101_tb_ward_beds,
    (h.data->>'psychiatric_beds')::int as c101_psychiatric_beds,
    (h.data->>'emergency_beds')::int as c101_emergency_beds,
    (h.data->>'gynaecology_beds')::int as c101_gynaecology_beds,
    (h.data->>'acu_beds')::int as c101_acu_beds,
    (h.data->>'palliative_beds')::int as c101_palliative_beds,
    (h.data->>'eye_ward_beds')::int as c101_eye_ward_beds,
    (h.data->>'icu_beds')::int as c101_icu_beds,
    (h.data->>'nutrition_beds')::int as c101_nutrition_beds,
    (h.data->>'ent_beds')::int as c101_ent_beds,
    (h.data->>'orthopaedic_beds')::int as c101_orthopaedic_beds,
    (h.data->>'neonatal_beds')::int as c101_neonatal_beds,
    (h.data->>'rehabilitation_beds')::int as c101_rehabilitation_beds,
    (h.data->>'other_ward_beds')::int as c101_other_ward_beds,
    
    -- C102: Number of admissions by ward type
    (h.data->>'male_medical_admissions')::int as c102_male_medical_admissions,
    (h.data->>'female_medical_admissions')::int as c102_female_medical_admissions,
    (h.data->>'paediatrics_admissions')::int as c102_paediatrics_admissions,
    (h.data->>'maternity_admissions')::int as c102_maternity_admissions,
    (h.data->>'male_surgical_admissions')::int as c102_male_surgical_admissions,
    (h.data->>'female_surgical_admissions')::int as c102_female_surgical_admissions,
    (h.data->>'tb_ward_admissions')::int as c102_tb_ward_admissions,
    (h.data->>'psychiatric_admissions')::int as c102_psychiatric_admissions,
    (h.data->>'emergency_admissions')::int as c102_emergency_admissions,
    (h.data->>'gynaecology_admissions')::int as c102_gynaecology_admissions,
    (h.data->>'acu_admissions')::int as c102_acu_admissions,
    (h.data->>'palliative_admissions')::int as c102_palliative_admissions,
    (h.data->>'eye_ward_admissions')::int as c102_eye_ward_admissions,
    (h.data->>'icu_admissions')::int as c102_icu_admissions,
    (h.data->>'nutrition_admissions')::int as c102_nutrition_admissions,
    (h.data->>'ent_admissions')::int as c102_ent_admissions,
    (h.data->>'orthopaedic_admissions')::int as c102_orthopaedic_admissions,
    (h.data->>'neonatal_admissions')::int as c102_neonatal_admissions,
    (h.data->>'rehabilitation_admissions')::int as c102_rehabilitation_admissions,
    (h.data->>'other_ward_admissions')::int as c102_other_ward_admissions,
    
    -- C103: Number of deaths by ward type
    (h.data->>'male_medical_deaths')::int as c103_male_medical_deaths,
    (h.data->>'female_medical_deaths')::int as c103_female_medical_deaths,
    (h.data->>'paediatrics_deaths')::int as c103_paediatrics_deaths,
    (h.data->>'maternity_deaths')::int as c103_maternity_deaths,
    (h.data->>'male_surgical_deaths')::int as c103_male_surgical_deaths,
    (h.data->>'female_surgical_deaths')::int as c103_female_surgical_deaths,
    (h.data->>'tb_ward_deaths')::int as c103_tb_ward_deaths,
    (h.data->>'psychiatric_deaths')::int as c103_psychiatric_deaths,
    (h.data->>'emergency_deaths')::int as c103_emergency_deaths,
    (h.data->>'gynaecology_deaths')::int as c103_gynaecology_deaths,
    (h.data->>'acu_deaths')::int as c103_acu_deaths,
    (h.data->>'palliative_deaths')::int as c103_palliative_deaths,
    (h.data->>'eye_ward_deaths')::int as c103_eye_ward_deaths,
    (h.data->>'icu_deaths')::int as c103_icu_deaths,
    (h.data->>'nutrition_deaths')::int as c103_nutrition_deaths,
    (h.data->>'ent_deaths')::int as c103_ent_deaths,
    (h.data->>'orthopaedic_deaths')::int as c103_orthopaedic_deaths,
    (h.data->>'neonatal_deaths')::int as c103_neonatal_deaths,
    (h.data->>'rehabilitation_deaths')::int as c103_rehabilitation_deaths,
    (h.data->>'other_ward_deaths')::int as c103_other_ward_deaths,
    
    -- C104: Patient days by ward type
    (h.data->>'male_medical_patient_days')::int as c104_male_medical_patient_days,
    (h.data->>'female_medical_patient_days')::int as c104_female_medical_patient_days,
    (h.data->>'paediatrics_patient_days')::int as c104_paediatrics_patient_days,
    (h.data->>'maternity_patient_days')::int as c104_maternity_patient_days,
    (h.data->>'male_surgical_patient_days')::int as c104_male_surgical_patient_days,
    (h.data->>'female_surgical_patient_days')::int as c104_female_surgical_patient_days,
    (h.data->>'tb_ward_patient_days')::int as c104_tb_ward_patient_days,
    (h.data->>'psychiatric_patient_days')::int as c104_psychiatric_patient_days,
    (h.data->>'emergency_patient_days')::int as c104_emergency_patient_days,
    (h.data->>'gynaecology_patient_days')::int as c104_gynaecology_patient_days,
    (h.data->>'acu_patient_days')::int as c104_acu_patient_days,
    (h.data->>'palliative_patient_days')::int as c104_palliative_patient_days,
    (h.data->>'eye_ward_patient_days')::int as c104_eye_ward_patient_days,
    (h.data->>'icu_patient_days')::int as c104_icu_patient_days,
    (h.data->>'nutrition_patient_days')::int as c104_nutrition_patient_days,
    (h.data->>'ent_patient_days')::int as c104_ent_patient_days,
    (h.data->>'orthopaedic_patient_days')::int as c104_orthopaedic_patient_days,
    (h.data->>'neonatal_patient_days')::int as c104_neonatal_patient_days,
    (h.data->>'rehabilitation_patient_days')::int as c104_rehabilitation_patient_days,
    (h.data->>'other_ward_patient_days')::int as c104_other_ward_patient_days,
    
    h."createdAt",
    h."updatedAt"
FROM "HMIS" h
JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
WHERE h.metadata->>'status' = 'approved'
    AND h."dataSetId" = 'HMIS_108_01'  -- Inpatient dataset
ORDER BY h."reportingPeriod"->>'year' DESC, h."reportingPeriod"->>'month' DESC, f.facility_name;

-- =======================================================
-- 2. CALCULATED INDICATORS (C105-C107)
-- =======================================================

-- View with calculated indicators for average length of stay, occupancy, and bed occupancy
CREATE OR REPLACE VIEW reporting.v_hmis_108_calculated_indicators AS
SELECT 
    *,
    -- C105: Average length of stay (E=D/B) - Patient days divided by admissions
    CASE WHEN c102_male_medical_admissions > 0 THEN ROUND(c104_male_medical_patient_days::float / c102_male_medical_admissions, 2) ELSE 0 END as c105_male_medical_avg_stay,
    CASE WHEN c102_female_medical_admissions > 0 THEN ROUND(c104_female_medical_patient_days::float / c102_female_medical_admissions, 2) ELSE 0 END as c105_female_medical_avg_stay,
    CASE WHEN c102_paediatrics_admissions > 0 THEN ROUND(c104_paediatrics_patient_days::float / c102_paediatrics_admissions, 2) ELSE 0 END as c105_paediatrics_avg_stay,
    CASE WHEN c102_maternity_admissions > 0 THEN ROUND(c104_maternity_patient_days::float / c102_maternity_admissions, 2) ELSE 0 END as c105_maternity_avg_stay,
    CASE WHEN c102_male_surgical_admissions > 0 THEN ROUND(c104_male_surgical_patient_days::float / c102_male_surgical_admissions, 2) ELSE 0 END as c105_male_surgical_avg_stay,
    CASE WHEN c102_female_surgical_admissions > 0 THEN ROUND(c104_female_surgical_patient_days::float / c102_female_surgical_admissions, 2) ELSE 0 END as c105_female_surgical_avg_stay,
    
    -- C106: Average occupancy (F=D/30 days) - Patient days divided by days in month
    ROUND(c104_male_medical_patient_days::float / 30, 2) as c106_male_medical_avg_occupancy,
    ROUND(c104_female_medical_patient_days::float / 30, 2) as c106_female_medical_avg_occupancy,
    ROUND(c104_paediatrics_patient_days::float / 30, 2) as c106_paediatrics_avg_occupancy,
    ROUND(c104_maternity_patient_days::float / 30, 2) as c106_maternity_avg_occupancy,
    ROUND(c104_male_surgical_patient_days::float / 30, 2) as c106_male_surgical_avg_occupancy,
    ROUND(c104_female_surgical_patient_days::float / 30, 2) as c106_female_surgical_avg_occupancy,
    
    -- C107: Bed occupancy (F/A)x100 - Average occupancy divided by number of beds, multiplied by 100
    CASE WHEN c101_male_medical_beds > 0 THEN ROUND((c104_male_medical_patient_days::float / 30) / c101_male_medical_beds * 100, 2) ELSE 0 END as c107_male_medical_bed_occupancy,
    CASE WHEN c101_female_medical_beds > 0 THEN ROUND((c104_female_medical_patient_days::float / 30) / c101_female_medical_beds * 100, 2) ELSE 0 END as c107_female_medical_bed_occupancy,
    CASE WHEN c101_paediatrics_beds > 0 THEN ROUND((c104_paediatrics_patient_days::float / 30) / c101_paediatrics_beds * 100, 2) ELSE 0 END as c107_paediatrics_bed_occupancy,
    CASE WHEN c101_maternity_beds > 0 THEN ROUND((c104_maternity_patient_days::float / 30) / c101_maternity_beds * 100, 2) ELSE 0 END as c107_maternity_bed_occupancy,
    CASE WHEN c101_male_surgical_beds > 0 THEN ROUND((c104_male_surgical_patient_days::float / 30) / c101_male_surgical_beds * 100, 2) ELSE 0 END as c107_male_surgical_bed_occupancy,
    CASE WHEN c101_female_surgical_beds > 0 THEN ROUND((c104_female_surgical_patient_days::float / 30) / c101_female_surgical_beds * 100, 2) ELSE 0 END as c107_female_surgical_bed_occupancy
FROM reporting.v_hmis_108_census_data;

-- =======================================================
-- 3. REFERRALS DATA AGGREGATES
-- =======================================================

-- Referrals section aggregation
CREATE OR REPLACE VIEW reporting.v_hmis_108_referrals AS
SELECT 
    h."facilityId" as facility_id,
    f.facility_name,
    h."reportingPeriod"->>'year' as report_year,
    h."reportingPeriod"->>'month' as report_month,
    h."reportingPeriod"->>'year' || LPAD(h."reportingPeriod"->>'month', 2, '0') as period,
    
    -- Section 2: REFERRALS
    (h.data->>'rf01_inpatients_referred_out')::int as rf01_inpatients_referred_out,
    (h.data->>'rf02_inpatients_referred_in')::int as rf02_inpatients_referred_in,
    (h.data->>'rf03_inpatients_self_referred')::int as rf03_inpatients_self_referred,
    (h.data->>'rf04_inpatients_run_away')::int as rf04_inpatients_run_away,
    
    h."createdAt",
    h."updatedAt"
FROM "HMIS" h
JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
WHERE h.metadata->>'status' = 'approved'
    AND h."dataSetId" = 'HMIS_108_01'
ORDER BY h."reportingPeriod"->>'year' DESC, h."reportingPeriod"->>'month' DESC, f.facility_name;

-- =======================================================
-- 4. SURGICAL PROCEDURES DATA AGGREGATES
-- =======================================================

-- Surgical procedures section aggregation
CREATE OR REPLACE VIEW reporting.v_hmis_108_surgical_procedures AS
SELECT 
    h."facilityId" as facility_id,
    f.facility_name,
    h."reportingPeriod"->>'year' as report_year,
    h."reportingPeriod"->>'month' as report_month,
    h."reportingPeriod"->>'year' || LPAD(h."reportingPeriod"->>'month', 2, '0') as period,
    
    -- Section 3: SURGICAL PROCEDURES
    -- 3.1 Obstetrics
    (h.data->>'sp01_caesarean_sections')::int as sp01_caesarean_sections,
    (h.data->>'sp02_obstetric_fistula_repair')::int as sp02_obstetric_fistula_repair,
    (h.data->>'sp03_evacuations_incomplete_abortion')::int as sp03_evacuations_incomplete_abortion,
    (h.data->>'sp04_other_obstetric_surgery')::int as sp04_other_obstetric_surgery,
    
    -- 3.2 Gynaecology
    (h.data->>'gn01_laparotomy_ovarian_surgery')::int as gn01_laparotomy_ovarian_surgery,
    (h.data->>'gn02_abdominal_hysterectomy')::int as gn02_abdominal_hysterectomy,
    (h.data->>'gn03_vaginal_hysterectomy')::int as gn03_vaginal_hysterectomy,
    (h.data->>'gn04_myomectomy')::int as gn04_myomectomy,
    (h.data->>'gn05_laparotomy_ectopic_pregnancy')::int as gn05_laparotomy_ectopic_pregnancy,
    (h.data->>'gn06_other_gynaecological_surgery')::int as gn06_other_gynaecological_surgery,
    
    -- 3.3 Plastic Surgery
    (h.data->>'pr01_skin_grafting')::int as pr01_skin_grafting,
    (h.data->>'pr02_release_contractures_burns')::int as pr02_release_contractures_burns,
    (h.data->>'pr03_cleft_lip_palate_surgery')::int as pr03_cleft_lip_palate_surgery,
    (h.data->>'pr04_other_plastic_surgery')::int as pr04_other_plastic_surgery,
    
    h."createdAt",
    h."updatedAt"
FROM "HMIS" h
JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
WHERE h.metadata->>'status' = 'approved'
    AND h."dataSetId" = 'HMIS_108_01'
ORDER BY h."reportingPeriod"->>'year' DESC, h."reportingPeriod"->>'month' DESC, f.facility_name;

-- =======================================================
-- 5. COMPREHENSIVE HMIS 108 REPORT VIEW
-- =======================================================

-- Combined view with all HMIS 108 data elements
CREATE OR REPLACE VIEW reporting.v_hmis_108_complete_report AS
SELECT 
    c.*,
    r.rf01_inpatients_referred_out,
    r.rf02_inpatients_referred_in,
    r.rf03_inpatients_self_referred,
    r.rf04_inpatients_run_away,
    s.sp01_caesarean_sections,
    s.sp02_obstetric_fistula_repair,
    s.sp03_evacuations_incomplete_abortion,
    s.sp04_other_obstetric_surgery,
    s.gn01_laparotomy_ovarian_surgery,
    s.gn02_abdominal_hysterectomy,
    s.gn03_vaginal_hysterectomy,
    s.gn04_myomectomy,
    s.gn05_laparotomy_ectopic_pregnancy,
    s.gn06_other_gynaecological_surgery,
    s.pr01_skin_grafting,
    s.pr02_release_contractures_burns,
    s.pr03_cleft_lip_palate_surgery,
    s.pr04_other_plastic_surgery
FROM reporting.v_hmis_108_calculated_indicators c
LEFT JOIN reporting.v_hmis_108_referrals r ON (
    c.facility_id = r.facility_id 
    AND c.report_year = r.report_year 
    AND c.report_month = r.report_month
)
LEFT JOIN reporting.v_hmis_108_surgical_procedures s ON (
    c.facility_id = s.facility_id 
    AND c.report_year = s.report_year 
    AND c.report_month = s.report_month
);

-- =======================================================
-- 6. DHIS2 EXPORT FORMAT FOR HMIS 108
-- =======================================================

-- Export query for DHIS2 integration - transforms data into DHIS2 format
CREATE OR REPLACE VIEW reporting.v_hmis_108_dhis2_export AS
SELECT 
    facility_id as orgunit,
    period,
    data_element,
    category_option_combo,
    value,
    facility_name,
    report_year,
    report_month
FROM (
    -- Census data transformation
    SELECT facility_id, period, facility_name, report_year, report_month, 'C101_MALE_MEDICAL_BEDS' as data_element, 'default' as category_option_combo, c101_male_medical_beds as value FROM reporting.v_hmis_108_complete_report WHERE c101_male_medical_beds IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C101_FEMALE_MEDICAL_BEDS', 'default', c101_female_medical_beds FROM reporting.v_hmis_108_complete_report WHERE c101_female_medical_beds IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C101_PAEDIATRICS_BEDS', 'default', c101_paediatrics_beds FROM reporting.v_hmis_108_complete_report WHERE c101_paediatrics_beds IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C101_MATERNITY_BEDS', 'default', c101_maternity_beds FROM reporting.v_hmis_108_complete_report WHERE c101_maternity_beds IS NOT NULL
    
    -- Admissions data
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C102_MALE_MEDICAL_ADMISSIONS', 'default', c102_male_medical_admissions FROM reporting.v_hmis_108_complete_report WHERE c102_male_medical_admissions IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C102_FEMALE_MEDICAL_ADMISSIONS', 'default', c102_female_medical_admissions FROM reporting.v_hmis_108_complete_report WHERE c102_female_medical_admissions IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C102_PAEDIATRICS_ADMISSIONS', 'default', c102_paediatrics_admissions FROM reporting.v_hmis_108_complete_report WHERE c102_paediatrics_admissions IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C102_MATERNITY_ADMISSIONS', 'default', c102_maternity_admissions FROM reporting.v_hmis_108_complete_report WHERE c102_maternity_admissions IS NOT NULL
    
    -- Deaths data
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C103_MALE_MEDICAL_DEATHS', 'default', c103_male_medical_deaths FROM reporting.v_hmis_108_complete_report WHERE c103_male_medical_deaths IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C103_FEMALE_MEDICAL_DEATHS', 'default', c103_female_medical_deaths FROM reporting.v_hmis_108_complete_report WHERE c103_female_medical_deaths IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C103_PAEDIATRICS_DEATHS', 'default', c103_paediatrics_deaths FROM reporting.v_hmis_108_complete_report WHERE c103_paediatrics_deaths IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C103_MATERNITY_DEATHS', 'default', c103_maternity_deaths FROM reporting.v_hmis_108_complete_report WHERE c103_maternity_deaths IS NOT NULL
    
    -- Patient days data
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C104_MALE_MEDICAL_PATIENT_DAYS', 'default', c104_male_medical_patient_days FROM reporting.v_hmis_108_complete_report WHERE c104_male_medical_patient_days IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C104_FEMALE_MEDICAL_PATIENT_DAYS', 'default', c104_female_medical_patient_days FROM reporting.v_hmis_108_complete_report WHERE c104_female_medical_patient_days IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C104_PAEDIATRICS_PATIENT_DAYS', 'default', c104_paediatrics_patient_days FROM reporting.v_hmis_108_complete_report WHERE c104_paediatrics_patient_days IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'C104_MATERNITY_PATIENT_DAYS', 'default', c104_maternity_patient_days FROM reporting.v_hmis_108_complete_report WHERE c104_maternity_patient_days IS NOT NULL
    
    -- Referrals data
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'RF01_INPATIENTS_REFERRED_OUT', 'default', rf01_inpatients_referred_out FROM reporting.v_hmis_108_complete_report WHERE rf01_inpatients_referred_out IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'RF02_INPATIENTS_REFERRED_IN', 'default', rf02_inpatients_referred_in FROM reporting.v_hmis_108_complete_report WHERE rf02_inpatients_referred_in IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'RF03_INPATIENTS_SELF_REFERRED', 'default', rf03_inpatients_self_referred FROM reporting.v_hmis_108_complete_report WHERE rf03_inpatients_self_referred IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'RF04_INPATIENTS_RUN_AWAY', 'default', rf04_inpatients_run_away FROM reporting.v_hmis_108_complete_report WHERE rf04_inpatients_run_away IS NOT NULL
    
    -- Surgical procedures data
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'SP01_CAESAREAN_SECTIONS', 'default', sp01_caesarean_sections FROM reporting.v_hmis_108_complete_report WHERE sp01_caesarean_sections IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'SP02_OBSTETRIC_FISTULA_REPAIR', 'default', sp02_obstetric_fistula_repair FROM reporting.v_hmis_108_complete_report WHERE sp02_obstetric_fistula_repair IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'GN01_LAPAROTOMY_OVARIAN_SURGERY', 'default', gn01_laparotomy_ovarian_surgery FROM reporting.v_hmis_108_complete_report WHERE gn01_laparotomy_ovarian_surgery IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'GN02_ABDOMINAL_HYSTERECTOMY', 'default', gn02_abdominal_hysterectomy FROM reporting.v_hmis_108_complete_report WHERE gn02_abdominal_hysterectomy IS NOT NULL
    UNION ALL SELECT facility_id, period, facility_name, report_year, report_month, 'PR01_SKIN_GRAFTING', 'default', pr01_skin_grafting FROM reporting.v_hmis_108_complete_report WHERE pr01_skin_grafting IS NOT NULL
) dhis2_data
WHERE value > 0  -- Only export non-zero values
ORDER BY orgunit, period, data_element;

-- =======================================================
-- 7. ANALYTICAL QUERIES FOR HMIS 108 MONITORING
-- =======================================================

-- Ward utilization analysis
CREATE OR REPLACE VIEW reporting.v_hmis_108_ward_utilization AS
SELECT 
    facility_name,
    report_year,
    report_month,
    
    -- Medical wards analysis
    c101_male_medical_beds + c101_female_medical_beds as total_medical_beds,
    c102_male_medical_admissions + c102_female_medical_admissions as total_medical_admissions,
    c103_male_medical_deaths + c103_female_medical_deaths as total_medical_deaths,
    c104_male_medical_patient_days + c104_female_medical_patient_days as total_medical_patient_days,
    
    -- Surgical wards analysis
    c101_male_surgical_beds + c101_female_surgical_beds as total_surgical_beds,
    c102_male_surgical_admissions + c102_female_surgical_admissions as total_surgical_admissions,
    c103_male_surgical_deaths + c103_female_surgical_deaths as total_surgical_deaths,
    c104_male_surgical_patient_days + c104_female_surgical_patient_days as total_surgical_patient_days,
    
    -- Key performance indicators
    CASE 
        WHEN (c102_male_medical_admissions + c102_female_medical_admissions) > 0 
        THEN ROUND((c104_male_medical_patient_days + c104_female_medical_patient_days)::float / 
                   (c102_male_medical_admissions + c102_female_medical_admissions), 2)
        ELSE 0 
    END as medical_avg_length_of_stay,
    
    CASE 
        WHEN (c101_male_medical_beds + c101_female_medical_beds) > 0 
        THEN ROUND(((c104_male_medical_patient_days + c104_female_medical_patient_days)::float / 30) / 
                   (c101_male_medical_beds + c101_female_medical_beds) * 100, 2)
        ELSE 0 
    END as medical_bed_occupancy_rate,
    
    CASE 
        WHEN (c102_male_medical_admissions + c102_female_medical_admissions) > 0 
        THEN ROUND((c103_male_medical_deaths + c103_female_medical_deaths) * 100.0 / 
                   (c102_male_medical_admissions + c102_female_medical_admissions), 2)
        ELSE 0 
    END as medical_case_fatality_rate
    
FROM reporting.v_hmis_108_complete_report
ORDER BY report_year DESC, report_month DESC, facility_name;

-- =======================================================
-- 8. TOTALS AND SUMMARY CALCULATIONS
-- =======================================================

-- National/Regional totals for HMIS 108 indicators
CREATE OR REPLACE VIEW reporting.v_hmis_108_national_summary AS
SELECT 
    report_year,
    report_month,
    period,
    COUNT(DISTINCT facility_id) as reporting_facilities,
    
    -- Total beds by category
    SUM(c101_male_medical_beds + COALESCE(c101_female_medical_beds, 0)) as total_medical_beds,
    SUM(c101_male_surgical_beds + COALESCE(c101_female_surgical_beds, 0)) as total_surgical_beds,
    SUM(c101_paediatrics_beds) as total_paediatrics_beds,
    SUM(c101_maternity_beds) as total_maternity_beds,
    SUM(c101_icu_beds) as total_icu_beds,
    
    -- Total admissions by category
    SUM(c102_male_medical_admissions + COALESCE(c102_female_medical_admissions, 0)) as total_medical_admissions,
    SUM(c102_male_surgical_admissions + COALESCE(c102_female_surgical_admissions, 0)) as total_surgical_admissions,
    SUM(c102_paediatrics_admissions) as total_paediatrics_admissions,
    SUM(c102_maternity_admissions) as total_maternity_admissions,
    SUM(c102_icu_admissions) as total_icu_admissions,
    
    -- Total deaths by category
    SUM(c103_male_medical_deaths + COALESCE(c103_female_medical_deaths, 0)) as total_medical_deaths,
    SUM(c103_male_surgical_deaths + COALESCE(c103_female_surgical_deaths, 0)) as total_surgical_deaths,
    SUM(c103_paediatrics_deaths) as total_paediatrics_deaths,
    SUM(c103_maternity_deaths) as total_maternity_deaths,
    
    -- Total patient days
    SUM(c104_male_medical_patient_days + COALESCE(c104_female_medical_patient_days, 0)) as total_medical_patient_days,
    SUM(c104_male_surgical_patient_days + COALESCE(c104_female_surgical_patient_days, 0)) as total_surgical_patient_days,
    SUM(c104_paediatrics_patient_days) as total_paediatrics_patient_days,
    SUM(c104_maternity_patient_days) as total_maternity_patient_days,
    
    -- Referrals totals
    SUM(rf01_inpatients_referred_out) as total_referred_out,
    SUM(rf02_inpatients_referred_in) as total_referred_in,
    SUM(rf03_inpatients_self_referred) as total_self_referred,
    SUM(rf04_inpatients_run_away) as total_run_away,
    
    -- Surgical procedures totals
    SUM(sp01_caesarean_sections) as total_caesarean_sections,
    SUM(gn02_abdominal_hysterectomy) as total_hysterectomies,
    SUM(pr01_skin_grafting) as total_skin_grafting
    
FROM reporting.v_hmis_108_complete_report
GROUP BY report_year, report_month, period
ORDER BY report_year DESC, report_month DESC;

-- =======================================================
-- END OF HMIS 108 INPATIENT REPORT AGGREGATES
-- =======================================================