-- Migration for EAFYA-HMIS mappings using the new dimension table structure
-- This table stores the mappings between EAFYA items and the dimension table

CREATE TABLE IF NOT EXISTS reporting.eafya_hmis_mappings (
    id SERIAL PRIMARY KEY,
    dim_id INTEGER NOT NULL REFERENCES reporting.dim_all_mappings(id),
    eafya_id VARCHAR(50) NOT NULL,
    eafya_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique mapping per dim_id and eafya_id combination
    UNIQUE(dim_id, eafya_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_eafya_hmis_mappings_dim_id ON reporting.eafya_hmis_mappings(dim_id);
CREATE INDEX IF NOT EXISTS idx_eafya_hmis_mappings_eafya_id ON reporting.eafya_hmis_mappings(eafya_id);

-- Add trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_eafya_hmis_mappings_updated_at 
    BEFORE UPDATE ON reporting.eafya_hmis_mappings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE reporting.eafya_hmis_mappings IS 'Stores mappings between EAFYA items and HMIS dimension data';
COMMENT ON COLUMN reporting.eafya_hmis_mappings.dim_id IS 'Foreign key to reporting.dim_all_mappings';
COMMENT ON COLUMN reporting.eafya_hmis_mappings.eafya_id IS 'EAFYA item identifier';
COMMENT ON COLUMN reporting.eafya_hmis_mappings.eafya_name IS 'EAFYA item name/description'; 