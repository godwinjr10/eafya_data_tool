# EAFYA Data Tool - SQL Aggregate Scripts Documentation

## Overview

This collection of SQL scripts provides comprehensive analytics and reporting capabilities for the EAFYA Health Management Information System (HMIS). The scripts are designed to support health facility management, data quality monitoring, DHIS2 integration, and public health surveillance.

## Database Structure Summary

Based on your database schema analysis, the system includes:

### Core Tables:

- **`"HMIS"`** - Main HMIS data with JSON fields for health indicators
- **`reporting.facility`** - Healthcare facilities with DHIS2 integration codes
- **`outpatient`** - Patient visit records with diagnosis and treatment data
- **`reporting.dim_sections`** - Dimensional table for HMIS sections and items
- **`reporting.dim_hmis_conditions`** - HMIS conditions mapped to DHIS2 elements
- **`reporting.fact_hmis_eafya_mapping`** - Fact table linking HMIS to EAFYA items
- **`reporting.eafya_hmis_mappings`** - EAFYA to HMIS mappings
- **`reporting.dhis_eafya_mapping`** - DHIS2 integration mappings
- **`reporting.datasets`** - Dataset definitions

## Script Files Overview

### 1. `sql_aggregate_scripts.sql`

**Primary analytics and reporting queries**

#### Key Features:

- **Facility Performance Analytics** - Monthly reporting completeness, approval rates
- **Patient Visit Analytics** - Visit trends, demographics, diagnosis patterns
- **Data Mapping Completeness** - EAFYA-HMIS and DHIS2 mapping coverage
- **Data Quality Metrics** - Submission timeliness, completeness scores
- **Operational Dashboard** - Real-time facility performance rankings
- **Trend Analysis** - Monthly growth rates and indicators
- **DHIS2 Export Queries** - Ready-to-export data for DHIS2 integration

#### Usage Examples:

```sql
-- Get facility performance for last 3 months
SELECT facility_name, total_visits, approval_percentage, performance_category
FROM (/* facility performance query */)
WHERE reporting_month >= CURRENT_DATE - INTERVAL '3 months';

-- Current month dashboard summary
SELECT * FROM (/* current month summary query */);
```

### 2. `specialized_health_analytics.sql`

**Advanced health program monitoring and surveillance**

#### Key Features:

- **Disease Surveillance** - Outbreak detection, unusual increase alerts
- **Maternal & Child Health (MCH)** - ANC completion rates, immunization coverage
- **Immunization Analytics** - Vaccine coverage and dropout rates
- **Supply Chain Management** - Stock levels, consumption patterns, stock-out analysis
- **Health System Performance** - WHO building blocks assessment
- **Predictive Analytics** - Seasonal disease patterns and forecasting
- **Quality Improvement** - Data quality improvement tracking over time

#### Usage Examples:

```sql
-- Disease outbreak detection
SELECT * FROM (/* disease surveillance query */)
WHERE surveillance_status LIKE '%ALERT%';

-- MCH service utilization
SELECT facility_name, anc_completion_rate, skilled_deliveries
FROM (/* MCH indicators query */)
WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);
```

### 3. `utility_views_and_functions.sql`

**Performance optimization and common utilities**

#### Key Features:

- **Materialized Views** for improved query performance
- **Convenient Views** for common dashboard queries
- **Utility Functions** for data analysis and maintenance
- **Data Quality Functions** for automated issue detection
- **Performance Indexes** for faster query execution

#### Key Components:

```sql
-- Refresh materialized views (run daily)
SELECT reporting.refresh_all_materialized_views();

-- Get facility performance summary
SELECT * FROM reporting.get_facility_performance('FACILITY_CODE', 6);

-- Detect data quality issues
SELECT * FROM reporting.detect_data_quality_issues();
```

## Implementation Guide

### Step 1: Database Setup

1. Ensure your database has the required schema from the migration files
2. Verify all indexes are created for optimal performance

### Step 2: Deploy Utility Scripts

```sql
-- Run the utility views and functions first
\i utility_views_and_functions.sql

-- Refresh materialized views
SELECT reporting.refresh_all_materialized_views();
```

### Step 3: Schedule Regular Maintenance

```sql
-- Set up daily refresh of materialized views (use your scheduler)
SELECT reporting.refresh_all_materialized_views();

-- Weekly data quality check
SELECT * FROM reporting.detect_data_quality_issues();
```

### Step 4: Run Analytics Queries

Execute queries from the main analytics files based on your reporting needs.

## Common Use Cases

### 1. Monthly Health Facility Report

```sql
-- Combine multiple metrics for comprehensive facility reporting
SELECT
    f.facility_name,
    fms.total_visits_last_12m,
    fms.hmis_approval_rate,
    fr.overall_rank,
    fr.performance_category
FROM reporting.mv_facility_summary fms
JOIN reporting.facility f ON f.id = fms.id
JOIN reporting.v_facility_rankings fr ON fr.facility_name = f.facility_name
ORDER BY fr.overall_rank;
```

