-- =======================================================
-- UTILITY VIEWS AND FUNCTIONS - EAFYA DATA TOOL
-- =======================================================
-- Helper views, materialized views, and functions to simplify
-- common queries and improve performance

-- =======================================================
-- 1. MATERIALIZED VIEWS FOR PERFORMANCE
-- =======================================================

-- Materialized view for facility summary statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS reporting.mv_facility_summary AS
SELECT 
    f.id,
    f.facility_name,
    f.dhis2_code,
    f."createdAt" as facility_created,
    -- Patient visit statistics
    COALESCE(vs.total_visits_last_12m, 0) as total_visits_last_12m,
    COALESCE(vs.unique_patients_last_12m, 0) as unique_patients_last_12m,
    COALESCE(vs.avg_monthly_visits, 0) as avg_monthly_visits,
    -- HMIS reporting statistics
    COALESCE(hs.total_reports_last_12m, 0) as total_reports_last_12m,
    COALESCE(hs.approval_rate, 0) as hmis_approval_rate,
    COALESCE(hs.avg_processing_days, 0) as avg_processing_days,
    -- Last activity dates
    vs.last_patient_visit,
    hs.last_hmis_report,
    -- Performance indicators
    CASE 
        WHEN vs.last_patient_visit >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
        WHEN vs.last_patient_visit >= CURRENT_DATE - INTERVAL '90 days' THEN 'Low Activity'
        ELSE 'Inactive'
    END as activity_status,
    CURRENT_TIMESTAMP as last_refreshed
