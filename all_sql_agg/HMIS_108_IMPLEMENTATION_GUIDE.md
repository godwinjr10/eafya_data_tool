# HMIS 108 Inpatient Monthly Report - Implementation Guide

## Overview

The HMIS 108 Health Unit Inpatient Monthly Report is a comprehensive reporting form used by healthcare facilities to report inpatient service statistics to the Ministry of Health and for DHIS2 integration. This guide covers the complete implementation of SQL aggregate scripts for automated data processing and DHIS2 export.

## Report Structure

The HMIS 108 report contains the following main sections:

### 1. Census Information (Main Table)

**Ward-level data with the following indicators:**

| Code     | Description            | Calculation                        |
| -------- | ---------------------- | ---------------------------------- |
| **C101** | Number of beds         | Manual input/config                |
| **C102** | Number of admissions   | Count of patient admissions        |
| **C103** | Number of deaths       | Count of inpatient deaths          |
| **C104** | Patient days           | Sum of days patients spent in ward |
| **C105** | Average length of stay | C104 ÷ C102                        |
| **C106** | Average occupancy      | C104 ÷ 30 days                     |
| **C107** | Bed occupancy %        | (C106 ÷ C101) × 100                |

**Ward Types Covered:**

- Male medical ward
- Female medical ward
- Paediatrics ward
- Maternity/Obstetric ward
- Male surgical ward
- Female surgical ward
- TB ward
- Psychiatric ward
- Emergency ward
- Gynaecology ward
- Acute care unit (ACU)
- Palliative ward
- Eye ward
- Intensive care unit (ICU)
- Nutrition Ward/Corner
- ENT (Ear, Nose, Throat)
- Orthopaedic ward
- Neonatal Unit
- Rehabilitation ward
- Others

### 2. Referrals Section

- **RF01**: Inpatients referred out from facility
- **RF02**: Inpatients referred in to facility
- **RF03**: Inpatients who self-referred
- **RF04**: Inpatients who ran away

### 3. Surgical Procedures

**3.1 Obstetrics:**

- **SP01**: Caesarean sections
- **SP02**: Obstetric fistula repair (RVF, VVF, RVVF)
- **SP03**: Evacuations (incomplete abortion)
- **SP04**: Other obstetric surgery

**3.2 Gynaecology:**

- **GN01**: Laparotomy for ovarian surgery
- **GN02**: Abdominal hysterectomy
- **GN03**: Vaginal hysterectomy
- **GN04**: Myomectomy
- **GN05**: Laparotomy for ectopic pregnancy
- **GN06**: Other gynaecological surgery

**3.3 Plastic Surgery:**

- **PR01**: Skin grafting
- **PR02**: Release of contractures (burns)
- **PR03**: Cleft lip and palate surgery
- **PR04**: Other plastic surgery

## Database Schema Requirements

### HMIS Data Structure

The scripts expect HMIS data to be stored in the `"HMIS"` table with the following structure:

```sql
-- Key fields in HMIS table
"facilityId" VARCHAR(255)     -- Links to facility.dhis2_code
"dataSetId" VARCHAR(255)      -- Should be 'HMIS_108_01' for inpatient data
"reportingPeriod" JSONB       -- {"year": "2024", "month": "12"}
"data" JSONB                  -- Contains all the indicator values
"metadata" JSONB              -- Contains status: 'draft', 'submitted', 'approved'
```

### Expected Data Field Names

The JSONB `data` field should contain indicators with these key names:

```json
{
  // Beds (C101)
  "male_medical_beds": 50,
  "female_medical_beds": 40,
  "paediatrics_beds": 30,

  // Admissions (C102)
  "male_medical_admissions": 120,
  "female_medical_admissions": 95,
  "paediatrics_admissions": 80,

  // Deaths (C103)
  "male_medical_deaths": 3,
  "female_medical_deaths": 2,

  // Patient days (C104)
  "male_medical_patient_days": 800,
  "female_medical_patient_days": 650,

  // Referrals
  "rf01_inpatients_referred_out": 15,
  "rf02_inpatients_referred_in": 25,

  // Surgical procedures
  "sp01_caesarean_sections": 45,
  "gn02_abdominal_hysterectomy": 8
}
```

