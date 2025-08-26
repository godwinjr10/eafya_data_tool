-- Migration: Remove mapping_name column from reporting.eafya_mappings table
-- Date: 2024-01-15
-- Description: Remove the mapping_name column as it's no longer needed

-- Check if the column exists before dropping it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'reporting' 
        AND table_name = 'eafya_mappings' 
        AND column_name = 'mapping_name'
    ) THEN
        ALTER TABLE reporting.eafya_mappings DROP COLUMN mapping_name;
        RAISE NOTICE 'Successfully removed mapping_name column from reporting.eafya_mappings table';
    ELSE
        RAISE NOTICE 'mapping_name column does not exist in reporting.eafya_mappings table';
    END IF;
END $$;
