SELECT 
d.id, 
d.dataelement, 
e.dataelement_name,
d.categoryoptioncombo,
o."name" 
FROM reporting.dhis2_dataelements_108 d
inner join dhis2_datasets_elements e on e.dataelement_id = d.dataelement 
inner join dhis2_optioncombos o on o.code = d.categoryoptioncombo 
where d.dataelement = 'R9l3TcJpS5I'

SELECT id, code, "name" FROM reporting.dhis2_optioncombos;

SELECT id, dataset_id, dataset_code, dataset_name, dataelement_id, dataelement_code, dataelement_name, created_at
FROM reporting.dhis2_datasets_elements

SELECT id, code, "name" FROM reporting.dhis2_datasets;

----- DATA ELEMENTS FOR SECTION 108 -----
SELECT 
d.id, 
e.dataset_code ,
e.dataset_name,
e.dataset_id ,
d.dataelement, 
SUBSTRING(e.dataelement_code FROM 5) AS dataelement_code,
SUBSTRING(e.dataelement_name FROM 5) AS dataelement_name,
d.categoryoptioncombo as optioncombo_code,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_108 d
inner join dhis2_datasets_elements e on e.dataelement_id = d.dataelement 
inner join dhis2_optioncombos o on o.code = d.categoryoptioncombo 
--where d.dataelement = 'R9l3TcJpS5I'
order by e.dataelement_code

--- Views and Mapping Join ---
SELECT 
  t.report_month, 
  t.hmis_code, 
  CASE m.categoryoptioncombo_uid
    WHEN 'JtoaNPpY2BF' THEN t.below_15_years
    WHEN 'PwuKTzy4vLJ' THEN t."15-19_years"
    WHEN 'c9JPAeQh49R' THEN t."20-24_years"
    WHEN 'QGprPUGJp4N' THEN t."25-49_years"
    WHEN 'sxBbkmHxnBP' THEN t."50+_years"
  END AS value,
  m.hmis_name, 
  m.data_element_id, 
  m.categoryoptioncombo_uid
FROM reporting."105_02_maternity_total_deliveries_in_unit" t
JOIN reporting.dhis_eafya_mapping_maternity m 
  ON m.hmis_code = t.hmis_code
  where t.report_month = '2023-10'