## Implementation Steps

### Step 1: Deploy the Base Scripts

```sql
-- 1. Deploy the main aggregate views
\i hmis_108_inpatient_report_aggregates.sql

-- 2. Verify views are created
SELECT viewname FROM pg_views WHERE schemaname = 'reporting' AND viewname LIKE '%hmis_108%';
```

### Step 2: Test with Sample Data

```sql
-- Test basic data retrieval
SELECT COUNT(*) FROM reporting.v_hmis_108_complete_report;

-- Check for specific facility
SELECT * FROM reporting.v_hmis_108_complete_report
WHERE facility_name = 'Your Facility Name'
LIMIT 1;
```

### Step 3: Configure DHIS2 Integration

#### 3.1 Map Data Elements

Create a mapping table for DHIS2 data elements:

```sql
CREATE TABLE reporting.hmis_108_dhis2_mapping (
    hmis_code VARCHAR(50) PRIMARY KEY,
    dhis2_data_element_id VARCHAR(50) NOT NULL,
    dhis2_category_combo_id VARCHAR(50) DEFAULT 'default',
    description TEXT
);

-- Insert mappings
INSERT INTO reporting.hmis_108_dhis2_mapping VALUES
('C101_MALE_MEDICAL_BEDS', 'ABC123DEF456', 'default', 'Male medical ward beds'),
('C102_MALE_MEDICAL_ADMISSIONS', 'DEF456GHI789', 'default', 'Male medical admissions'),
-- ... add all mappings
```

#### 3.2 Enhanced DHIS2 Export Query

```sql
-- Export with proper DHIS2 data element IDs
SELECT
    e.orgunit,
    e.period,
    m.dhis2_data_element_id as dataelement,
    m.dhis2_category_combo_id as categoryoptioncombo,
    e.value
FROM reporting.v_hmis_108_dhis2_export e
JOIN reporting.hmis_108_dhis2_mapping m ON e.data_element = m.hmis_code
WHERE e.period = '202412'
    AND e.value > 0
ORDER BY e.orgunit, m.dhis2_data_element_id;
```

### Step 4: Set Up Automated Processing

#### 4.1 Monthly Data Processing Function

```sql
CREATE OR REPLACE FUNCTION reporting.process_hmis_108_monthly()
RETURNS TEXT AS $$
DECLARE
    current_period TEXT;
    processed_facilities INTEGER;
BEGIN
    current_period := TO_CHAR(CURRENT_DATE - INTERVAL '1 month', 'YYYYMM');

    -- Count facilities with data for the period
    SELECT COUNT(DISTINCT facility_id) INTO processed_facilities
    FROM reporting.v_hmis_108_complete_report
    WHERE period = current_period;

    -- Additional processing logic here

    RETURN 'Processed HMIS 108 data for period ' || current_period ||
           '. Total facilities: ' || processed_facilities;
END;
$$ LANGUAGE plpgsql;
```

#### 4.2 Data Quality Validation Function

