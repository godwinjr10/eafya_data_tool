/**** DATA TOOL 105 Conditions Report Script ****/
SELECT
c.report_month,
e.section_id,
e.section_name,
e.hmis_code,
e.hmis_name,
e.dhis2_data_element_id,
e.categoryoptioncombo_uid ,
e.categoryoptioncombo_name,
c."10y Male"  AS "10y_male",
c."10y Female" AS "10y_female",
c."11y+ Male" AS "11y+_male",
c."11y+ Female" AS "11y+_female"
FROM reporting."105_02_hpv_vaccination" c
INNER JOIN reporting.dhis_eafya_mapping_vaccines e ON e.eafya_vaccine_id = c.vaccine_id
ORDER by c.report_month, e.section_id