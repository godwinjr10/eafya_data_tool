-- Fix hmis_eafya_conditions_mapping table to have auto-incrementing primary key
-- This migration adds a proper SERIAL primary key if it doesn't exist

-- First, check if the table exists and what the current structure is
DO $$
BEGIN
    -- Check if the table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'reporting' AND table_name = 'hmis_eafya_conditions_mapping') THEN
        
        -- Check if id column exists and if it's a primary key
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'reporting' AND table_name = 'hmis_eafya_conditions_mapping' AND column_name = 'id') THEN
            
            -- Check if id is already a primary key
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_schema = 'reporting' 
                AND tc.table_name = 'hmis_eafya_conditions_mapping'
                AND tc.constraint_type = 'PRIMARY KEY'
                AND kcu.column_name = 'id'
            ) THEN
                -- Add primary key constraint to existing id column
                ALTER TABLE reporting.hmis_eafya_conditions_mapping 
                ADD CONSTRAINT pk_hmis_eafya_conditions_mapping PRIMARY KEY (id);
                
                RAISE NOTICE 'Added primary key constraint to existing id column';
            ELSE
                RAISE NOTICE 'Primary key already exists on id column';
            END IF;
            
            -- Check if id column is SERIAL (auto-incrementing)
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'reporting' 
                AND table_name = 'hmis_eafya_conditions_mapping' 
                AND column_name = 'id'
                AND is_identity = 'YES'
            ) THEN
                -- Convert existing id column to SERIAL
                -- First, create a sequence
                CREATE SEQUENCE IF NOT EXISTS reporting.hmis_eafya_conditions_mapping_id_seq;
                
                -- Set the sequence to start from the current max id + 1
                SELECT setval('reporting.hmis_eafya_conditions_mapping_id_seq', 
                             COALESCE((SELECT MAX(id) FROM reporting.hmis_eafya_conditions_mapping), 0) + 1, false);
                
                -- Alter the column to use the sequence as default
                ALTER TABLE reporting.hmis_eafya_conditions_mapping 
                ALTER COLUMN id SET DEFAULT nextval('reporting.hmis_eafya_conditions_mapping_id_seq');
                
                -- Set the sequence as owned by the column
                ALTER SEQUENCE reporting.hmis_eafya_conditions_mapping_id_seq OWNED BY reporting.hmis_eafya_conditions_mapping.id;
                
                RAISE NOTICE 'Converted id column to SERIAL with auto-increment';
            ELSE
                RAISE NOTICE 'id column is already auto-incrementing';
            END IF;
            
        ELSE
            -- Add id column as SERIAL primary key
            ALTER TABLE reporting.hmis_eafya_conditions_mapping 
            ADD COLUMN id SERIAL PRIMARY KEY;
            
            RAISE NOTICE 'Added new SERIAL primary key column';
        END IF;
        
    ELSE
        RAISE NOTICE 'Table reporting.hmis_eafya_conditions_mapping does not exist';
    END IF;
END $$;
