-- Migration: Add user roles enum and update existing users
-- Description: Updates the users table to use ENUM for roles and sets default roles

-- First, add the role enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('admin', 'user');
    END IF;
END $$;

-- Update the role column to use the enum type
ALTER TABLE reporting.users 
ALTER COLUMN role TYPE user_role_enum 
USING role::user_role_enum;

-- Set default value for the role column
ALTER TABLE reporting.users 
ALTER COLUMN role SET DEFAULT 'user';

-- Update any existing users that don't have a valid role
UPDATE reporting.users 
SET role = 'user' 
WHERE role IS NULL OR role NOT IN ('admin', 'user');

-- Add comment to document the role field
COMMENT ON COLUMN reporting.users.role IS 'User role: admin (full access) or user (limited access)';

-- Create an index on role for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_users_role ON reporting.users(role);










