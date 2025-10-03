select distinct 
e.section_id,
e.section_name,
e.eafya_hmis_id ,
e.hmis_code ,
e.hmis_name 
from reporting.dhis_eafya_mapping_conditions_final e
where section_id = '1.3.1'
order by e.hmis_code


/** Not Mapped **/
SELECT DISTINCT 
    c.report_month,
    c.disease_id,
    c.disease,
    e.section_id,
    e.section_name,
    e.eafya_hmis_id,
    e.hmis_code,
    e.hmis_name
FROM reporting.dhis_eafya_mapping_conditions_final e
LEFT JOIN reporting."105_01_conditions" c ON e.eafya_disease_id = c.disease_id AND c.report_month = '202501'
WHERE e.section_id = '1.3.1'
ORDER BY e.hmis_code;

SELECT DISTINCT 
    c.report_month,
    c.disease_id,
    e.eafya_disease_id ,
    c.disease,
    e.section_id,
    e.section_name,
    e.eafya_hmis_id,
    e.hmis_code,
    e.hmis_name
FROM reporting.dhis_eafya_mapping_conditions_final e
LEFT JOIN reporting."105_01_conditions" c 
    ON e.eafya_disease_id = c.disease_id
   AND c.report_month = '202501'
--WHERE e.section_id = '1.3.1'
ORDER BY e.section_id, e.hmis_code;


SELECT distinct 
"_section_id", 
section_name, 
hmis_code, 
hmis_name,
data_element_id
FROM reporting.dhis_eafya_mapping_antenatal
order by hmis_code;

/** Maternity  **/
SELECT distinct 
section_id, 
section_name, 
hmis_code, 
hmis_name, 
dataelement_name, 
data_element_id
FROM reporting.dhis_eafya_mapping_maternity_final
order by hmis_code;

/*** postnatal ***/
SELECT distinct 
"_section_id", 
section_name, 
hmis_code, 
hmis_name, 
data_element_id
FROM reporting.dhis_eafya_mapping_postnatal
order by hmis_code;

/*** Family Planning ***/
SELECT distinct 
"_section_id", 
section_name, 
eafya_id, 
eafya_name,
hmis_code, 
hmis_name, 
data_element_id
FROM reporting.dhis_eafya_mapping_familyplanning
order by hmis_code 

/*** Lab Tests ***/
SELECT distinct  
"_section_id", 
section_name, 
category, 
--eafya_labtest_id, 
--eafya_labtest_name, 
hmis_code, 
hmis_name
FROM reporting.dhis_eafya_mapping_labtests
order by hmis_code;

/**** Commodities ***/
SELECT distinct 
section_id, 
section_name, 
--eafya_product_id, 
--eafya_product_name, 
hmis_code,
hmis_name
--dhis2_data_element_id, 
--data_element_name
FROM reporting.dhis_eafya_mapping_commodities
order by hmis_code 

/*** Vaccines ****/
select distinct 
"_section_id", 
section_name, 
--eafya_vaccine_id, 
--eafya_vaccine_name, 
hmis_code, 
hmis_name, 
dhis2_data_element_id
FROM reporting.dhis_eafya_mapping_vaccines
order by hmis_code;