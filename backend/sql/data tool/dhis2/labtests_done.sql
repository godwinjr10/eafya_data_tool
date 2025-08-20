SELECT 
t.report_month,
m.section_id,
m.category,
m.hmis_code,
m.hmis_name,
t.lab_test_name,
t.total_cases,
t.positive_cases
FROM reporting."105_10_labtests_done" t
JOIN (
SELECT DISTINCT section_id, category, hmis_code, hmis_name, eafya_labtest_id
FROM reporting.dhis_eafya_mapping_labtests 
WHERE section_id = '10.2.1'
) m 
ON t.lab_test_id = m.eafya_labtest_id 
WHERE t.report_month = '202505'