-- Create the reporting schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS reporting;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create items table
CREATE TABLE IF NOT EXISTS reporting.items (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "data_element_id" VARCHAR(255) NOT NULL,
    "eafya_id" VARCHAR(255),
    "eafya_name" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_items_data_element_id ON reporting.items("data_element_id");
CREATE INDEX IF NOT EXISTS idx_items_eafya_id ON reporting.items("eafya_id");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION reporting.update_items_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON reporting.items
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_items_updated_at_column(); 