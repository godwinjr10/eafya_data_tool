SELECT 
a.report_month,
m.section_id,
m.section_name,
m.hmis_code,
m.hmis_name,
a."Below_15yrs", 
a."15_19yrs", 
a."20_24yrs", 
a."25_50yrs", 
a."50+yrs"
FROM reporting."105_02_anc_1" a
JOIN (SELECT DISTINCT section_id, section_name, hmis_code, hmis_name FROM reporting.dhis_eafya_mapping_antenatal WHERE section_id = '2.1' 
AND hmis_code = 'AN01') m ON 1=1 WHERE 1=1