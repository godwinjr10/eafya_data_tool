SELECT 
t.report_month,
e.section_id,
e.section_name,
e.hmis_code,
e.hmis_name,
e.dhis2_data_element_id,
e.categoryoptioncombo_uid ,
e.categoryoptioncombo_name,
t.vaccine_id, 
t.vaccine_name, 
t.pregnant, 
t.non_pregnant
FROM reporting."105_02_tetanus_vaccination" t
INNER JOIN reporting.dhis_eafya_mapping_vaccines e ON e.eafya_vaccine_id = t.vaccine_id
WHERE t.report_month = '202502'
ORDER by t.report_month, e.section_id