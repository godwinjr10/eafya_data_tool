/**** DATA TOOL 105 Conditions Report Script ****/
SELECT
c.report_month,
e.section_id,
e.section_name,
e.hmis_code,
e.hmis_name,
SUM(COALESCE(c."0-28d Male", 0)) AS "0_28d_male",
SUM(COALESCE(c."0-28d Female", 0)) AS "0_28d_female",
SUM(COALESCE(c."29d-4y Male", 0)) AS "29d_4y_male",
SUM(COALESCE(c."29d-4y Female", 0)) AS "29d_4y_female",
SUM(COALESCE(c."5-9y Male", 0)) AS "5_9y_male",
SUM(COALESCE(c."5-9y Female", 0)) AS "5_9y_female",
SUM(COALESCE(c."10-19y Male", 0)) AS "10_19y_male",
SUM(COALESCE(c."10-19y Female", 0)) AS "10_19y_female",
SUM(COALESCE(c."20y+ Male", 0)) AS "20y_plus_male",
SUM(COALESCE(c."20y+ Female", 0)) AS "20y_plus_female"
FROM reporting."105_01_conditions" c
INNER JOIN reporting.dhis_eafya_mapping_conditions_final e ON e.eafya_disease_id = c.disease_id
WHERE c.report_month = '202502'
GROUP by c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
ORDER by c.report_month, e.section_id


/**** Raw Mapped Script ****/
select
c.report_month,
e.section_id,
c.disease_id,
e.hmis_dataelement_code,
e.hmis_dataelement_name,
e.dataelement_id,
e.eafya_item_id, 
e.eafya_item_name,
COALESCE(c."0-28d Male", 0) AS "0_28d_male",
COALESCE(c."0-28d Female", 0) AS "0_28d_female",
COALESCE(c."29d-4y Male", 0) AS "29d_4y_male",
COALESCE(c."29d-4y Female", 0) AS "29d_4y_female",
COALESCE(c."5-9y Male", 0) AS "5_9y_male",
COALESCE(c."5-9y Female", 0) AS "5_9y_female",
COALESCE(c."10-19y Male", 0) AS "10_19y_male",
COALESCE(c."10-19y Female", 0) AS "10_19y_female",
COALESCE(c."20y+ Male", 0) AS "20y_plus_male",
COALESCE(c."20y+ Female", 0) AS "20y_plus_female"
FROM reporting."105_01_conditions" c
inner join reporting.eafya_mappings e on eafya_item_id = c.disease_id 
WHERE c.report_month = '202502'

/*** DHIS2 PUSH SQL SCRIPT ***/
 SELECT
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.category_optioncombo_name,
        d.category_optioncombo_id,
        CASE d.category_optioncombo_id
            WHEN 'zh2zAaHyYQx'    THEN SUM(COALESCE(c."0-28d Male", 0))
            WHEN 'wDiX34aiw6i'  THEN SUM(COALESCE(c."0-28d Female", 0))
            WHEN 'V2OuNTRI6ua'   THEN SUM(COALESCE(c."29d-4y Male", 0))
            WHEN 'huBy3W5qiD2' THEN SUM(COALESCE(c."29d-4y Female", 0))
            WHEN 'F1rms8f9I9a'     THEN SUM(COALESCE(c."5-9y Male", 0))
            WHEN 'Crc5reUlspd'   THEN SUM(COALESCE(c."5-9y Female", 0))
            WHEN 'c7gvocRdg0f'   THEN SUM(COALESCE(c."10-19y Male", 0))
            WHEN 'u3CkZqMHfHP' THEN SUM(COALESCE(c."10-19y Female", 0))
            WHEN 'dCKzhhINakS'     THEN SUM(COALESCE(c."20y+ Male", 0))
            WHEN 'XVHTeecEOM3'   THEN SUM(COALESCE(c."20y+ Female", 0))
            ELSE 0
        END AS value
    FROM reporting."105_01_conditions" c
    JOIN reporting.dhis_eafya_mapping_conditions_final d ON d.eafya_disease_id = c.disease_id 
    join reporting.dhis_datasets_elements s on s.dataelement_id = d.data_element_id 
    where c.report_month = '202506'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.category_optioncombo_name, d.category_optioncombo_id
    ORDER BY c.report_month, d.data_element_id, d.category_optioncombo_name