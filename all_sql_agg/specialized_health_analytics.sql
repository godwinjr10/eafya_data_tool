-- =======================================================
-- SPECIALIZED HEALTH ANALYTICS - EAFYA DATA TOOL
-- =======================================================
-- Advanced analytics for health program monitoring, disease surveillance,
-- and public health reporting

-- =======================================================
-- 1. DISEASE SURVEILLANCE & EPIDEMIOLOGY
-- =======================================================

-- Disease outbreak detection (unusual increases in specific diagnoses)
WITH monthly_diagnosis_trends AS (
    SELECT 
        f.facility_name,
        o.diagnosis,
        DATE_TRUNC('month', o.visit_date) as month,
        COUNT(*) as case_count,
        LAG(COUNT(*), 1) OVER (PARTITION BY f.facility_name, o.diagnosis ORDER BY DATE_TRUNC('month', o.visit_date)) as prev_month_count,
        LAG(COUNT(*), 12) OVER (PARTITION BY f.facility_name, o.diagnosis ORDER BY DATE_TRUNC('month', o.visit_date)) as same_month_prev_year
    FROM outpatient o
    JOIN facility f ON o.facility_id = f.id
    WHERE o.visit_date >= CURRENT_DATE - INTERVAL '24 months'
        AND o.diagnosis IS NOT NULL
    GROUP BY f.facility_name, o.diagnosis, DATE_TRUNC('month', o.visit_date)
)
SELECT 
    facility_name,
    diagnosis,
    TO_CHAR(month, 'YYYY-MM') as report_month,
    case_count,
    prev_month_count,
    same_month_prev_year,
    CASE 
        WHEN prev_month_count > 0 
        THEN ROUND((case_count - prev_month_count) * 100.0 / prev_month_count, 2) 
        ELSE NULL 
    END as month_over_month_change,
    CASE 
        WHEN same_month_prev_year > 0 
        THEN ROUND((case_count - same_month_prev_year) * 100.0 / same_month_prev_year, 2) 
        ELSE NULL 
    END as year_over_year_change,
    CASE 
        WHEN prev_month_count > 0 AND (case_count - prev_month_count) * 100.0 / prev_month_count > 50 
        THEN 'ALERT: Unusual Increase'
        WHEN same_month_prev_year > 0 AND (case_count - same_month_prev_year) * 100.0 / same_month_prev_year > 100 
        THEN 'WARNING: Significant YoY Increase'
        ELSE 'Normal'
    END as surveillance_status
FROM monthly_diagnosis_trends
WHERE month >= CURRENT_DATE - INTERVAL '6 months'
    AND (case_count >= 5 OR prev_month_count >= 5)  -- Only analyze diseases with sufficient cases
ORDER BY surveillance_status DESC, month DESC, case_count DESC;

-- Geographic disease distribution
SELECT 
    o.diagnosis,
    COUNT(*) as total_cases,
    COUNT(DISTINCT f.facility_name) as facilities_affected,
    STRING_AGG(DISTINCT f.facility_name, ', ' ORDER BY f.facility_name) as affected_facilities,
    ROUND(AVG(o.age)) as avg_age_affected,
    COUNT(CASE WHEN o.gender = 'Male' THEN 1 END) as male_cases,
    COUNT(CASE WHEN o.gender = 'Female' THEN 1 END) as female_cases,
    COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) as referral_cases,
    ROUND(COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) * 100.0 / COUNT(*), 2) as referral_rate
FROM outpatient o
JOIN facility f ON o.facility_id = f.id
WHERE o.visit_date >= CURRENT_DATE - INTERVAL '6 months'
    AND o.diagnosis IS NOT NULL
GROUP BY o.diagnosis
HAVING COUNT(*) >= 10  -- Focus on diseases with at least 10 cases
ORDER BY total_cases DESC;

-- =======================================================
-- 2. MATERNAL & CHILD HEALTH (MCH) ANALYTICS
-- =======================================================