FROM reporting.facility f
LEFT JOIN (
    -- Visit statistics subquery
    SELECT 
        o.facility_id,
        COUNT(*) as total_visits_last_12m,
        COUNT(DISTINCT o.patient_name) as unique_patients_last_12m,
        ROUND(COUNT(*) / 12.0, 1) as avg_monthly_visits,
        MAX(o.visit_date) as last_patient_visit
    FROM outpatient o
    WHERE o.visit_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY o.facility_id
) vs ON f.id = vs.facility_id
LEFT JOIN (
    -- HMIS statistics subquery
    SELECT 
        h."facilityId",
        COUNT(*) as total_reports_last_12m,
        ROUND(AVG(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100, 2) as approval_rate,
        ROUND(AVG(EXTRACT(DAY FROM (h."updatedAt" - h."createdAt"))), 1) as avg_processing_days,
        MAX(h."createdAt") as last_hmis_report
    FROM "HMIS" h
    WHERE h."createdAt" >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY h."facilityId"
) hs ON f.dhis2_code = hs."facilityId";

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_facility_summary_id ON reporting.mv_facility_summary(id);
CREATE INDEX IF NOT EXISTS idx_mv_facility_summary_activity ON reporting.mv_facility_summary(activity_status);

-- Materialized view for monthly health indicators
CREATE MATERIALIZED VIEW IF NOT EXISTS reporting.mv_monthly_indicators AS
SELECT 
    DATE_TRUNC('month', period_date) as report_month,
    facility_id,
    facility_name,
    -- Visit indicators
    total_visits,
    unique_patients,
    avg_age,
    male_patients,
    female_patients,
    referrals,
    -- HMIS indicators  
    hmis_reports_submitted,
    hmis_reports_approved,
    approval_rate,
    -- Key ratios
    ROUND(total_visits::float / NULLIF(unique_patients, 0), 2) as visits_per_patient,
    ROUND(referrals * 100.0 / NULLIF(total_visits, 0), 2) as referral_rate,
    CURRENT_TIMESTAMP as last_refreshed
FROM (
    SELECT 
        generate_series(
            DATE_TRUNC('month', CURRENT_DATE - INTERVAL '24 months'),
            DATE_TRUNC('month', CURRENT_DATE),
            '1 month'::interval
        ) as period_date
) months
CROSS JOIN reporting.facility f
LEFT JOIN (
    SELECT 
        DATE_TRUNC('month', o.visit_date) as visit_month,
        o.facility_id,
        COUNT(*) as total_visits,
        COUNT(DISTINCT o.patient_name) as unique_patients,
        ROUND(AVG(o.age), 1) as avg_age,
        COUNT(CASE WHEN o.gender = 'Male' THEN 1 END) as male_patients,
        COUNT(CASE WHEN o.gender = 'Female' THEN 1 END) as female_patients,
        COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) as referrals
    FROM outpatient o
    GROUP BY DATE_TRUNC('month', o.visit_date), o.facility_id
) visits ON months.period_date = visits.visit_month AND f.id = visits.facility_id
LEFT JOIN (
    SELECT 
        DATE_TRUNC('month', h."createdAt") as report_month,
        h."facilityId",
        COUNT(*) as hmis_reports_submitted,
        COUNT(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 END) as hmis_reports_approved,
        ROUND(AVG(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100, 2) as approval_rate
    FROM "HMIS" h
    GROUP BY DATE_TRUNC('month', h."createdAt"), h."facilityId"
) hmis ON months.period_date = hmis.report_month AND f.dhis2_code = hmis."facilityId"
WHERE months.period_date >= CURRENT_DATE - INTERVAL '24 months';

-- Create indexes on monthly indicators materialized view
CREATE INDEX IF NOT EXISTS idx_mv_monthly_indicators_month ON reporting.mv_monthly_indicators(report_month);
CREATE INDEX IF NOT EXISTS idx_mv_monthly_indicators_facility ON reporting.mv_monthly_indicators(facility_id);

-- =======================================================
-- 2. CONVENIENT VIEWS FOR COMMON QUERIES
-- =======================================================

-- View for current month dashboard data
CREATE OR REPLACE VIEW reporting.v_current_month_dashboard AS
SELECT 
    'Current Month Summary' as report_type,
    CURRENT_DATE as as_of_date,
    COUNT(DISTINCT f.id) as total_facilities,
    COUNT(DISTINCT CASE WHEN o.visit_date >= DATE_TRUNC('month', CURRENT_DATE) THEN f.id END) as active_facilities_this_month,
    COALESCE(SUM(CASE WHEN o.visit_date >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 ELSE 0 END), 0) as visits_this_month,
    COALESCE(COUNT(DISTINCT CASE WHEN o.visit_date >= DATE_TRUNC('month', CURRENT_DATE) THEN o.patient_name END), 0) as unique_patients_this_month,
    COALESCE(SUM(CASE WHEN h."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 ELSE 0 END), 0) as hmis_reports_this_month,
    COALESCE(SUM(CASE WHEN h."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) AND h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END), 0) as approved_reports_this_month,
    CASE 
        WHEN SUM(CASE WHEN h."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 ELSE 0 END) > 0
        THEN ROUND(SUM(CASE WHEN h."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) AND h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100.0 / 
                   SUM(CASE WHEN h."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 ELSE 0 END), 2)
        ELSE 0
    END as approval_rate_this_month
FROM reporting.facility f
LEFT JOIN outpatient o ON f.id = o.facility_id AND o.visit_date >= CURRENT_DATE - INTERVAL '1 month'
LEFT JOIN "HMIS" h ON f.dhis2_code = h."facilityId" AND h."createdAt" >= CURRENT_DATE - INTERVAL '1 month';

-- View for facility rankings
CREATE OR REPLACE VIEW reporting.v_facility_rankings AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY total_score DESC) as overall_rank,
    facility_name,
    dhis2_code,
    total_visits_last_3m,
    unique_patients_last_3m,
    hmis_reports_last_3m,
    approval_rate,
    ROUND(visit_score, 1) as visit_performance_score,
    ROUND(report_score, 1) as reporting_performance_score,
    ROUND(total_score, 1) as total_performance_score,
    CASE 
        WHEN total_score >= 80 THEN 'Excellent'
        WHEN total_score >= 60 THEN 'Good'
        WHEN total_score >= 40 THEN 'Fair'
        ELSE 'Needs Improvement'
    END as performance_category
FROM (
    SELECT 
        f.facility_name,
        f.dhis2_code,
        COALESCE(visits.total_visits, 0) as total_visits_last_3m,
        COALESCE(visits.unique_patients, 0) as unique_patients_last_3m,
        COALESCE(hmis.total_reports, 0) as hmis_reports_last_3m,
        COALESCE(hmis.approval_rate, 0) as approval_rate,
        -- Normalized scores (0-100)
        COALESCE(PERCENT_RANK() OVER (ORDER BY visits.total_visits) * 100, 0) as visit_score,
        COALESCE(hmis.approval_rate, 0) as report_score,
        -- Weighted total score
        (COALESCE(PERCENT_RANK() OVER (ORDER BY visits.total_visits) * 100, 0) * 0.6) + 
        (COALESCE(hmis.approval_rate, 0) * 0.4) as total_score
    FROM reporting.facility f
    LEFT JOIN (
        SELECT 
            facility_id,
            COUNT(*) as total_visits,
            COUNT(DISTINCT patient_name) as unique_patients
        FROM outpatient 
        WHERE visit_date >= CURRENT_DATE - INTERVAL '3 months'
        GROUP BY facility_id
    ) visits ON f.id = visits.facility_id
    LEFT JOIN (
        SELECT 
            "facilityId",
            COUNT(*) as total_reports,
            ROUND(AVG(CASE WHEN metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100, 2) as approval_rate
        FROM "HMIS" 
        WHERE "createdAt" >= CURRENT_DATE - INTERVAL '3 months'
        GROUP BY "facilityId"
    ) hmis ON f.dhis2_code = hmis."facilityId"
) ranked_facilities;

-- View for mapping completeness summary
CREATE OR REPLACE VIEW reporting.v_mapping_completeness AS
SELECT 
    'Overall System' as scope,
    COUNT(DISTINCT ds.id) as total_hmis_items,
    COUNT(DISTINCT em.eafya_id) as mapped_eafya_items,
    COUNT(DISTINCT dem.id) as total_conditions,
    COUNT(DISTINCT CASE WHEN dem.data_element_id IS NOT NULL THEN dem.id END) as dhis2_mapped_conditions,
    ROUND(COUNT(DISTINCT em.eafya_id) * 100.0 / COUNT(DISTINCT ds.id), 2) as eafya_mapping_percentage,
    ROUND(COUNT(DISTINCT CASE WHEN dem.data_element_id IS NOT NULL THEN dem.id END) * 100.0 / COUNT(DISTINCT dem.id), 2) as dhis2_mapping_percentage
FROM reporting.dim_sections ds
LEFT JOIN reporting.eafya_hmis_mappings em ON ds.id = em.dim_id
LEFT JOIN reporting.dim_hmis_conditions dem ON TRUE

UNION ALL

SELECT 
    'By Section: ' || ds.section_name as scope,
    COUNT(DISTINCT ds.id) as total_hmis_items,
    COUNT(DISTINCT em.eafya_id) as mapped_eafya_items,
    0 as total_conditions,
    0 as dhis2_mapped_conditions,
    ROUND(COUNT(DISTINCT em.eafya_id) * 100.0 / COUNT(DISTINCT ds.id), 2) as eafya_mapping_percentage,
    0 as dhis2_mapping_percentage
FROM reporting.dim_sections ds
LEFT JOIN reporting.eafya_hmis_mappings em ON ds.id = em.dim_id
GROUP BY ds.section_name, ds.section_id
ORDER BY scope;

-- =======================================================
-- 3. UTILITY FUNCTIONS
-- =======================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION reporting.refresh_all_materialized_views()
RETURNS TEXT AS $$
BEGIN
    REFRESH MATERIALIZED VIEW reporting.mv_facility_summary;
    REFRESH MATERIALIZED VIEW reporting.mv_monthly_indicators;
    
    RETURN 'All materialized views refreshed at ' || CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to get facility performance summary
CREATE OR REPLACE FUNCTION reporting.get_facility_performance(
    facility_dhis2_code TEXT,
    months_back INTEGER DEFAULT 6
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value NUMERIC,
    metric_unit TEXT,
    performance_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH facility_metrics AS (
        SELECT 
            f.facility_name,
            COUNT(DISTINCT o.id) as total_visits,
            COUNT(DISTINCT o.patient_name) as unique_patients,
            COUNT(DISTINCT h.id) as hmis_reports,
            AVG(CASE WHEN h.metadata->>'status' = 'approved' THEN 1 ELSE 0 END) * 100 as approval_rate,
            COUNT(CASE WHEN o.referral_status = 'Referred' THEN 1 END) * 100.0 / NULLIF(COUNT(o.id), 0) as referral_rate
        FROM reporting.facility f
        LEFT JOIN outpatient o ON f.id = o.facility_id 
            AND o.visit_date >= CURRENT_DATE - (months_back || ' months')::INTERVAL
        LEFT JOIN "HMIS" h ON f.dhis2_code = h."facilityId" 
            AND h."createdAt" >= CURRENT_DATE - (months_back || ' months')::INTERVAL
        WHERE f.dhis2_code = facility_dhis2_code
        GROUP BY f.facility_name
    )
    SELECT 
        'Total Patient Visits'::TEXT,
        total_visits,
        'visits'::TEXT,
        CASE WHEN total_visits >= 500 THEN 'Good' WHEN total_visits >= 200 THEN 'Fair' ELSE 'Low' END::TEXT
    FROM facility_metrics
    
    UNION ALL
    
    SELECT 
        'Unique Patients'::TEXT,
        unique_patients,
        'patients'::TEXT,
        CASE WHEN unique_patients >= 300 THEN 'Good' WHEN unique_patients >= 150 THEN 'Fair' ELSE 'Low' END::TEXT
    FROM facility_metrics
    
    UNION ALL
    
    SELECT 
        'HMIS Reports Submitted'::TEXT,
        hmis_reports,
        'reports'::TEXT,
        CASE WHEN hmis_reports >= months_back THEN 'Good' WHEN hmis_reports >= months_back/2 THEN 'Fair' ELSE 'Low' END::TEXT
    FROM facility_metrics
    
    UNION ALL
    
    SELECT 
        'Report Approval Rate'::TEXT,
        ROUND(approval_rate, 2),
        '%'::TEXT,
        CASE WHEN approval_rate >= 90 THEN 'Excellent' WHEN approval_rate >= 70 THEN 'Good' WHEN approval_rate >= 50 THEN 'Fair' ELSE 'Poor' END::TEXT
    FROM facility_metrics
    
    UNION ALL
    
    SELECT 
        'Referral Rate'::TEXT,
        ROUND(referral_rate, 2),
        '%'::TEXT,
        CASE WHEN referral_rate <= 15 THEN 'Good' WHEN referral_rate <= 25 THEN 'Fair' ELSE 'High' END::TEXT
    FROM facility_metrics;
END;
$$ LANGUAGE plpgsql;

-- Function to detect data quality issues
CREATE OR REPLACE FUNCTION reporting.detect_data_quality_issues()
RETURNS TABLE (
    issue_type TEXT,
    facility_name TEXT,
    description TEXT,
    severity TEXT,
    record_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    -- Missing patient demographics
    SELECT 
        'Missing Demographics'::TEXT as issue_type,
        f.facility_name,
        'Patients with missing age or gender information'::TEXT as description,
        'Medium'::TEXT as severity,
        COUNT(*)::BIGINT as record_count
    FROM outpatient o
    JOIN facility f ON o.facility_id = f.id
    WHERE o.age IS NULL OR o.gender IS NULL OR o.gender = ''
        AND o.visit_date >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY f.facility_name
    HAVING COUNT(*) > 10
    
    UNION ALL
    
    -- HMIS reports with empty data
    SELECT 
        'Empty HMIS Data'::TEXT,
        f.facility_name,
        'HMIS reports submitted with no data elements'::TEXT,
        'High'::TEXT,
        COUNT(*)::BIGINT
    FROM "HMIS" h
    JOIN reporting.facility f ON f.dhis2_code = h."facilityId"
    WHERE jsonb_array_length(h.data) = 0
        AND h."createdAt" >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY f.facility_name
    HAVING COUNT(*) > 0
    
    UNION ALL
    
    -- Facilities with no recent activity
    SELECT 
        'No Recent Activity'::TEXT,
        f.facility_name,
        'No patient visits in the last 30 days'::TEXT,
        'High'::TEXT,
        0::BIGINT
    FROM reporting.facility f
    LEFT JOIN outpatient o ON f.id = o.facility_id AND o.visit_date >= CURRENT_DATE - INTERVAL '30 days'
    WHERE o.id IS NULL
    
    UNION ALL
    
    -- Duplicate patient visits on same day
    SELECT 
        'Potential Duplicates'::TEXT,
        f.facility_name,
        'Same patient with multiple visits on the same day'::TEXT,
        'Low'::TEXT,
        COUNT(*)::BIGINT
    FROM (
        SELECT o.facility_id, o.patient_name, o.visit_date, COUNT(*) as visit_count
        FROM outpatient o
        WHERE o.visit_date >= CURRENT_DATE - INTERVAL '1 month'
        GROUP BY o.facility_id, o.patient_name, o.visit_date
        HAVING COUNT(*) > 1
    ) duplicates
    JOIN facility f ON duplicates.facility_id = f.id
    GROUP BY f.facility_name;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate health indicator trends
CREATE OR REPLACE FUNCTION reporting.get_health_indicator_trends(
    indicator_name TEXT,
    months_back INTEGER DEFAULT 12
)
RETURNS TABLE (
    month_year TEXT,
    indicator_value NUMERIC,
    trend_direction TEXT,
    month_over_month_change NUMERIC
) AS $$
BEGIN
    IF indicator_name = 'total_visits' THEN
        RETURN QUERY
        WITH monthly_data AS (
            SELECT 
                TO_CHAR(DATE_TRUNC('month', visit_date), 'YYYY-MM') as month_year,
                COUNT(*)::NUMERIC as indicator_value
            FROM outpatient
            WHERE visit_date >= CURRENT_DATE - (months_back || ' months')::INTERVAL
            GROUP BY DATE_TRUNC('month', visit_date)
            ORDER BY DATE_TRUNC('month', visit_date)
        )
        SELECT 
            md.month_year,
            md.indicator_value,
            CASE 
                WHEN LAG(md.indicator_value) OVER (ORDER BY md.month_year) IS NULL THEN 'No Comparison'
                WHEN md.indicator_value > LAG(md.indicator_value) OVER (ORDER BY md.month_year) THEN 'Increasing'
                WHEN md.indicator_value < LAG(md.indicator_value) OVER (ORDER BY md.month_year) THEN 'Decreasing'
                ELSE 'Stable'
            END::TEXT as trend_direction,
            CASE 
                WHEN LAG(md.indicator_value) OVER (ORDER BY md.month_year) > 0
                THEN ROUND((md.indicator_value - LAG(md.indicator_value) OVER (ORDER BY md.month_year)) * 100.0 / 
                          LAG(md.indicator_value) OVER (ORDER BY md.month_year), 2)
                ELSE NULL
            END as month_over_month_change
        FROM monthly_data md;
    END IF;
    
    -- Add more indicators as needed (immunization_coverage, maternal_mortality, etc.)
    
END;
$$ LANGUAGE plpgsql;

-- =======================================================
-- 4. SCHEDULED MAINTENANCE PROCEDURES
-- =======================================================

-- Procedure to archive old data (to be called by scheduler)
CREATE OR REPLACE FUNCTION reporting.archive_old_data(
    months_to_keep INTEGER DEFAULT 36
)
RETURNS TEXT AS $$
DECLARE
    cutoff_date DATE;
    archived_count INTEGER;
BEGIN
    cutoff_date := CURRENT_DATE - (months_to_keep || ' months')::INTERVAL;
    
    -- Archive old outpatient records
    WITH archived AS (
        DELETE FROM outpatient 
        WHERE visit_date < cutoff_date
        RETURNING id
    )
    SELECT COUNT(*) INTO archived_count FROM archived;
    
    RETURN 'Archived ' || archived_count || ' outpatient records older than ' || cutoff_date;
END;
$$ LANGUAGE plpgsql;

-- =======================================================
-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
-- =======================================================

-- Additional performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_outpatient_visit_date_facility 
ON outpatient(visit_date, facility_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_outpatient_diagnosis_date 
ON outpatient(diagnosis, visit_date) WHERE diagnosis IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hmis_created_facility_status 
ON "HMIS"("createdAt", "facilityId", (metadata->>'status'));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hmis_reporting_period_gin 
ON "HMIS" USING GIN ("reportingPeriod");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hmis_data_gin 
ON "HMIS" USING GIN (data);

-- =======================================================
-- 6. COMMENTS AND DOCUMENTATION
-- =======================================================

COMMENT ON MATERIALIZED VIEW reporting.mv_facility_summary IS 
'Pre-aggregated facility statistics for dashboard and reporting performance';

COMMENT ON MATERIALIZED VIEW reporting.mv_monthly_indicators IS 
'Monthly health indicators by facility for trend analysis';

COMMENT ON FUNCTION reporting.refresh_all_materialized_views() IS 
'Refreshes all materialized views - should be called daily via scheduler';

COMMENT ON FUNCTION reporting.get_facility_performance(TEXT, INTEGER) IS 
'Returns performance metrics for a specific facility over specified months';

COMMENT ON FUNCTION reporting.detect_data_quality_issues() IS 
'Identifies common data quality problems across the system';

-- =======================================================
-- END OF UTILITY VIEWS AND FUNCTIONS
-- =======================================================