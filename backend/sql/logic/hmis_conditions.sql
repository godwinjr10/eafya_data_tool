SELECT 
c.report_month, 
c.disease_id, 
c."0-28d Male", 
c."0-28d Female", 
c."29d-4y Male", 
c."29d-4y Female", 
c."5-9y Male", 
c."5-9y Female", 
c."10-19y Male", 
c."10-19y Female", 
c."20y+ Male", 
c."20y+ Female",
m.hmis_code,
e.eafya_hmis_id,
m.hmis_name ,
e.section_id ,
e.section_name ,
e.hmis_code ,
e.hmis_name 
FROM reporting."105_01_conditions" c
inner join reporting.hmis_eafya_mapping m on m.eafya_disease_id = c.disease_id 
inner join reporting.dhis_eafya_mapping_conditions e on CAST(e.eafya_hmis_id AS int) = m.hmis_code