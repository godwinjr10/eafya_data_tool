-- Create the reporting schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS reporting;

-- Create datasets table
CREATE TABLE IF NOT EXISTS reporting.datasets (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "sections" TEXT[] NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dataset_name ON reporting.datasets("name");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION reporting.update_dataset_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_dataset_updated_at
    BEFORE UPDATE ON reporting.datasets
    FOR EACH ROW
    EXECUTE FUNCTION reporting.update_dataset_updated_at_column(); 