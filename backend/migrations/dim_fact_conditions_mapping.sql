-- Create the reporting schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS reporting;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dimension table for HMIS conditions
-- This table stores distinct section_ids, hmis codes, and hmis names
CREATE TABLE IF NOT EXISTS reporting.dim_hmis_conditions (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "section_id" VARCHAR(255) NOT NULL,
    "section_name" VARCHAR(255) NOT NULL,
    "hmis_code" VARCHAR(255) NOT NULL,
    "hmis_name" VARCHAR(255) NOT NULL,
    "data_element_id" VARCHAR(255),
    "category_optioncombo_id" VARCHAR(255),
    "category_optioncombo_name" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Ensure unique combinations of section, hmis_code
    UNIQUE (section_id, hmis_code)
);

-- Create fact table for HMIS-EAFYA mappings
-- This table stores the actual mappings from dimension to EAFYA items
CREATE TABLE IF NOT EXISTS reporting.fact_hmis_eafya_mapping (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "dim_condition_id" UUID NOT NULL REFERENCES reporting.dim_hmis_conditions(id) ON DELETE CASCADE,
    "eafya_id" VARCHAR(255) NOT NULL,
    "eafya_name" VARCHAR(255) NOT NULL,
    "eafya_hmis_id" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Ensure no duplicate mappings for same condition and eafya item
    UNIQUE (dim_condition_id, eafya_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dim_hmis_conditions_section ON reporting.dim_hmis_conditions("section_id");
CREATE INDEX IF NOT EXISTS idx_dim_hmis_conditions_code ON reporting.dim_hmis_conditions("hmis_code");
CREATE INDEX IF NOT EXISTS idx_fact_mapping_dim_id ON reporting.fact_hmis_eafya_mapping("dim_condition_id");
CREATE INDEX IF NOT EXISTS idx_fact_mapping_eafya_id ON reporting.fact_hmis_eafya_mapping("eafya_id");
CREATE INDEX IF NOT EXISTS idx_fact_mapping_active ON reporting.fact_hmis_eafya_mapping("is_active");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION reporting.update_conditions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_dim_hmis_conditions_updated_at
    BEFORE UPDATE ON reporting.dim_hmis_conditions
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_conditions_updated_at_column();

CREATE TRIGGER update_fact_hmis_eafya_mapping_updated_at
    BEFORE UPDATE ON reporting.fact_hmis_eafya_mapping
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_conditions_updated_at_column();

-- Insert initial data from existing conditions mapping if it exists
-- This migrates data from the old structure to the new dimension/fact structure
INSERT INTO reporting.dim_hmis_conditions (section_id, section_name, hmis_code, hmis_name, data_element_id, category_optioncombo_id, category_optioncombo_name)
SELECT DISTINCT 
    section_id, 
    section_name, 
    hmis_code, 
    hmis_name,
    data_element_id,
    category_optioncombo_id,
    category_optioncombo_name
FROM reporting.dhis_eafya_mapping_conditions
ON CONFLICT (section_id, hmis_code) DO NOTHING;

-- Insert fact data for existing mappings
INSERT INTO reporting.fact_hmis_eafya_mapping (dim_condition_id, eafya_id, eafya_name, eafya_hmis_id)
SELECT 
    d.id as dim_condition_id,
    m.eafya_id,
    m.eafya_name,
    m.eafya_hmis_id
FROM reporting.dhis_eafya_mapping_conditions m
JOIN reporting.dim_hmis_conditions d ON (
    d.section_id = m.section_id 
    AND d.hmis_code = m.hmis_code
)
ON CONFLICT (dim_condition_id, eafya_id) DO NOTHING; 