### 2. Disease Surveillance Dashboard

```sql
-- Monitor disease trends and alerts
SELECT diagnosis, facility_name, surveillance_status, case_count
FROM (/* disease surveillance query from specialized_health_analytics.sql */)
WHERE surveillance_status != 'Normal'
ORDER BY case_count DESC;
```

### 3. DHIS2 Data Export

```sql
-- Export approved data ready for DHIS2
SELECT orgunit, period, dataelement, categoryoptioncombo, value
FROM (/* DHIS2 export query from sql_aggregate_scripts.sql */)
WHERE period = '202412'  -- December 2024
ORDER BY orgunit, dataelement;
```

### 4. Data Quality Monitoring

```sql
-- Regular data quality assessment
SELECT
    facility_name,
    approval_rate_this_month,
    CASE
        WHEN approval_rate_this_month >= 90 THEN 'Excellent'
        WHEN approval_rate_this_month >= 70 THEN 'Good'
        ELSE 'Needs Attention'
    END as quality_status
FROM reporting.v_current_month_dashboard;
```

## Performance Considerations

### Materialized Views

- **Refresh Schedule**: Daily refresh recommended for `mv_facility_summary` and `mv_monthly_indicators`
- **Size**: Monitor materialized view sizes as data grows
- **Indexes**: Ensure proper indexing on frequently queried columns

### Query Optimization

- Use date ranges to limit data scope
- Leverage existing indexes on `visit_date`, `facility_id`, `"createdAt"`
- Consider partitioning for very large tables (>10M records)

### Resource Usage

- Run heavy analytics queries during off-peak hours
- Monitor query execution plans for performance bottlenecks
- Use `EXPLAIN ANALYZE` to optimize slow queries

## Maintenance Tasks

### Daily

- Refresh materialized views
- Check data quality issues
- Monitor facility reporting completeness

### Weekly

- Review facility performance rankings
- Analyze disease surveillance alerts
- Validate DHIS2 mapping completeness

### Monthly

- Generate comprehensive facility reports
- Update forecasting models
- Archive old data (as needed)

## Customization Guidelines

### Adding New Indicators

1. Identify the data source (HMIS, outpatient, etc.)
2. Add calculation logic to appropriate script file
3. Update materialized views if needed
4. Create indexes for new query patterns

### Facility-Specific Customizations

```sql
-- Example: Add facility type classification
ALTER TABLE reporting.facility
ADD COLUMN facility_type VARCHAR(50) DEFAULT 'Primary';

-- Update queries to include facility type grouping
SELECT facility_type, AVG(approval_rate) as avg_approval
FROM (/* your query */)
GROUP BY facility_type;
```

### Regional Analysis

```sql
-- Add regional groupings for multi-district analysis
SELECT region, COUNT(*) as facility_count, AVG(performance_score)
FROM facilities_with_regions
GROUP BY region;
```

## Troubleshooting

### Common Issues

1. **Slow Query Performance**

   - Check if materialized views need refreshing
   - Verify proper indexes exist
   - Consider date range limitations

2. **Missing Data in Reports**

   - Validate facility DHIS2 codes match
   - Check data approval status
   - Verify date filters

3. **Materialized View Errors**
   - Ensure base tables exist
   - Check for data type conflicts
   - Refresh views after schema changes

### Error Resolution

```sql
-- Check materialized view dependencies
SELECT schemaname, matviewname, definition
FROM pg_matviews
WHERE schemaname = 'reporting';

-- Validate data integrity
SELECT COUNT(*) FROM "HMIS" WHERE "facilityId" NOT IN
    (SELECT dhis2_code FROM reporting.facility WHERE dhis2_code IS NOT NULL);
```

## Security Considerations

- Grant appropriate permissions to reporting users
- Use read-only access for analytics queries
- Implement row-level security if needed for multi-tenant scenarios
- Audit access to sensitive patient data

## Integration with Applications

### API Development

These queries can be wrapped in API endpoints for:

- Dashboard applications
- Mobile health apps
- Reporting portals
- DHIS2 integration services

### Scheduled Reporting

Automate report generation using:

- Database schedulers (pg_cron)
- Application schedulers
- ETL tools
- Business intelligence platforms

## Support and Maintenance

For ongoing support:

1. Monitor query performance regularly
2. Update scripts as business requirements change
3. Maintain documentation for customizations
4. Train users on proper query usage
5. Implement proper backup and recovery procedures

---

**Note**: These scripts are designed for PostgreSQL databases. Modify syntax as needed for other database systems.

**Last Updated**: December 2024
**Version**: 1.0
