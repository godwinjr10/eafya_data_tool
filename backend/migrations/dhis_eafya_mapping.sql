-- Create the reporting schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS reporting;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create DHIS-EAFYA mapping table
CREATE TABLE IF NOT EXISTS reporting.dhis_eafya_mapping (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "section_id" VARCHAR(255) NOT NULL,
    "section_name" VARCHAR(255) NOT NULL,
    "eafya_hmis_id" VARCHAR(255) NOT NULL,
    "eafya_id" VARCHAR(255) NOT NULL,
    "eafya_name" VARCHAR(255) NOT NULL,
    "hmis_code" VARCHAR(255) NOT NULL,
    "hmis_name" VARCHAR(255) NOT NULL,
    "data_element_id" VARCHAR(255) NOT NULL,
    "category_optioncombo_id" VARCHAR(255) NOT NULL,
    "category_optioncombo_name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_section_id ON reporting.dhis_eafya_mapping("section_id");
CREATE INDEX IF NOT EXISTS idx_eafya_hmis_id ON reporting.dhis_eafya_mapping("eafya_hmis_id");
CREATE INDEX IF NOT EXISTS idx_data_element_combo ON reporting.dhis_eafya_mapping("data_element_id", "category_optioncombo_id");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION reporting.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_dhis_eafya_mapping_updated_at
    BEFORE UPDATE ON reporting.dhis_eafya_mapping
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_updated_at_column();