```sql
CREATE OR REPLACE FUNCTION reporting.validate_hmis_108_data(
    report_period TEXT DEFAULT NULL
)
RETURNS TABLE (
    facility_name TEXT,
    issue_type TEXT,
    issue_description TEXT,
    severity TEXT
) AS $$
BEGIN
    IF report_period IS NULL THEN
        report_period := TO_CHAR(CURRENT_DATE - INTERVAL '1 month', 'YYYYMM');
    END IF;

    RETURN QUERY
    -- Deaths cannot exceed admissions
    SELECT
        r.facility_name::TEXT,
        'Data Consistency'::TEXT,
        'Deaths exceed admissions in medical ward'::TEXT,
        'High'::TEXT
    FROM reporting.v_hmis_108_complete_report r
    WHERE r.period = report_period
        AND (r.c103_male_medical_deaths + r.c103_female_medical_deaths) >
            (r.c102_male_medical_admissions + r.c102_female_medical_admissions)

    UNION ALL

    -- Unrealistic bed occupancy
    SELECT
        w.facility_name::TEXT,
        'Data Quality'::TEXT,
        'Bed occupancy rate exceeds 200%: ' || w.medical_bed_occupancy_rate || '%'::TEXT,
        'Medium'::TEXT
    FROM reporting.v_hmis_108_ward_utilization w
    WHERE w.period = report_period
        AND w.medical_bed_occupancy_rate > 200;
END;
$$ LANGUAGE plpgsql;
```

## Common Use Cases

### 1. Monthly Facility Report

```sql
-- Generate complete monthly report for a facility
SELECT
    facility_name,
    report_year,
    report_month,
    -- Bed capacity
    c101_male_medical_beds + c101_female_medical_beds as total_medical_beds,
    -- Service delivery
    c102_male_medical_admissions + c102_female_medical_admissions as total_admissions,
    c103_male_medical_deaths + c103_female_medical_deaths as total_deaths,
    -- Quality indicators
    CASE
        WHEN (c102_male_medical_admissions + c102_female_medical_admissions) > 0
        THEN ROUND((c103_male_medical_deaths + c103_female_medical_deaths) * 100.0 /
                   (c102_male_medical_admissions + c102_female_medical_admissions), 2)
        ELSE 0
    END as case_fatality_rate,
    -- Surgical activity
    sp01_caesarean_sections,
    -- Referral patterns
    rf01_inpatients_referred_out
FROM reporting.v_hmis_108_complete_report
WHERE facility_name = 'Mulago Hospital'
    AND period = '202412';
```

### 2. National Dashboard Summary

```sql
-- National indicators summary
SELECT
    'Uganda National' as level,
    report_year,
    report_month,
    reporting_facilities,
    total_medical_beds,
    total_medical_admissions,
    ROUND(total_medical_deaths * 100.0 / NULLIF(total_medical_admissions, 0), 2) as national_cfr,
    total_caesarean_sections,
    ROUND(total_caesarean_sections * 100.0 / NULLIF(total_medical_admissions, 0), 2) as cs_rate
FROM reporting.v_hmis_108_national_summary
WHERE period = '202412';
```

### 3. Quality Monitoring

```sql
-- Identify facilities needing attention
SELECT
    facility_name,
    medical_case_fatality_rate,
    medical_bed_occupancy_rate,
    CASE
        WHEN medical_case_fatality_rate > 10 THEN 'High mortality concern'
        WHEN medical_bed_occupancy_rate > 120 THEN 'Overcrowding concern'
        WHEN medical_bed_occupancy_rate < 40 THEN 'Underutilization concern'
        ELSE 'Normal range'
    END as concern_type
FROM reporting.v_hmis_108_ward_utilization
WHERE period = '202412'
    AND (medical_case_fatality_rate > 10
         OR medical_bed_occupancy_rate > 120
         OR medical_bed_occupancy_rate < 40);
```

## Performance Optimization

### Indexing Strategy

```sql
-- Essential indexes for HMIS 108 queries
CREATE INDEX IF NOT EXISTS idx_hmis_108_facility_period
ON "HMIS"("facilityId", (("reportingPeriod"->>'year')||LPAD("reportingPeriod"->>'month', 2, '0')));

CREATE INDEX IF NOT EXISTS idx_hmis_108_dataset_status
ON "HMIS"("dataSetId", (metadata->>'status'));

CREATE INDEX IF NOT EXISTS idx_hmis_108_created_period
ON "HMIS"("createdAt", (("reportingPeriod"->>'year')||LPAD("reportingPeriod"->>'month', 2, '0')));
```

### Materialized View for Performance

