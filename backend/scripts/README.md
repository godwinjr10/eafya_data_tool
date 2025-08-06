# DHIS2 Mapping Scripts for HMIS 105

This directory contains scripts to help you fetch and update DHIS2 data element mappings for the HMIS 105 Health Unit Outpatient Monthly Report.

## Overview

Your current CSV file (`dhis2_mapping_details.csv`) has 920 mappings, but the complete HMIS 105 form has many more data elements that need to be mapped. These scripts will help you:

1. **Test your DHIS2 connection**
2. **Fetch missing data elements from DHIS2**
3. **Update your mapping CSV with new mappings**
4. **Validate the mappings**

## Prerequisites

1. **DHIS2 Access**: Ensure you have valid credentials in `backend/config/dhis2.js`
2. **Node.js Dependencies**: Run `npm install` to install required packages
3. **Database Access**: Ensure your database connection is working

## Scripts

### 1. Test DHIS2 Connection

```bash
cd backend
npm run dhis2:test
```

This script will:

- Test authentication with your DHIS2 instance
- Check access to data elements, datasets, and category option combos
- Verify the data value sets endpoint
- Provide troubleshooting information if connection fails

### 2. Update Mappings

```bash
cd backend
npm run dhis2:update-mappings
```

This script will:

- Fetch all data elements from DHIS2
- Match them with HMIS 105 form elements
- Append new mappings to your CSV file
- Create a backup of your existing CSV
- Show summary of mapped vs unmapped elements

### 3. Advanced Fetch (Direct)

```bash
cd backend
npm run dhis2:fetch
```

This runs the full mapping generation process directly.

## HMIS 105 Form Sections Covered

The scripts map data elements for all major sections of HMIS 105:

### Section 1.1 - Outpatient Attendance

- New attendance (OA01)
- Reattendance (OA02)

### Section 1.2 - Outpatient Referrals

- Referrals to unit (OR01)
- Referrals from unit (OR02)

### Section 1.3 - Outpatient Diagnoses

- **1.3.1** Epidemic-Prone Diseases (EP01-EP18)
- **1.3.2** Other Infectious/Communicable Diseases (CD01-CD19)
- **1.3.3** Neonatal Diseases (ND01-ND07)
- **1.3.4** Non Communicable Diseases (NC01-NC06)
- **1.3.5** Oral Diseases (OD01-OD05)
- **1.3.6** ENT Conditions (EN01-EN17)
- **1.3.7** Eye Conditions (EC01-EC25)
- **1.3.8** Mental Health (MH05-MH46)
- **1.3.9** Neurological Disorders (NE03-NE15)
- **1.3.10** Chronic Respiratory Diseases (CR01-CR03)
- **1.3.11** Cancers (CA01-CA19)
- **1.3.12** Palliative Care (PC01-PC06)
- **1.3.14** Disabilities (DS01-DS13)
- **1.3.15** Cardiovascular Diseases (CV01-CV07)
- **1.3.16** Renal Diseases (RD01-RD09)
- **1.3.17** Liver Diseases (LD01-LD10)
- **1.3.18** Endocrine and Metabolic Disorders (EM01-EM03)
- **1.3.19** Injuries (IN01-IN06)
- **1.3.20** Minor Operations in OPD (MN01-MN03)
- **1.3.21** Neglected Tropical Diseases (NT01-NT06)
- **1.3.22** Maternal Conditions (MC01-MC13)
- **1.3.23** Other OPD Conditions (OP01)
- **1.3.24** Deaths in OPD (DT01)
- **1.3.25** Emergency Medical Services (ES01-ES10)
- **1.3.26** TB Screening (TP01-TP04)
- **1.3.26** Nutrition Services (NA01-NA07)
- **1.3.29** Gender Based Violence Services (GBV01-GBV05)

### Age/Gender Disaggregation

Each data element is mapped with appropriate age/gender categories:

- 0-28 days (Male/Female)
- 29 days - 4 years (Male/Female)
- 5-9 years (Male/Female)
- 10-19 years (Male/Female)
- 20+ years (Male/Female)

## Output

After running the update script, you'll get:

1. **Updated CSV**: Your `dhis2_mapping_details.csv` will have new mappings appended
2. **Backup**: A timestamped backup of your original CSV
3. **Summary Report**: Shows how many elements were successfully mapped vs need manual mapping
4. **Manual Review Items**: Elements marked as `NEEDS_MANUAL_MAPPING` require your attention

## Manual Review Required

Some elements may not auto-match and will be marked as `NEEDS_MANUAL_MAPPING`. For these:

1. Search your DHIS2 instance manually
2. Find the correct data element ID
3. Update the CSV with the correct `dhis2_dataElement_id` and `dhis2_categoryOptionCombo_id`

## Configuration

### DHIS2 Connection Settings

Update `backend/config/dhis2.js` with your DHIS2 instance details:

```javascript
const dhis2Api = axios.create({
  baseURL: "https://your-dhis2-instance.org/api",
  auth: {
    username: "your-username",
    password: "your-password",
  },
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Current Configuration

Your current setup points to:

- **URL**: `https://customization.health.go.ug/hmis/api`
- **Username**: `eafya_integration`

## Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check your DHIS2 URL and credentials
   - Ensure the DHIS2 instance is accessible
   - Verify user permissions

2. **No Data Elements Found**

   - Your user might not have permission to read metadata
   - The DHIS2 instance might not have HMIS 105 data elements configured

3. **CSV Append Failed**
   - Check file permissions
   - Ensure the CSV file exists and is not locked by another program

### Getting Help

1. Run the test connection script first: `npm run dhis2:test`
2. Check the console output for detailed error messages
3. Review the backup files if something goes wrong
4. Contact your DHIS2 administrator for metadata access issues

## Next Steps After Running Scripts

1. **Review the updated CSV** - Check new mappings
2. **Handle manual mappings** - Fix any `NEEDS_MANUAL_MAPPING` entries
3. **Test data pushing** - Use your existing DHIS2 routes to test data submission
4. **Validate with actual data** - Ensure the mappings work with real patient data

## File Structure

```
backend/scripts/
├── README.md                     # This file
├── fetch_dhis2_mappings.js      # Main mapping generation script
├── update_mappings.js           # Simple update runner
└── validate_dhis2_connection.js # Connection test script

backend/routes/mappings/
├── dhis2_mapping_details.csv    # Your main mapping file
└── dhis2_mapping_details_backup_*.csv # Automatic backups
```

## Security Note

Keep your DHIS2 credentials secure. Consider using environment variables for production deployments instead of hardcoding credentials in the config file.

