-- Create the reporting schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS reporting;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for mapped HMIS conditions (matches the CSV structure)
CREATE TABLE IF NOT EXISTS reporting.mapped_hmis_conditions (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "section_id" VARCHAR(255) NOT NULL,
    "hmis_code" VARCHAR(255) NOT NULL,
    "hmis_name" VARCHAR(255) NOT NULL,
    "parent_id" VARCHAR(255),
    "eafya_disease_id" VARCHAR(255) NOT NULL,
    "eafya_disease_name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mapped_conditions_section ON reporting.mapped_hmis_conditions("section_id");
CREATE INDEX IF NOT EXISTS idx_mapped_conditions_hmis_code ON reporting.mapped_hmis_conditions("hmis_code");
CREATE INDEX IF NOT EXISTS idx_mapped_conditions_eafya_id ON reporting.mapped_hmis_conditions("eafya_disease_id");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION reporting.update_mapped_conditions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_mapped_hmis_conditions_updated_at
    BEFORE UPDATE ON reporting.mapped_hmis_conditions
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_mapped_conditions_updated_at_column(); 