-- MCH service utilization trends
WITH mch_indicators AS (
    SELECT 
        h."facilityId",
        f.facility_name,
        h."reportingPeriod"->>'year' as year,
        h."reportingPeriod"->>'month' as month,
        -- Extract MCH indicators from HMIS data
        (h.data->>'antenatal_first_visit')::int as anc_first_visits,
        (h.data->>'antenatal_4th_visit')::int as anc_fourth_visits,
        (h.data->>'skilled_delivery')::int as skilled_deliveries,
        (h.data->>'postnatal_48hrs')::int as pnc_48hrs,
        (h.data->>'family_planning_new')::int as fp_new_users,
        (h.data->>'child_immunization_complete')::int as child_immunization,
        (h.data->>'maternal_deaths')::int as maternal_deaths,
        (h.data->>'infant_deaths')::int as infant_deaths
    FROM "HMIS" h
    JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
    WHERE h.metadata->>'status' = 'approved'
        AND h.section IN (3, 4, 5)  -- MCH related sections
        AND h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
)
SELECT 
    facility_name,
    year,
    month,
    anc_first_visits,
    anc_fourth_visits,
    CASE 
        WHEN anc_first_visits > 0 
        THEN ROUND(anc_fourth_visits * 100.0 / anc_first_visits, 2) 
        ELSE NULL 
    END as anc_completion_rate,
    skilled_deliveries,
    pnc_48hrs,
    fp_new_users,
    child_immunization,
    maternal_deaths,
    infant_deaths,
    CASE 
        WHEN skilled_deliveries > 0 AND maternal_deaths > 0
        THEN ROUND(maternal_deaths * 100000.0 / skilled_deliveries, 2)
        ELSE 0
    END as maternal_mortality_ratio_per_100k
FROM mch_indicators
WHERE anc_first_visits IS NOT NULL OR skilled_deliveries IS NOT NULL
ORDER BY year DESC, month DESC, facility_name;

-- =======================================================
-- 3. IMMUNIZATION COVERAGE ANALYSIS
-- =======================================================

-- Vaccination coverage by facility and antigen
SELECT 
    f.facility_name,
    DATE_TRUNC('quarter', h."createdAt") as quarter,
    SUM((h.data->>'bcg_doses')::int) as bcg_doses,
    SUM((h.data->>'dpt_hepb_hib_1')::int) as pentavalent_1,
    SUM((h.data->>'dpt_hepb_hib_3')::int) as pentavalent_3,
    SUM((h.data->>'opv_1')::int) as opv_1,
    SUM((h.data->>'opv_3')::int) as opv_3,
    SUM((h.data->>'measles_1')::int) as measles_1,
    SUM((h.data->>'measles_2')::int) as measles_2,
    -- Coverage calculations (assuming target population)
    CASE 
        WHEN SUM((h.data->>'target_population')::int) > 0 
        THEN ROUND(SUM((h.data->>'pentavalent_3')::int) * 100.0 / SUM((h.data->>'target_population')::int), 2)
        ELSE NULL 
    END as pentavalent_3_coverage,
    CASE 
        WHEN SUM((h.data->>'pentavalent_1')::int) > 0 
        THEN ROUND(SUM((h.data->>'pentavalent_3')::int) * 100.0 / SUM((h.data->>'pentavalent_1')::int), 2)
        ELSE NULL 
    END as dropout_rate_penta_1_to_3
FROM "HMIS" h
JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
WHERE h.metadata->>'status' = 'approved'
    AND h.section = 6  -- Immunization section
    AND h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY f.facility_name, DATE_TRUNC('quarter', h."createdAt")
ORDER BY quarter DESC, facility_name;

-- =======================================================
-- 4. SUPPLY CHAIN & COMMODITY MANAGEMENT
-- =======================================================

-- Stock status and consumption patterns
WITH commodity_trends AS (
    SELECT 
        f.facility_name,
        h."reportingPeriod"->>'year' as year,
        h."reportingPeriod"->>'month' as month,
        -- Essential medicines stock levels
        (h.data->>'amoxicillin_stock')::int as amoxicillin_stock,
        (h.data->>'paracetamol_stock')::int as paracetamol_stock,
        (h.data->>'ors_stock')::int as ors_stock,
        (h.data->>'iron_tablets_stock')::int as iron_tablets_stock,
        -- Consumption
        (h.data->>'amoxicillin_consumed')::int as amoxicillin_consumed,
        (h.data->>'paracetamol_consumed')::int as paracetamol_consumed,
        -- Stock-out days
        (h.data->>'amoxicillin_stockout_days')::int as amoxicillin_stockout_days,
        (h.data->>'paracetamol_stockout_days')::int as paracetamol_stockout_days
    FROM "HMIS" h
    JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
    WHERE h.metadata->>'status' = 'approved'
        AND h.section = 8  -- Supply chain section
        AND h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
)
SELECT 
    facility_name,
    year,
    month,
    -- Stock levels
    amoxicillin_stock,
    paracetamol_stock,
    ors_stock,
    iron_tablets_stock,
    -- Consumption rates
    amoxicillin_consumed,
    paracetamol_consumed,
    -- Months of stock (MOS)
    CASE 
        WHEN amoxicillin_consumed > 0 
        THEN ROUND(amoxicillin_stock::float / amoxicillin_consumed, 1) 
        ELSE NULL 
    END as amoxicillin_mos,
    CASE 
        WHEN paracetamol_consumed > 0 
        THEN ROUND(paracetamol_stock::float / paracetamol_consumed, 1) 
        ELSE NULL 
    END as paracetamol_mos,
    -- Stock-out analysis
    amoxicillin_stockout_days,
    paracetamol_stockout_days,
    ROUND(COALESCE(amoxicillin_stockout_days, 0) * 100.0 / EXTRACT(DAY FROM DATE_TRUNC('month', MAKE_DATE((year)::int, (month)::int, 1)) + INTERVAL '1 month' - INTERVAL '1 day'), 2) as amoxicillin_stockout_rate,
    -- Stock status classification
    CASE 
        WHEN amoxicillin_stock = 0 THEN 'Stock-out'
        WHEN amoxicillin_consumed > 0 AND amoxicillin_stock::float / amoxicillin_consumed < 1 THEN 'Under-stock'
        WHEN amoxicillin_consumed > 0 AND amoxicillin_stock::float / amoxicillin_consumed > 6 THEN 'Over-stock'
        ELSE 'Adequate'
    END as amoxicillin_stock_status
