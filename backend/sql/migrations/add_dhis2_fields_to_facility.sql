-- Migration: Add DHIS2 fields to facility table
-- Description: Adds dhis2_uri, dhis2_username, and dhis2_password fields to the facility table

-- Add new columns to the facility table
ALTER TABLE reporting.facility 
ADD COLUMN IF NOT EXISTS dhis2_uri VARCHAR(255),
ADD COLUMN IF NOT EXISTS dhis2_username VARCHAR(255),
ADD COLUMN IF NOT EXISTS dhis2_password VARCHAR(255);

-- Add comments to document the new fields
COMMENT ON COLUMN reporting.facility.dhis2_uri IS 'DHIS2 server URI/URL for this facility';
COMMENT ON COLUMN reporting.facility.dhis2_username IS 'DHIS2 username for authentication';
COMMENT ON COLUMN reporting.facility.dhis2_password IS 'DHIS2 password for authentication';

-- Create index on dhis2_uri for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_facility_dhis2_uri ON reporting.facility(dhis2_uri);










