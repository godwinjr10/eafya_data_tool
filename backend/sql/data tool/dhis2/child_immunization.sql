SELECT 
  a.report_month,
  m.section_id,
  m.section_name,
  m.hmis_code,
  m.hmis_name,
  a.vaccine_id, 
  a.vaccine_name, 
  a."Under1y", 
  a."1-4y", 
  a."5-14y"
FROM reporting."105_02_child_immunization" a
JOIN (
  SELECT DISTINCT 
    section_id, 
    section_name, 
    hmis_code, 
    hmis_name,
    eafya_vaccine_id
  FROM reporting.dhis_eafya_mapping_vaccines 
  WHERE section_id = '2.6.3'
) m 
ON m.eafya_vaccine_id = a.vaccine_id
ORDER BY a.report_month DESC;