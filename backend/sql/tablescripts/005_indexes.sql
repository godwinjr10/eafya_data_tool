
CREATE INDEX idx_10501_disease_month
    ON reporting."105_01_conditions" (disease_id, report_month);

CREATE INDEX idx_dhis_mapping_disease
    ON reporting.dhis_eafya_mapping_conditions_final (eafya_disease_id);

-- For ordering and grouping on section_id (string order)
CREATE INDEX idx_dhis_mapping_section
    ON reporting.dhis_eafya_mapping_conditions_final (section_id);

-- For lookups/order by hmis_code
CREATE INDEX idx_dhis_mapping_hmis
    ON reporting.dhis_eafya_mapping_conditions_final (hmis_code);