FROM commodity_trends
ORDER BY year DESC, month DESC, facility_name;

-- =======================================================
-- 5. HEALTH SYSTEM PERFORMANCE INDICATORS
-- =======================================================

-- WHO Health System Building Blocks Assessment
WITH facility_performance AS (
    SELECT 
        f.facility_name,
        f.dhis2_code,
        -- Service delivery
        COUNT(DISTINCT o.patient_name) as unique_patients_served,
        COUNT(o.id) as total_consultations,
        COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) as referrals_made,
        -- Health information systems
        COUNT(DISTINCT h.id) as hmis_reports_submitted,
        AVG(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100 as data_quality_score,
        -- Access to medicines
        AVG(CASE WHEN (h.data->>'essential_medicines_available')::int > 80 THEN 1 ELSE 0 END) * 100 as medicines_availability_score
    FROM reporting.facility f
    LEFT JOIN outpatient o ON f.id = o.facility_id 
        AND o.visit_date >= CURRENT_DATE - INTERVAL '6 months'
    LEFT JOIN "HMIS" h ON f.dhis2_code = h."facilityId" 
        AND h."createdAt" >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY f.facility_name, f.dhis2_code
)
SELECT 
    facility_name,
    unique_patients_served,
    total_consultations,
    ROUND(total_consultations::float / NULLIF(unique_patients_served, 0), 2) as avg_visits_per_patient,
    referrals_made,
    ROUND(referrals_made * 100.0 / NULLIF(total_consultations, 0), 2) as referral_rate,
    hmis_reports_submitted,
    ROUND(data_quality_score, 2) as data_quality_percentage,
    ROUND(medicines_availability_score, 2) as medicines_availability_percentage,
    -- Overall performance score (weighted average)
    ROUND(
        (LEAST(total_consultations, 1000) / 10.0 * 0.3) +  -- Service volume (max 30 points)
        (data_quality_score * 0.4) +  -- Data quality (max 40 points)  
        (medicines_availability_score * 0.3),  -- Medicines availability (max 30 points)
        2
    ) as overall_performance_score,
    CASE 
        WHEN ROUND(
            (LEAST(total_consultations, 1000) / 10.0 * 0.3) +
            (data_quality_score * 0.4) +  
            (medicines_availability_score * 0.3), 2
        ) >= 80 THEN 'Excellent'
        WHEN ROUND(
            (LEAST(total_consultations, 1000) / 10.0 * 0.3) +
            (data_quality_score * 0.4) +  
            (medicines_availability_score * 0.3), 2
        ) >= 60 THEN 'Good'
        WHEN ROUND(
            (LEAST(total_consultations, 1000) / 10.0 * 0.3) +
            (data_quality_score * 0.4) +  
            (medicines_availability_score * 0.3), 2
        ) >= 40 THEN 'Fair'
        ELSE 'Needs Improvement'
    END as performance_category
FROM facility_performance
ORDER BY overall_performance_score DESC;

-- =======================================================
-- 6. PREDICTIVE ANALYTICS & FORECASTING
-- =======================================================

