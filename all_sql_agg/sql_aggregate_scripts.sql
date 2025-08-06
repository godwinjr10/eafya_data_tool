-- =======================================================
-- EAFYA DATA TOOL - SQL AGGREGATE SCRIPTS
-- =======================================================
-- These scripts provide comprehensive analytics for the health management system
-- covering facility performance, patient data, mapping completeness, and DHIS2 integration

-- =======================================================
-- 1. FACILITY PERFORMANCE ANALYTICS
-- =======================================================

-- Monthly facility reporting completeness
WITH facility_reporting AS (
    SELECT 
        f.facility_name,
        f.dhis2_code,
        DATE_TRUNC('month', h."createdAt") as reporting_month,
        COUNT(DISTINCT h."dataSetId") as datasets_reported,
        COUNT(DISTINCT h.section) as sections_reported,
        COUNT(*) as total_reports,
        AVG(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END) as approval_rate
    FROM reporting.facility f
    LEFT JOIN "HMIS" h ON f.dhis2_code = h."facilityId"
    WHERE h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY f.facility_name, f.dhis2_code, DATE_TRUNC('month', h."createdAt")
)
SELECT 
    facility_name,
    dhis2_code,
    reporting_month,
    datasets_reported,
    sections_reported,
    total_reports,
    ROUND(approval_rate * 100, 2) as approval_percentage,
    CASE 
        WHEN approval_rate >= 0.9 THEN 'Excellent'
        WHEN approval_rate >= 0.7 THEN 'Good'
        WHEN approval_rate >= 0.5 THEN 'Fair'
        ELSE 'Needs Improvement'
    END as performance_category
FROM facility_reporting
ORDER BY reporting_month DESC, approval_rate DESC;

-- =======================================================
-- 2. PATIENT VISIT ANALYTICS
-- =======================================================

-- Daily, Weekly, Monthly patient visit trends
SELECT 
    f.facility_name,
    DATE_TRUNC('month', o.visit_date) as visit_month,
    COUNT(*) as total_visits,
    COUNT(DISTINCT o.patient_name) as unique_patients,
    ROUND(AVG(o.age), 1) as avg_patient_age,
    COUNT(CASE WHEN o.gender = 'Male' THEN 1 END) as male_patients,
    COUNT(CASE WHEN o.gender = 'Female' THEN 1 END) as female_patients,
    COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) as referrals,
    ROUND(COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) * 100.0 / COUNT(*), 2) as referral_rate
FROM outpatient o
JOIN facility f ON o.facility_id = f.id
WHERE o.visit_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY f.facility_name, DATE_TRUNC('month', o.visit_date)
ORDER BY visit_month DESC, total_visits DESC;

-- Top diagnoses by facility
SELECT 
    f.facility_name,
    o.diagnosis,
    COUNT(*) as diagnosis_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY f.facility_name), 2) as percentage_of_facility_cases
FROM outpatient o
JOIN facility f ON o.facility_id = f.id
WHERE o.visit_date >= CURRENT_DATE - INTERVAL '6 months'
    AND o.diagnosis IS NOT NULL
GROUP BY f.facility_name, o.diagnosis
HAVING COUNT(*) >= 5  -- Only show diagnoses with at least 5 cases
ORDER BY f.facility_name, diagnosis_count DESC;

-- =======================================================
-- 3. DATA MAPPING COMPLETENESS ANALYTICS
-- =======================================================

-- EAFYA-HMIS mapping completeness by section
SELECT 
    ds.section_name,
    ds.section_id,
    COUNT(DISTINCT ds.section_item_code) as total_hmis_items,
    COUNT(DISTINCT em.eafya_id) as mapped_eafya_items,
    ROUND(COUNT(DISTINCT em.eafya_id) * 100.0 / COUNT(DISTINCT ds.section_item_code), 2) as mapping_completeness_percentage,
    COUNT(DISTINCT ds.section_item_code) - COUNT(DISTINCT em.eafya_id) as unmapped_items
FROM reporting.dim_sections ds
LEFT JOIN reporting.eafya_hmis_mappings em ON ds.id = em.dim_id
GROUP BY ds.section_name, ds.section_id
ORDER BY mapping_completeness_percentage DESC;

