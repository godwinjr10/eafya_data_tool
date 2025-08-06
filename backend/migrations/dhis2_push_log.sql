-- Create table for logging DHIS2 push operations
CREATE TABLE IF NOT EXISTS reporting.dhis2_push_log (
    id SERIAL PRIMARY KEY,
    dataset_id VARCHAR(50) NOT NULL,
    org_unit VARCHAR(50) NOT NULL,
    period VARCHAR(10) NOT NULL,
    data_values_count INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'pending')),
    response JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dhis2_push_log_dataset_period 
ON reporting.dhis2_push_log(dataset_id, period);

CREATE INDEX IF NOT EXISTS idx_dhis2_push_log_status 
ON reporting.dhis2_push_log(status);

CREATE INDEX IF NOT EXISTS idx_dhis2_push_log_created_at 
ON reporting.dhis2_push_log(created_at DESC);

-- Add some sample DHIS2 mappings for the 105_01 dataset
-- This assumes you have the actual DHIS2 data element IDs from your DHIS2 instance
INSERT INTO reporting.dhis_eafya_mapping (
    section_id, section_name, eafya_hmis_id, eafya_id, eafya_name, 
    hmis_code, hmis_name, data_element_id, category_optioncombo_id, category_optioncombo_name
) VALUES 
-- Attendance mappings (these are example IDs - replace with your actual DHIS2 data element IDs)
('1.3.1', 'OPD Attendance', 'ATT_001', '1001', 'New Attendance 0-28d Male', 'ATT_0_28_M', 'New Attendance 0-28 days Male', 'abc123def456', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_002', '1002', 'New Attendance 0-28d Female', 'ATT_0_28_F', 'New Attendance 0-28 days Female', 'abc123def457', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_003', '1003', 'New Attendance 29d-4y Male', 'ATT_29D_4Y_M', 'New Attendance 29 days - 4 years Male', 'abc123def458', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_004', '1004', 'New Attendance 29d-4y Female', 'ATT_29D_4Y_F', 'New Attendance 29 days - 4 years Female', 'abc123def459', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_005', '1005', 'New Attendance 5-9y Male', 'ATT_5_9_M', 'New Attendance 5-9 years Male', 'abc123def460', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_006', '1006', 'New Attendance 5-9y Female', 'ATT_5_9_F', 'New Attendance 5-9 years Female', 'abc123def461', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_007', '1007', 'New Attendance 10-19y Male', 'ATT_10_19_M', 'New Attendance 10-19 years Male', 'abc123def462', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_008', '1008', 'New Attendance 10-19y Female', 'ATT_10_19_F', 'New Attendance 10-19 years Female', 'abc123def463', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_009', '1009', 'New Attendance 20y+ Male', 'ATT_20_PLUS_M', 'New Attendance 20+ years Male', 'abc123def464', 'default001', 'default'),
('1.3.1', 'OPD Attendance', 'ATT_010', '1010', 'New Attendance 20y+ Female', 'ATT_20_PLUS_F', 'New Attendance 20+ years Female', 'abc123def465', 'default001', 'default')
ON CONFLICT (section_id, hmis_code) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE reporting.dhis2_push_log IS 'Logs all DHIS2 data push operations with status and responses';