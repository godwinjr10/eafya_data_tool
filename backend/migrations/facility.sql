-- Create facility table
CREATE TABLE IF NOT EXISTS reporting.facility (
    "id" SERIAL PRIMARY KEY,
    "facility_name" VARCHAR(255) NOT NULL,
    "dhis2_code" VARCHAR(255) UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_facility_name ON reporting.facility("facility_name");
CREATE INDEX IF NOT EXISTS idx_facility_dhis2_code ON reporting.facility("dhis2_code");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION reporting.update_facility_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_facility_updated_at
    BEFORE UPDATE ON reporting.facility
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_facility_updated_at_column(); 