-- DHIS2 mapping completeness
SELECT 
    section_name,
    section_id,
    COUNT(*) as total_conditions,
    COUNT(CASE WHEN data_element_id IS NOT NULL THEN 1 END) as mapped_to_dhis2,
    ROUND(COUNT(CASE WHEN data_element_id IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 2) as dhis2_mapping_percentage,
    COUNT(CASE WHEN category_optioncombo_id IS NOT NULL THEN 1 END) as with_category_combo
FROM reporting.dim_hmis_conditions
GROUP BY section_name, section_id
ORDER BY dhis2_mapping_percentage DESC;

-- =======================================================
-- 4. DATA QUALITY METRICS
-- =======================================================

-- HMIS data submission timeliness and quality
SELECT 
    DATE_TRUNC('month', h."createdAt") as submission_month,
    h."dataSetId",
    COUNT(*) as total_submissions,
    COUNT(CASE WHEN h.metadata->>'status' = 'draft' THEN 1 END) as draft_count,
    COUNT(CASE WHEN h.metadata->>'status' = 'submitted' THEN 1 END) as submitted_count,
    COUNT(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 END) as approved_count,
    COUNT(CASE WHEN h.metadata->>'status' = 'rejected' THEN 1 END) as rejected_count,
    AVG(EXTRACT(DAY FROM (h."updatedAt" - h."createdAt"))) as avg_processing_days,
    COUNT(DISTINCT h."facilityId") as reporting_facilities
FROM "HMIS" h
WHERE h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', h."createdAt"), h."dataSetId"
ORDER BY submission_month DESC, h."dataSetId";

-- Data completeness by reporting period and section
SELECT 
    h."reportingPeriod"->>'year' as report_year,
    h."reportingPeriod"->>'month' as report_month,
    h.section,
    COUNT(*) as reports_count,
    COUNT(DISTINCT h."facilityId") as facilities_reporting,
    AVG(jsonb_array_length(h.data)) as avg_data_elements_per_report,
    COUNT(CASE WHEN jsonb_array_length(h.data) = 0 THEN 1 END) as empty_reports
FROM "HMIS" h
WHERE h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY h."reportingPeriod"->>'year', h."reportingPeriod"->>'month', h.section
ORDER BY report_year DESC, report_month DESC, h.section;

-- =======================================================
-- 5. OPERATIONAL DASHBOARD QUERIES
-- =======================================================

-- Current month summary dashboard
WITH current_month_stats AS (
    SELECT 
        COUNT(DISTINCT o.facility_id) as active_facilities,
        COUNT(*) as total_visits,
        COUNT(DISTINCT o.patient_name) as unique_patients,
        ROUND(AVG(o.age), 1) as avg_age
    FROM outpatient o 
    WHERE DATE_TRUNC('month', o.visit_date) = DATE_TRUNC('month', CURRENT_DATE)
),
hmis_submissions AS (
    SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN metadata->>'status' = 'approved' THEN 1 END) as approved_submissions,
        COUNT(DISTINCT "facilityId") as reporting_facilities
    FROM "HMIS" 
    WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
    'Current Month Summary' as report_type,
    cms.active_facilities,
    cms.total_visits,
    cms.unique_patients,
    cms.avg_age,
    hs.total_submissions as hmis_submissions,
    hs.approved_submissions,
    hs.reporting_facilities as hmis_reporting_facilities,
    ROUND(hs.approved_submissions * 100.0 / NULLIF(hs.total_submissions, 0), 2) as approval_rate
FROM current_month_stats cms, hmis_submissions hs;

-- Facility performance ranking
SELECT 
    ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank,
    facility_name,
    dhis2_code,
    total_visits,
    unique_patients,
    hmis_reports,
    approval_rate,
    mapping_completeness,
    ROUND((visit_score + report_score + mapping_score) / 3, 2) as total_score
FROM (
    SELECT 
        f.facility_name,
        f.dhis2_code,
        COALESCE(visit_stats.total_visits, 0) as total_visits,
        COALESCE(visit_stats.unique_patients, 0) as unique_patients,
        COALESCE(hmis_stats.hmis_reports, 0) as hmis_reports,
        COALESCE(hmis_stats.approval_rate, 0) as approval_rate,
        COALESCE(mapping_stats.mapping_completeness, 0) as mapping_completeness,
        -- Scoring (normalized to 0-100)
        COALESCE(PERCENT_RANK() OVER (ORDER BY visit_stats.total_visits) * 100, 0) as visit_score,
        COALESCE(hmis_stats.approval_rate * 100, 0) as report_score,
        COALESCE(mapping_stats.mapping_completeness, 0) as mapping_score
    FROM reporting.facility f
    LEFT JOIN (
        SELECT 
            facility_id,
            COUNT(*) as total_visits,
            COUNT(DISTINCT patient_name) as unique_patients
        FROM outpatient 
        WHERE visit_date >= CURRENT_DATE - INTERVAL '3 months'
        GROUP BY facility_id
    ) visit_stats ON f.id = visit_stats.facility_id
    LEFT JOIN (
        SELECT 
            "facilityId",
            COUNT(*) as hmis_reports,
            AVG(CASE WHEN metadata->>'status' = 'approved' THEN 1 ELSE 0 END) as approval_rate
        FROM "HMIS" 
        WHERE "createdAt" >= CURRENT_DATE - INTERVAL '3 months'
        GROUP BY "facilityId"
    ) hmis_stats ON f.dhis2_code = hmis_stats."facilityId"
    LEFT JOIN (
        SELECT 
            f2.id as facility_id,
            AVG(CASE WHEN em.eafya_id IS NOT NULL THEN 100 ELSE 0 END) as mapping_completeness
        FROM reporting.facility f2
        CROSS JOIN reporting.dim_sections ds
        LEFT JOIN reporting.eafya_hmis_mappings em ON ds.id = em.dim_id
        GROUP BY f2.id
    ) mapping_stats ON f.id = mapping_stats.facility_id
) scored_facilities
ORDER BY total_score DESC;

-- =======================================================
-- 6. TREND ANALYSIS QUERIES
-- =======================================================

-- Monthly trends for key indicators
SELECT 
    TO_CHAR(month_date, 'YYYY-MM') as month,
    visits.total_visits,
    visits.unique_patients,
    hmis.total_reports,
    hmis.approval_rate,
    LAG(visits.total_visits) OVER (ORDER BY month_date) as prev_month_visits,
    CASE 
        WHEN LAG(visits.total_visits) OVER (ORDER BY month_date) IS NOT NULL 
        THEN ROUND((visits.total_visits - LAG(visits.total_visits) OVER (ORDER BY month_date)) * 100.0 / 
                   LAG(visits.total_visits) OVER (ORDER BY month_date), 2)
        ELSE NULL 
    END as visit_growth_rate
FROM (
    SELECT DATE_TRUNC('month', generate_series(
        CURRENT_DATE - INTERVAL '12 months', 
        CURRENT_DATE, 
        '1 month'::interval
    )) as month_date
) months
LEFT JOIN (
    SELECT 
        DATE_TRUNC('month', visit_date) as visit_month,
        COUNT(*) as total_visits,
        COUNT(DISTINCT patient_name) as unique_patients
    FROM outpatient 
    GROUP BY DATE_TRUNC('month', visit_date)
) visits ON months.month_date = visits.visit_month
LEFT JOIN (
    SELECT 
        DATE_TRUNC('month', "createdAt") as report_month,
        COUNT(*) as total_reports,
        ROUND(AVG(CASE WHEN metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100, 2) as approval_rate
    FROM "HMIS" 
    GROUP BY DATE_TRUNC('month', "createdAt")
) hmis ON months.month_date = hmis.report_month
ORDER BY month_date;

-- =======================================================
-- 7. DATA EXPORT QUERIES FOR DHIS2 INTEGRATION
-- =======================================================

-- Ready-to-export data for DHIS2 (approved HMIS data with complete mappings)
SELECT 
    h."facilityId" as orgunit,
    h."reportingPeriod"->>'year' || LPAD(h."reportingPeriod"->>'month', 2, '0') as period,
    dem.data_element_id as dataelement,
    dem.category_optioncombo_id as categoryoptioncombo,
    (h.data->>fem.eafya_id)::numeric as value,
    h."updatedAt" as last_updated
FROM "HMIS" h
JOIN reporting.fact_hmis_eafya_mapping fem ON fem.is_active = true
JOIN reporting.dim_hmis_conditions dem ON fem.dim_condition_id = dem.id
WHERE h.metadata->>'status' = 'approved'
    AND h.data ? fem.eafya_id
    AND dem.data_element_id IS NOT NULL
    AND dem.category_optioncombo_id IS NOT NULL
    AND (h.data->>fem.eafya_id)::numeric > 0
ORDER BY h."facilityId", period, dataelement;

-- Summary of data ready for DHIS2 export by facility and period
SELECT 
    f.facility_name,
    h."facilityId",
    h."reportingPeriod"->>'year' as year,
    h."reportingPeriod"->>'month' as month,
    COUNT(DISTINCT dem.data_element_id) as data_elements_ready,
    COUNT(*) as total_data_values,
    SUM((h.data->>fem.eafya_id)::numeric) as total_value_sum
FROM "HMIS" h
JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
JOIN reporting.fact_hmis_eafya_mapping fem ON fem.is_active = true
JOIN reporting.dim_hmis_conditions dem ON fem.dim_condition_id = dem.id
WHERE h.metadata->>'status' = 'approved'
    AND h.data ? fem.eafya_id
    AND dem.data_element_id IS NOT NULL
    AND (h.data->>fem.eafya_id)::numeric >= 0
GROUP BY f.facility_name, h."facilityId", h."reportingPeriod"->>'year', h."reportingPeriod"->>'month'
ORDER BY year DESC, month DESC, facility_name;

-- =======================================================
-- END OF AGGREGATE SCRIPTS
-- =======================================================