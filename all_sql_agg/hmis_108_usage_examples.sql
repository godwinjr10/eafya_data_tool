-- =======================================================
-- HMIS 108 INPATIENT REPORT - USAGE EXAMPLES & PRACTICAL QUERIES
-- =======================================================
-- This file contains practical examples of how to use the HMIS 108 aggregate scripts
-- for common reporting and analysis scenarios

-- =======================================================
-- 1. BASIC FACILITY REPORT QUERIES
-- =======================================================

-- Get complete HMIS 108 report for a specific facility and month
SELECT * 
FROM reporting.v_hmis_108_complete_report 
WHERE facility_name = 'Mulago National Referral Hospital'
    AND report_year = '2024' 
    AND report_month = '12';

-- Get current month data for all facilities
SELECT 
    facility_name,
    c101_male_medical_beds + c101_female_medical_beds as total_medical_beds,
    c102_male_medical_admissions + c102_female_medical_admissions as total_admissions,
    c103_male_medical_deaths + c103_female_medical_deaths as total_deaths,
    rf01_inpatients_referred_out,
    sp01_caesarean_sections
FROM reporting.v_hmis_108_complete_report 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT;

-- =======================================================
-- 2. WARD UTILIZATION ANALYSIS
-- =======================================================

-- Ward bed occupancy rates for current month
SELECT 
    facility_name,
    -- Medical ward occupancy
    CASE 
        WHEN (c101_male_medical_beds + c101_female_medical_beds) > 0 
        THEN ROUND(((c104_male_medical_patient_days + c104_female_medical_patient_days)::float / 30) / 
                   (c101_male_medical_beds + c101_female_medical_beds) * 100, 2)
        ELSE 0 
    END as medical_ward_occupancy_percent,
    
    -- Surgical ward occupancy
    CASE 
        WHEN (c101_male_surgical_beds + c101_female_surgical_beds) > 0 
        THEN ROUND(((c104_male_surgical_patient_days + c104_female_surgical_patient_days)::float / 30) / 
                   (c101_male_surgical_beds + c101_female_surgical_beds) * 100, 2)
        ELSE 0 
    END as surgical_ward_occupancy_percent,
    
    -- Maternity ward occupancy
    CASE 
        WHEN c101_maternity_beds > 0 
        THEN ROUND((c104_maternity_patient_days::float / 30) / c101_maternity_beds * 100, 2)
        ELSE 0 
    END as maternity_ward_occupancy_percent,
    
    -- ICU occupancy
    CASE 
        WHEN c101_icu_beds > 0 
        THEN ROUND((c104_icu_patient_days::float / 30) / c101_icu_beds * 100, 2)
        ELSE 0 
    END as icu_occupancy_percent

FROM reporting.v_hmis_108_complete_report 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
ORDER BY medical_ward_occupancy_percent DESC;

-- Facilities with over-capacity (>100% occupancy)
SELECT 
    facility_name,
    medical_bed_occupancy_rate,
    total_medical_beds,
    total_medical_admissions,
    total_medical_patient_days
FROM reporting.v_hmis_108_ward_utilization
WHERE medical_bed_occupancy_rate > 100
    AND report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
ORDER BY medical_bed_occupancy_rate DESC;

-- =======================================================
-- 3. MATERNAL HEALTH ANALYSIS
-- =======================================================

-- Caesarean section rates by facility
SELECT 
    facility_name,
    c102_maternity_admissions as total_deliveries,
    sp01_caesarean_sections,
    CASE 
        WHEN c102_maternity_admissions > 0 
        THEN ROUND(sp01_caesarean_sections * 100.0 / c102_maternity_admissions, 2)
        ELSE 0 
    END as caesarean_rate_percent,
    c103_maternity_deaths as maternal_deaths,
    CASE 
        WHEN c102_maternity_admissions > 0 
        THEN ROUND(c103_maternity_deaths * 100000.0 / c102_maternity_admissions, 2)
        ELSE 0 
    END as maternal_mortality_ratio_per_100k
