-- Create hmis_eafya_mappings table
-- Create hmis_schemas table
CREATE TABLE IF NOT EXISTS hmis_schemas (
    id SERIAL PRIMARY KEY,
    schema_code VARCHAR(50) NOT NULL UNIQUE,
    schema_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert common HMIS schemas
INSERT INTO hmis_schemas (schema_code, schema_name, description) 
VALUES 
    ('HMIS_105', 'HMIS 105', 'OPD Monthly Report'),
    ('HMIS_108', 'HMIS 108', 'Inpatient Monthly Report')
ON CONFLICT (schema_code) DO NOTHING;

-- Create hmis_eafya_mappings table with schema reference
CREATE TABLE IF NOT EXISTS hmis_eafya_mappings (
    id SERIAL PRIMARY KEY,
    schema_id INTEGER REFERENCES hmis_schemas(id) NOT NULL,
    section_code VARCHAR(50),
    section_name VARCHAR(255),
    hmis_code VARCHAR(50) NOT NULL,
    hmis_name VARCHAR(255) NOT NULL,
    eafya_disease_id VARCHAR(50) NOT NULL,
    eafya_disease_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Add indexes for better query performance
CREATE INDEX idx_hmis_code ON hmis_eafya_mappings(hmis_code);
CREATE INDEX idx_eafya_disease_id ON hmis_eafya_mappings(eafya_disease_id);

-- Add unique constraint to prevent duplicate mappings
CREATE UNIQUE INDEX idx_unique_mapping ON hmis_eafya_mappings(hmis_code, eafya_disease_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_hmis_eafya_mappings_updated_at
    BEFORE UPDATE ON hmis_eafya_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();