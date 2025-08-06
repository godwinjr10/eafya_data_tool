# DHIS2 Integration Guide for HMIS 105:01 Dataset

## Overview

This guide explains how to push your aggregate EAFYA data to DHIS2 for the "HMIS 105:01 - OPD Monthly Report" dataset (ID: `RtEYsASU7PG`).

## Architecture

```
EAFYA Raw Data → Materialized Views → DHIS2 Mapping → DHIS2 API
```

### Key Components

1. **Materialized Views**: Pre-aggregated data by age/gender groups

   - `reporting."105_01_attendance"` - New patient attendance
   - `reporting."105_01_conditions"` - Disease conditions by patient
   - `reporting."105_01_reattendance"` - Repeat patient visits

2. **Mapping Tables**:

   - `reporting.dim_sections` - HMIS section definitions
   - `reporting.dhis_eafya_mapping` - Maps EAFYA data to DHIS2 data elements

3. **DHIS2 API Routes**: Backend endpoints for data transformation and pushing

## Setup Instructions

### 1. Database Setup

Run the database migration to create required tables:

```sql
-- Run the migration
\i backend/migrations/dhis2_push_log.sql
```

### 2. Environment Configuration

Add DHIS2 credentials to your `.env` file:

```env
# DHIS2 Configuration
DHIS2_BASE_URL=https://your-dhis2-instance.org/api
DHIS2_USERNAME=your-dhis2-username
DHIS2_PASSWORD=your-dhis2-password
```

### 3. Install Required Dependencies

```bash
cd backend
npm install axios
```

### 4. Update DHIS2 Data Element Mappings

**CRITICAL**: You need to update the sample data element IDs in the migration file with your actual DHIS2 data element IDs.

1. Get your DHIS2 data elements for the 105:01 dataset:

   ```bash
   curl -u username:password \
   "https://your-dhis2-instance.org/api/dataSets/RtEYsASU7PG.json?fields=dataSetElements[dataElement[id,name,categoryCombo[categoryOptionCombos[id,name]]]]"
   ```

2. Update the mappings in `backend/migrations/dhis2_push_log.sql` with actual IDs:
   ```sql
   -- Replace these example IDs with your actual DHIS2 data element IDs
   ('1.3.1', 'OPD Attendance', 'ATT_001', '1001', 'New Attendance 0-28d Male',
    'ATT_0_28_M', 'New Attendance 0-28 days Male',
    'YOUR_ACTUAL_DATA_ELEMENT_ID', 'YOUR_ACTUAL_CATEGORY_COMBO_ID', 'default'),
   ```

### 5. Create Materialized Views

Ensure your materialized views are created by running:

```sql
-- Run the materialized views script
\i backend/routes/allDataToPushToDhis2.sql
```

## API Endpoints

### Test DHIS2 Connection

```http
GET /api/dhis2/test-connection
```

### Get Attendance Data for a Month

```http
GET /api/dhis2/attendance/202401
```

### Get Conditions Data for a Month

```http
GET /api/dhis2/conditions/202401
```

### Push Data to DHIS2

```http
POST /api/dhis2/push/RtEYsASU7PG/202401
Content-Type: application/json

{
  "orgUnit": "YOUR_ORG_UNIT_ID",
  "dryRun": false
}
```

### Get Push History

```http
GET /api/dhis2/push-history
```

## Usage Examples

### 1. Test Connection

```bash
curl -X GET http://localhost:5000/api/dhis2/test-connection
```

### 2. Preview Data (Dry Run)

```bash
curl -X POST http://localhost:5000/api/dhis2/push/RtEYsASU7PG/202401 \
  -H "Content-Type: application/json" \
  -d '{"orgUnit": "YOUR_ORG_UNIT_ID", "dryRun": true}'
```

### 3. Push Data to DHIS2

```bash
curl -X POST http://localhost:5000/api/dhis2/push/RtEYsASU7PG/202401 \
  -H "Content-Type: application/json" \
  -d '{"orgUnit": "YOUR_ORG_UNIT_ID", "dryRun": false}'
```

## Data Flow Explanation

### 1. Source Data Structure (Materialized Views)

The materialized views aggregate patient data into age/gender categories:

```sql
-- Example: 105_01_attendance structure
report_month | 0-28d Male | 0-28d Female | 29d-4y Male | 29d-4y Female | ...
202401       | 15         | 12           | 25          | 23            | ...
```

### 2. DHIS2 Data Format

The system transforms this into DHIS2 dataValueSets format:

```json
{
  "dataValues": [
    {
      "dataElement": "abc123def456",
      "categoryOptionCombo": "default001",
      "value": "15",
      "period": "202401",
      "orgUnit": "YOUR_ORG_UNIT_ID"
    }
  ]
}
```

### 3. Mapping Logic

- Each column in materialized views maps to a specific DHIS2 data element
- Age/gender breakdowns map to category option combinations
- Disease conditions use the `dhis_eafya_mapping` table for dynamic mapping

## Frontend Integration

Update your "Push To DHIS2" button to call the API:

```javascript
const handlePushToDhis2 = async () => {
  try {
    const response = await fetch(
      `/api/dhis2/push/${datasetId}/${reportMonth}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgUnit: selectedOrgUnit,
          dryRun: false,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert(
        `Successfully pushed ${result.summary.totalDataValues} data values to DHIS2`
      );
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Network error: ${error.message}`);
  }
};
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Check DHIS2 credentials in `.env` file
2. **Data Element Not Found**: Verify DHIS2 data element IDs in mapping table
3. **No Data Found**: Ensure materialized views have data for the requested month
4. **Org Unit Error**: Confirm org unit ID exists in DHIS2

### Debug Mode

Use dry run to test without pushing to DHIS2:

```json
{
  "orgUnit": "YOUR_ORG_UNIT_ID",
  "dryRun": true
}
```

### Logging

All push operations are logged in `reporting.dhis2_push_log` table:

```sql
SELECT * FROM reporting.dhis2_push_log
ORDER BY created_at DESC
LIMIT 10;
```

## Data Validation

Before pushing to DHIS2, the system validates:

- ✅ Data exists for the requested month
- ✅ DHIS2 mappings are complete
- ✅ All required fields are present
- ✅ Data values are numeric and non-negative
- ✅ DHIS2 connection is active

## Next Steps

1. **Update Data Element IDs**: Replace sample IDs with your actual DHIS2 data element IDs
2. **Test Connection**: Verify DHIS2 API connectivity
3. **Run Dry Run**: Test data transformation without pushing
4. **Schedule Regular Pushes**: Consider automating monthly data pushes
5. **Monitor Logs**: Set up monitoring for failed push operations

## Support

For issues with this integration:

1. Check the `dhis2_push_log` table for error details
2. Verify DHIS2 API documentation for your instance
3. Test individual endpoints before full integration
4. Use dry run mode for debugging