FROM reporting.v_hmis_108_complete_report 
WHERE c102_maternity_admissions > 0
    AND report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
ORDER BY caesarean_rate_percent DESC;

-- Facilities with high caesarean rates (>15% WHO recommended threshold)
SELECT 
    facility_name,
    sp01_caesarean_sections,
    c102_maternity_admissions,
    ROUND(sp01_caesarean_sections * 100.0 / c102_maternity_admissions, 2) as caesarean_rate,
    'High C-Section Rate' as alert_type
FROM reporting.v_hmis_108_complete_report 
WHERE c102_maternity_admissions > 0
    AND (sp01_caesarean_sections * 100.0 / c102_maternity_admissions) > 15
    AND report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT;

-- =======================================================
-- 4. REFERRAL SYSTEM ANALYSIS
-- =======================================================

-- Referral patterns analysis
SELECT 
    facility_name,
    rf01_inpatients_referred_out as referred_out,
    rf02_inpatients_referred_in as referred_in,
    rf03_inpatients_self_referred as self_referred,
    rf04_inpatients_run_away as run_away,
    (c102_male_medical_admissions + c102_female_medical_admissions + 
     c102_paediatrics_admissions + c102_maternity_admissions) as total_admissions,
    CASE 
        WHEN (c102_male_medical_admissions + c102_female_medical_admissions + 
              c102_paediatrics_admissions + c102_maternity_admissions) > 0 
        THEN ROUND(rf01_inpatients_referred_out * 100.0 / 
                   (c102_male_medical_admissions + c102_female_medical_admissions + 
                    c102_paediatrics_admissions + c102_maternity_admissions), 2)
        ELSE 0 
    END as referral_out_rate
FROM reporting.v_hmis_108_complete_report 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
ORDER BY referral_out_rate DESC;

-- =======================================================
-- 5. QUALITY INDICATORS
-- =======================================================

-- Case fatality rates by ward type
SELECT 
    facility_name,
    -- Medical ward CFR
    CASE 
        WHEN (c102_male_medical_admissions + c102_female_medical_admissions) > 0 
        THEN ROUND((c103_male_medical_deaths + c103_female_medical_deaths) * 100.0 / 
                   (c102_male_medical_admissions + c102_female_medical_admissions), 2)
        ELSE 0 
    END as medical_cfr_percent,
    
    -- Surgical ward CFR
    CASE 
        WHEN (c102_male_surgical_admissions + c102_female_surgical_admissions) > 0 
        THEN ROUND((c103_male_surgical_deaths + c103_female_surgical_deaths) * 100.0 / 
                   (c102_male_surgical_admissions + c102_female_surgical_admissions), 2)
        ELSE 0 
    END as surgical_cfr_percent,
    
    -- Paediatric CFR
    CASE 
        WHEN c102_paediatrics_admissions > 0 
        THEN ROUND(c103_paediatrics_deaths * 100.0 / c102_paediatrics_admissions, 2)
        ELSE 0 
    END as paediatric_cfr_percent,
    
    -- Maternity CFR (Maternal Mortality)
    CASE 
        WHEN c102_maternity_admissions > 0 
        THEN ROUND(c103_maternity_deaths * 100.0 / c102_maternity_admissions, 2)
        ELSE 0 
    END as maternal_cfr_percent

FROM reporting.v_hmis_108_complete_report 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT;

-- Facilities with high case fatality rates (potential quality issues)
SELECT 
    facility_name,
    'High Medical CFR' as quality_concern,
    (c103_male_medical_deaths + c103_female_medical_deaths) as deaths,
    (c102_male_medical_admissions + c102_female_medical_admissions) as admissions,
    ROUND((c103_male_medical_deaths + c103_female_medical_deaths) * 100.0 / 
          (c102_male_medical_admissions + c102_female_medical_admissions), 2) as cfr_percent