```sql
-- Create materialized view for frequently accessed data
CREATE MATERIALIZED VIEW reporting.mv_hmis_108_monthly_summary AS
SELECT
    facility_id,
    facility_name,
    period,
    report_year,
    report_month,
    -- Key indicators only
    c101_male_medical_beds + c101_female_medical_beds as total_medical_beds,
    c102_male_medical_admissions + c102_female_medical_admissions as total_admissions,
    c103_male_medical_deaths + c103_female_medical_deaths as total_deaths,
    sp01_caesarean_sections,
    rf01_inpatients_referred_out,
    CURRENT_TIMESTAMP as last_refreshed
FROM reporting.v_hmis_108_complete_report;

-- Refresh monthly
SELECT reporting.refresh_hmis_108_materialized_views();
```

## Data Quality Assurance

### Validation Rules

1. **Deaths ≤ Admissions** for each ward
2. **Bed occupancy ≤ 300%** (allowing some over-capacity)
3. **Caesarean sections ≤ Maternity admissions**
4. **Patient days ≥ Admissions** (minimum 1 day per admission)
5. **Referrals out ≤ Total admissions**

### Automated Quality Checks

```sql
-- Run monthly data quality validation
SELECT * FROM reporting.validate_hmis_108_data('202412');
```

## Troubleshooting

### Common Issues

1. **Missing Data Elements**

   ```sql
   -- Check for missing critical fields
   SELECT facility_name, COUNT(*) as missing_fields
   FROM reporting.v_hmis_108_complete_report
   WHERE c102_male_medical_admissions IS NULL
      OR c104_male_medical_patient_days IS NULL
   GROUP BY facility_name;
   ```

2. **Incorrect Calculations**

   ```sql
   -- Verify calculated indicators
   SELECT
       facility_name,
       c104_male_medical_patient_days,
       c102_male_medical_admissions,
       c105_male_medical_avg_stay,
       -- Manual calculation for verification
       ROUND(c104_male_medical_patient_days::float / c102_male_medical_admissions, 2) as manual_calc
   FROM reporting.v_hmis_108_calculated_indicators
   WHERE c105_male_medical_avg_stay != ROUND(c104_male_medical_patient_days::float / c102_male_medical_admissions, 2);
   ```

3. **DHIS2 Export Format Issues**
   ```sql
   -- Check export data format
   SELECT data_element, COUNT(*) as records, MIN(value) as min_val, MAX(value) as max_val
   FROM reporting.v_hmis_108_dhis2_export
   WHERE period = '202412'
   GROUP BY data_element
   ORDER BY data_element;
   ```

## Integration with Applications

### REST API Endpoints

Create API endpoints for common queries:

```javascript
// Express.js example endpoints
app.get("/api/hmis-108/facility/:facilityId/:period", async (req, res) => {
  const query = `
        SELECT * FROM reporting.v_hmis_108_complete_report 
        WHERE facility_id = $1 AND period = $2
    `;
  // Execute query and return results
});

app.get("/api/hmis-108/national-summary/:period", async (req, res) => {
  const query = `
        SELECT * FROM reporting.v_hmis_108_national_summary 
        WHERE period = $1
    `;
  // Execute query and return results
});
```

### Dashboard Integration

Use the views directly in dashboard applications:

- **Power BI**: Connect to PostgreSQL views
- **Grafana**: Create dashboard panels using SQL queries
- **Custom React/Vue**: Build API endpoints using the views

## Maintenance Schedule

### Daily

- Monitor data quality alerts
- Check for processing errors

### Weekly

- Review facility reporting completeness
- Validate calculation accuracy

### Monthly

- Refresh materialized views
- Generate quality reports
- Export data to DHIS2
- Archive old data (if needed)

### Quarterly

- Review and update data element mappings
- Optimize query performance
- Update validation rules as needed

---

**Note**: This implementation assumes PostgreSQL database. Adapt syntax for other database systems as needed.

**Version**: 1.0  
**Last Updated**: December 2024
