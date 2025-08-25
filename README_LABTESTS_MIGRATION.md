# Lab Tests Query Replacement and Migration

## Overview
This document describes the changes made to replace the lab tests query and update the frontend form to work with the new data structure.

## Changes Made

### 1. Backend Query Update (`backend/routes/dhisreports/labtests.js`)
- **Old Query**: Used `dhis_eafya_mapping_labtests` table with complex JOINs
- **New Query**: Uses `eafya_mappings` table with simplified INNER JOIN structure
- **Key Changes**:
  - Changed from `m.section_id, m.category, m.hmis_code, m.hmis_name` to `e.section_id, e.hmis_dataelement_code, e.hmis_dataelement_name, e.dataelement_id`
  - Added `SUM(COALESCE(t.total_cases, 0))` and `SUM(COALESCE(t.positive_cases, 0))` for aggregation
  - Updated GROUP BY clause to match new field structure
  - Changed ORDER BY to use `e.hmis_dataelement_code`

### 2. Frontend Form Update (`frontend/src/pages/HMIS/LabTestForm.jsx`)
- **Removed**: Category-based grouping since new query doesn't return category information
- **Updated**: Field names to match new backend response:
  - `hmis_code` → `hmis_dataelement_code`
  - `hmis_name` → `hmis_dataelement_name`
- **Simplified**: Layout to show all lab tests in a single section
- **Added**: Support for both section_id '10.2' and '10.2.1'

### 3. Data Entry Form Update (`frontend/src/components/DataEntryForm.jsx`)
- **Changed**: `section_id` from "10.2.1" to "10.2" to use the new parent section

### 4. Migration Script (`backend/scripts/migrate_labtests_to_eafya_mappings.js`)
- **Purpose**: Migrate existing lab test data from CSV format to the new `eafya_mappings` table
- **Features**:
  - Parses existing `dhis_eafya_mapping_labtests.csv`
  - Creates `eafya_mappings` table if it doesn't exist
  - Migrates lab test mappings with proper field mapping
  - Creates parent section '10.2' mapping
  - Handles errors gracefully

## New Query Structure

```sql
SELECT
    t.report_month,
    e.section_id,
    e.hmis_dataelement_code,
    e.hmis_dataelement_name,
    e.dataelement_id,
    SUM(COALESCE(t.total_cases, 0)) AS "total_cases",
    SUM(COALESCE(t.positive_cases, 0)) AS "positive_cases"
FROM reporting."105_10_labtests_done" t
INNER JOIN reporting.eafya_mappings e ON e.eafya_item_id = t.lab_test_id
WHERE e.section_id = $1
GROUP BY t.report_month, e.section_id, e.hmis_dataelement_code, e.hmis_dataelement_name, e.dataelement_id
ORDER BY t.report_month, e.hmis_dataelement_code
```

## How to Run the Migration

### Prerequisites
- Ensure the backend server is running
- Ensure the database connection is configured
- Ensure the `dhis_eafya_mapping_labtests.csv` file exists in `backend/sql/uploads/`

### Running the Migration

1. **Navigate to the backend directory**:
   ```bash
   cd eafya_data_tool/backend
   ```

2. **Run the migration script**:
   ```bash
   node scripts/migrate_labtests_to_eafya_mappings.js
   ```

3. **Verify the migration**:
   - Check the console output for success/error messages
   - Verify data exists in the `reporting.eafya_mappings` table

### Expected Output
```
🚀 Starting lab tests migration...
✅ Reporting schema ensured
✅ eafya_mappings table ensured
📊 Found 297 lab test records to migrate
🗑️ Cleared existing lab test mappings
✅ Successfully migrated 297 lab test records
✅ Created parent section 10.2 mapping

============================================================
📊 LAB TESTS MIGRATION SUMMARY
============================================================
📁 Total records processed: 297
✅ Successfully migrated: 297
❌ Errors: 0
============================================================
```

## Data Structure Changes

### Old Structure (CSV-based)
- Used `dhis_eafya_mapping_labtests` table
- Fields: `section_id`, `category`, `hmis_code`, `hmis_name`, `eafya_labtest_id`
- Required complex JOINs and subqueries

### New Structure (eafya_mappings-based)
- Uses `eafya_mappings` table
- Fields: `section_id`, `hmis_dataelement_code`, `hmis_dataelement_name`, `dataelement_id`, `eafya_item_id`
- Simplified JOIN structure
- Better performance with proper indexing

## Benefits of the New Structure

1. **Performance**: Simplified JOINs and better indexing
2. **Consistency**: Uses the same mapping table structure as other modules
3. **Maintainability**: Centralized mapping management
4. **Scalability**: Easier to add new lab tests and sections
5. **Data Integrity**: Better foreign key relationships

## Troubleshooting

### Common Issues

1. **Migration fails with "table doesn't exist"**:
   - Ensure the database connection is working
   - Check that the reporting schema can be created

2. **No data after migration**:
   - Verify the CSV file path is correct
   - Check that the CSV contains valid data
   - Ensure the eafya_item_id values match existing lab_test_id values

3. **Frontend shows no data**:
   - Verify the backend API endpoint is working
   - Check that the section_id parameter is correct
   - Ensure the eafya_mappings table contains data

### Verification Queries

```sql
-- Check if eafya_mappings table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'reporting' 
    AND table_name = 'eafya_mappings'
);

-- Check lab test mappings
SELECT COUNT(*) FROM reporting.eafya_mappings WHERE section_id = '10.2.1';

-- Check parent section mapping
SELECT * FROM reporting.eafya_mappings WHERE section_id = '10.2';
```

## Next Steps

After running the migration:

1. **Test the new API endpoint**: `/api/labtests?section_id=10.2&report_month=202503`
2. **Verify frontend functionality**: Check that lab tests display correctly
3. **Test with different section IDs**: Try both '10.2' and '10.2.1'
4. **Monitor performance**: Ensure the new query performs well with large datasets

## Rollback Plan

If issues arise, you can rollback by:

1. **Restoring the old query** in `backend/routes/dhisreports/labtests.js`
2. **Restoring the old frontend code** in `LabTestForm.jsx`
3. **Reverting the section_id change** in `DataEntryForm.jsx`
4. **Clearing the eafya_mappings table** if needed

The migration script is designed to be idempotent, so running it multiple times is safe.