FROM reporting.v_hmis_108_complete_report 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
    AND (c102_male_medical_admissions + c102_female_medical_admissions) > 0
    AND ((c103_male_medical_deaths + c103_female_medical_deaths) * 100.0 / 
         (c102_male_medical_admissions + c102_female_medical_admissions)) > 5  -- Alert if CFR > 5%
ORDER BY cfr_percent DESC;

-- =======================================================
-- 6. TREND ANALYSIS (MONTHLY COMPARISONS)
-- =======================================================

-- Month-over-month trends for key indicators
WITH monthly_trends AS (
    SELECT 
        facility_name,
        report_year,
        report_month,
        period,
        (c102_male_medical_admissions + c102_female_medical_admissions + 
         c102_paediatrics_admissions + c102_maternity_admissions) as total_admissions,
        sp01_caesarean_sections,
        rf01_inpatients_referred_out,
        LAG((c102_male_medical_admissions + c102_female_medical_admissions + 
             c102_paediatrics_admissions + c102_maternity_admissions)) 
            OVER (PARTITION BY facility_name ORDER BY report_year, report_month) as prev_month_admissions
    FROM reporting.v_hmis_108_complete_report 
    WHERE report_year::int >= EXTRACT(YEAR FROM CURRENT_DATE) - 1  -- Last 12+ months
)
SELECT 
    facility_name,
    report_year,
    report_month,
    total_admissions,
    prev_month_admissions,
    CASE 
        WHEN prev_month_admissions > 0 
        THEN ROUND((total_admissions - prev_month_admissions) * 100.0 / prev_month_admissions, 2)
        ELSE NULL 
    END as admissions_growth_percent,
    sp01_caesarean_sections,
    rf01_inpatients_referred_out
FROM monthly_trends
WHERE prev_month_admissions IS NOT NULL
ORDER BY facility_name, report_year DESC, report_month DESC;

-- =======================================================
-- 7. DHIS2 EXPORT QUERIES
-- =======================================================

-- Export specific facility data for DHIS2 (current month)
SELECT 
    orgunit,
    period,
    data_element,
    category_option_combo,
    value
FROM reporting.v_hmis_108_dhis2_export 
WHERE orgunit = 'FACILITY_CODE_HERE'  -- Replace with actual facility code
    AND period = TO_CHAR(CURRENT_DATE, 'YYYYMM')
    AND value IS NOT NULL
ORDER BY data_element;

-- Export all facilities data for DHIS2 (specific month)
SELECT 
    orgunit,
    period,
    data_element,
    category_option_combo,
    value
FROM reporting.v_hmis_108_dhis2_export 
WHERE period = '202412'  -- December 2024
    AND value > 0
ORDER BY orgunit, data_element;

-- Summary of data ready for DHIS2 export
SELECT 
    report_year,
    report_month,
    COUNT(DISTINCT facility_id) as facilities_with_data,
    COUNT(*) as total_data_values,
    COUNT(DISTINCT CASE WHEN value > 0 THEN facility_id END) as facilities_with_non_zero_data
FROM reporting.v_hmis_108_dhis2_export 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
GROUP BY report_year, report_month;

-- =======================================================
-- 8. DATA QUALITY CHECKS
-- =======================================================

-- Check for logical inconsistencies in HMIS 108 data
SELECT 
    facility_name,
    report_year,
    report_month,
    issue_type,
    description