-- Seasonal disease pattern analysis for forecasting
WITH seasonal_patterns AS (
    SELECT 
        EXTRACT(MONTH FROM o.visit_date) as month_num,
        TO_CHAR(o.visit_date, 'Month') as month_name,
        o.diagnosis,
        COUNT(*) as case_count,
        EXTRACT(YEAR FROM o.visit_date) as year
    FROM outpatient o
    WHERE o.visit_date >= CURRENT_DATE - INTERVAL '36 months'
        AND o.diagnosis IS NOT NULL
    GROUP BY EXTRACT(MONTH FROM o.visit_date), TO_CHAR(o.visit_date, 'Month'), o.diagnosis, EXTRACT(YEAR FROM o.visit_date)
),
monthly_averages AS (
    SELECT 
        month_num,
        month_name,
        diagnosis,
        ROUND(AVG(case_count), 2) as avg_monthly_cases,
        ROUND(STDDEV(case_count), 2) as stddev_cases,
        COUNT(DISTINCT year) as years_data
    FROM seasonal_patterns
    GROUP BY month_num, month_name, diagnosis
    HAVING COUNT(DISTINCT year) >= 2  -- At least 2 years of data
)
SELECT 
    diagnosis,
    month_name,
    avg_monthly_cases,
    stddev_cases,
    years_data,
    CASE 
        WHEN avg_monthly_cases > (SELECT AVG(avg_monthly_cases) * 1.5 FROM monthly_averages ma2 WHERE ma2.diagnosis = monthly_averages.diagnosis)
        THEN 'Peak Season'
        WHEN avg_monthly_cases < (SELECT AVG(avg_monthly_cases) * 0.5 FROM monthly_averages ma2 WHERE ma2.diagnosis = monthly_averages.diagnosis)
        THEN 'Low Season'
        ELSE 'Normal Season'
    END as seasonality_classification,
    -- Forecast for next occurrence of this month
    ROUND(avg_monthly_cases + (stddev_cases * 0.1), 0) as forecasted_cases_lower,
    ROUND(avg_monthly_cases + (stddev_cases * 1.5), 0) as forecasted_cases_upper
FROM monthly_averages
WHERE avg_monthly_cases >= 5  -- Only diseases with sufficient cases
ORDER BY diagnosis, month_num;

-- =======================================================
-- 7. QUALITY IMPROVEMENT TRACKING
-- =======================================================

-- Data quality improvement tracking over time
WITH quality_metrics AS (
    SELECT 
        DATE_TRUNC('month', h."createdAt") as report_month,
        h."facilityId",
        f.facility_name,
        COUNT(*) as total_reports,
        COUNT(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 END) as approved_reports,
        COUNT(CASE WHEN h.metadata->>'status' = 'rejected' THEN 1 END) as rejected_reports,
        AVG(jsonb_array_length(h.data)) as avg_data_elements,
        COUNT(CASE WHEN jsonb_array_length(h.data) = 0 THEN 1 END) as empty_reports,
        AVG(EXTRACT(DAY FROM (h."updatedAt" - h."createdAt"))) as avg_processing_time
    FROM "HMIS" h
    JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
    WHERE h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', h."createdAt"), h."facilityId", f.facility_name
)
SELECT 
    TO_CHAR(report_month, 'YYYY-MM') as month,
    facility_name,
    total_reports,
    approved_reports,
    rejected_reports,
    ROUND(approved_reports * 100.0 / total_reports, 2) as approval_rate,
    ROUND(rejected_reports * 100.0 / total_reports, 2) as rejection_rate,
    ROUND(avg_data_elements, 1) as avg_data_elements_per_report,
    empty_reports,
    ROUND(avg_processing_time, 1) as avg_processing_days,
    -- Quality trends
    LAG(ROUND(approved_reports * 100.0 / total_reports, 2)) OVER (PARTITION BY facility_name ORDER BY report_month) as prev_month_approval_rate,
    ROUND(
        (ROUND(approved_reports * 100.0 / total_reports, 2) - 
         LAG(ROUND(approved_reports * 100.0 / total_reports, 2)) OVER (PARTITION BY facility_name ORDER BY report_month)), 
        2
    ) as approval_rate_change,
    CASE 
        WHEN ROUND(approved_reports * 100.0 / total_reports, 2) - 
             LAG(ROUND(approved_reports * 100.0 / total_reports, 2)) OVER (PARTITION BY facility_name ORDER BY report_month) > 5
        THEN 'Improving'
        WHEN ROUND(approved_reports * 100.0 / total_reports, 2) - 
             LAG(ROUND(approved_reports * 100.0 / total_reports, 2)) OVER (PARTITION BY facility_name ORDER BY report_month) < -5
        THEN 'Declining'
        ELSE 'Stable'
    END as quality_trend
FROM quality_metrics
ORDER BY report_month DESC, facility_name;

-- =======================================================
-- END OF SPECIALIZED HEALTH ANALYTICS
-- =======================================================