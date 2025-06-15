-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create HMIS table
CREATE TABLE IF NOT EXISTS "HMIS" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "dataSetId" VARCHAR(255) NOT NULL,
    "section" INTEGER NOT NULL CHECK ("section" >= 0),
    "facilityId" VARCHAR(255) NOT NULL,
    "reportingPeriod" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{"status": "draft"}',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS hmis_dataset_facility_idx ON "HMIS" ("dataSetId", "facilityId");
CREATE INDEX IF NOT EXISTS hmis_dataset_section_idx ON "HMIS" ("dataSetId", "section");
CREATE INDEX IF NOT EXISTS hmis_reporting_period_idx ON "HMIS" (
    (("reportingPeriod"->>'year')::integer),
    (("reportingPeriod"->>'month')::integer)
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_hmis_updated_at
    BEFORE UPDATE ON "HMIS"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 