FROM (
    -- Deaths cannot exceed admissions
    SELECT 
        facility_name, report_year, report_month,
        'Data Quality Issue' as issue_type,
        'Medical deaths (' || (c103_male_medical_deaths + c103_female_medical_deaths) || 
        ') exceed admissions (' || (c102_male_medical_admissions + c102_female_medical_admissions) || ')' as description
    FROM reporting.v_hmis_108_complete_report 
    WHERE (c103_male_medical_deaths + c103_female_medical_deaths) > 
          (c102_male_medical_admissions + c102_female_medical_admissions)
    
    UNION ALL
    
    -- Bed occupancy cannot exceed 300% (allowing for some over-capacity)
    SELECT 
        facility_name, report_year, report_month,
        'Data Quality Issue' as issue_type,
        'Unrealistic bed occupancy rate: ' || medical_bed_occupancy_rate || '%' as description
    FROM reporting.v_hmis_108_ward_utilization 
    WHERE medical_bed_occupancy_rate > 300
    
    UNION ALL
    
    -- Caesarean sections cannot exceed maternity admissions
    SELECT 
        facility_name, report_year, report_month,
        'Data Quality Issue' as issue_type,
        'Caesarean sections (' || sp01_caesarean_sections || 
        ') exceed maternity admissions (' || c102_maternity_admissions || ')' as description
    FROM reporting.v_hmis_108_complete_report 
    WHERE sp01_caesarean_sections > c102_maternity_admissions
        AND c102_maternity_admissions > 0
) quality_issues
ORDER BY facility_name, report_year DESC, report_month DESC;

-- Missing critical data elements
SELECT 
    facility_name,
    report_year,
    report_month,
    CASE 
        WHEN c101_male_medical_beds IS NULL AND c101_female_medical_beds IS NULL THEN 'Missing bed data'
        WHEN c102_male_medical_admissions IS NULL AND c102_female_medical_admissions IS NULL THEN 'Missing admission data'
        WHEN c104_male_medical_patient_days IS NULL AND c104_female_medical_patient_days IS NULL THEN 'Missing patient days data'
        ELSE 'Unknown issue'
    END as missing_data_type
FROM reporting.v_hmis_108_complete_report 
WHERE (c101_male_medical_beds IS NULL AND c101_female_medical_beds IS NULL)
    OR (c102_male_medical_admissions IS NULL AND c102_female_medical_admissions IS NULL)
    OR (c104_male_medical_patient_days IS NULL AND c104_female_medical_patient_days IS NULL);

-- =======================================================
-- 9. NATIONAL/REGIONAL SUMMARIES
-- =======================================================

-- National summary for current month
SELECT 
    'National Total' as level,
    report_year,
    report_month,
    reporting_facilities,
    total_medical_beds,
    total_surgical_beds,
    total_medical_admissions,
    total_surgical_admissions,
    total_medical_deaths,
    total_caesarean_sections,
    CASE 
        WHEN total_medical_admissions > 0 
        THEN ROUND(total_medical_deaths * 100.0 / total_medical_admissions, 2)
        ELSE 0 
    END as national_medical_cfr
FROM reporting.v_hmis_108_national_summary 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT;

-- =======================================================
-- 10. PERFORMANCE BENCHMARKING
-- =======================================================

-- Facility rankings by bed occupancy efficiency
SELECT 
    ROW_NUMBER() OVER (ORDER BY medical_bed_occupancy_rate DESC) as rank,
    facility_name,
    medical_bed_occupancy_rate,
    total_medical_beds,
    total_medical_admissions,
    medical_case_fatality_rate,
    CASE 
        WHEN medical_bed_occupancy_rate BETWEEN 75 AND 95 THEN 'Optimal'
        WHEN medical_bed_occupancy_rate BETWEEN 60 AND 74 THEN 'Good'
        WHEN medical_bed_occupancy_rate < 60 THEN 'Under-utilized'
        WHEN medical_bed_occupancy_rate > 95 THEN 'Over-capacity'
        ELSE 'No data'
    END as utilization_status
FROM reporting.v_hmis_108_ward_utilization 
WHERE report_year = EXTRACT(YEAR FROM CURRENT_DATE)::TEXT
    AND report_month = EXTRACT(MONTH FROM CURRENT_DATE)::TEXT
    AND total_medical_beds > 0
ORDER BY medical_bed_occupancy_rate DESC;

-- =======================================================
-- END OF HMIS 108 USAGE EXAMPLES
-- =======================================================

-- Note: Replace placeholder values like 'FACILITY_CODE_HERE' with actual facility codes
-- Adjust date filters as needed for your specific reporting requirements