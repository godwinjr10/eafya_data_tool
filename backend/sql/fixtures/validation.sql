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

/** Antenatal  **/
SELECT distinct 
a."_section_id", 
a.section_name, 
a.hmis_code, 
a.hmis_name,
m.dataelement_name, 
a.data_element_id,
m.dataset_id, 
m.dataset_code, 
m.dataset_name, 
m.dataelement_id, 
m.dataelement_code, 
m.section_id
FROM reporting.dhis_eafya_mapping_antenatal a
left outer join reporting.dhis_datasets_elements m on m.dataelement_id = a.data_element_id 
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

/**** Conditions Validation ***/
SELECT DISTINCT
    c.report_month,
    e.section_id,
    e.section_name,
    e.eafya_hmis_id,
    e.hmis_code,
    e.hmis_name,
    string_to_array(e.section_id, '.')::int[] AS sort_key
FROM reporting.dhis_eafya_mapping_conditions_final e
LEFT JOIN reporting."105_01_conditions" c
    ON e.eafya_disease_id = c.disease_id
   AND c.report_month = '202502'
ORDER BY sort_key, hmis_code;


SELECT
    c.report_month,
    e.section_id,
    e.section_name,
    e.hmis_code,
    e.hmis_name,
    SUM(COALESCE(c."0-28d Male", 0))   AS "0_28d_male",
    SUM(COALESCE(c."0-28d Female", 0)) AS "0_28d_female",
    SUM(COALESCE(c."29d-4y Male", 0))  AS "29d_4y_male",
    SUM(COALESCE(c."29d-4y Female", 0))AS "29d_4y_female",
    SUM(COALESCE(c."5-9y Male", 0))    AS "5_9y_male",
    SUM(COALESCE(c."5-9y Female", 0))  AS "5_9y_female",
    SUM(COALESCE(c."10-19y Male", 0))  AS "10_19y_male",
    SUM(COALESCE(c."10-19y Female", 0))AS "10_19y_female",
    SUM(COALESCE(c."20y+ Male", 0))    AS "20y_plus_male",
    SUM(COALESCE(c."20y+ Female", 0))  AS "20y_plus_female",
    string_to_array(e.section_id, '.')::int[] AS sort_key
FROM reporting.dhis_eafya_mapping_conditions_final e
LEFT JOIN reporting."105_01_conditions" c
    ON e.eafya_disease_id = c.disease_id
   AND c.report_month = '202501'
GROUP BY
    c.report_month,
    e.section_id,
    e.section_name,
    e.hmis_code,
    e.hmis_name,
    sort_key
ORDER BY sort_key, hmis_code

/** data elements  ***/
SELECT  
e.dataset_id, 
e.dataset_code, 
e.dataset_name,
a.dataelement, 
e.dataelement_id, 
e.dataelement_code, 
e.dataelement_name,
a.categoryoptioncombo,
m."name"
FROM reporting.dhis2_dataelements_1051 a
inner join reporting.dhis_datasets_elements e on e.dataelement_id = a.dataelement 
inner join reporting.dhis_optioncombos m on m.code = a.categoryoptioncombo


/** Antenatal Dataelemeents **/
SELECT 
'2.1' as section_id,
'Antenatal' as section_name,
m.dataelement_code,
m.dataelement_id as dataelement,
substring(m.dataelement_name FROM 11) AS dataelement_name,
m.dataset_id,
m.dataset_code,
m.dataset_name
FROM reporting.dhis_datasets_elements m
WHERE m.dataset_id = 'ic1BSWhGOso'
  AND m.dataelement_code ILIKE '%105-AN%'
  AND m.dataelement_code NOT IN (
      '105-AN06A_2019', '105-AN07A_2019', '105-AN07B_2019',
      '105-AN13A_2019', '105-AN14A_2019', '105-AN15A_2019',
      '105-AN16A_2019','105-AN31B_2019', '105-AN33B_2019',
      '105-AN35B_2019', '105-AN03_2019', '105-AN14A_', 
      '105-AN19_2019', '105-AN20_2019', '105-AN21_2019',
      '105-AN22_2019', '105-AN25B_2019', '105-AN26B_2016', 
      '105-AN26C_2019', '105-AN28c_2019', '105-AN32_2019',
      '105-AN34A_2019', '105-AN38b_2019', '105-AN39b_2019',
      '105-AN40_2019', '105-AN42A_2019', '105-AN42B_2019',
      '105-AN42C_2019', '105-AN42D_2019'
      
  )
ORDER BY m.dataelement_code;


/** Maternity Dataelemeents **/
SELECT 
'2.2' as section_id,
'Maternity' as section_name,
m.dataelement_code,
m.dataelement_id as dataelement,
substring(m.dataelement_name FROM 11) AS dataelement_name,
m.dataset_id,
m.dataset_code,
m.dataset_name
FROM reporting.dhis_datasets_elements m
WHERE m.dataset_id = 'ic1BSWhGOso'
  AND m.dataelement_code ILIKE '%105-MA%'
  AND m.dataelement_code NOT IN (
     '105-MA05C_2019', '105-MA06A_2019', '105-MA06B_2019', '105-MA06c_2019',
     '105-MA11_2019', '105-MA12_2019', '105-MA15B_2019', '105-MA16b_2019',
     '105-MA18B_2019', '105-MA21A_2019', '105-MA21B_2019', '105-MA21C_2019',
     '105-MA21D_2019'
  )
ORDER BY m.dataelement_code;

/** family planning visits**/
SELECT 
'2.4.1' as section_id,
'Family Planning Visits' as section_name,
m.dataelement_code,
m.dataelement_id as dataelement,
substring(m.dataelement_name FROM 11) AS dataelement_name,
m.dataset_id,
m.dataset_code,
m.dataset_name
FROM reporting.dhis_datasets_elements m
WHERE m.dataset_id = 'ic1BSWhGOso'
  AND m.dataelement_code ILIKE '%105-FP%'
  AND m.dataelement_code NOT IN (
     '105-FP01_2019', '105-FP02_2019','105-FP04_2019','105-FP05_2019',
     '105-FP07_2019', '105-FP08_2019', '105-FP09_2019', '105-FP11_2019',
     '105-FP21', '105-FP22'
  )
ORDER BY m.dataelement_code;

/** Conditions Mapping **/
SELECT 
    m.section_id, 
    m.section_name, 
    m.hmis_code, 
    --m.dataelement, 
    m.hmis_name, 
    --m.dataset_id, 
    --m.dataset_code, 
    m.dataset_name,
    s.eafya_id,
    s.eafya_name 
FROM reporting.dataelements_conditions m
LEFT JOIN reporting.mapped_hmis_conditions s
       ON m.hmis_code = s.hmis_code
WHERE s.hmis_code IS NULL
  AND m.section_id = '1.3.1'
ORDER BY m.hmis_code;

/** conditions mapped **/
select 
s.section_id,
s.hmis_id,
s.hmis_code,
s.hmis_name,
c.report_month,
c.disease_id,
c.disease,
c."0-28d Male", 
c."0-28d Female", 
c."29d-4y Male", 
c."29d-4y Female", 
c."5-9y Male", 
c."5-9y Female", 
c."10-19y Male", 
c."10-19y Female", 
c."20y+ Male", 
c."20y+ Female"
from reporting."105_01_conditions" c
left outer join reporting.mapped_hmis_conditions s on s.eafya_id = c.disease_id 
where c.report_month = '202501'
order by s.section_id



