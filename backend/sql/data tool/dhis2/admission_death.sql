/*** DATA TOOL 108 Admission & Death Report Script ***/
SELECT
    c.report_month,
    e.section_id,
    e.section_name,
    e.hmis_code,
    e.hmis_name,
    -- Cases
    SUM(COALESCE(c."0-4years Male Cases", 0)) AS "0_4y_male_cases",
    SUM(COALESCE(c."0-4years female Cases", 0)) AS "0_4y_female_cases",
    SUM(COALESCE(c."5years+ Male Cases", 0)) AS "5y_plus_male_cases",
    SUM(COALESCE(c."5years+ female Cases", 0)) AS "5y_plus_female_cases",
    -- Deaths
    SUM(COALESCE(c."0-4years Male Deaths", 0)) AS "0_4y_male_deaths",
    SUM(COALESCE(c."0-4years female Deaths", 0)) AS "0_4y_female_deaths",
    SUM(COALESCE(c."5years+ Male Deaths", 0)) AS "5y_plus_male_deaths",
    SUM(COALESCE(c."5years+ female Deaths", 0)) AS "5y_plus_female_deaths"
FROM reporting."108_admission_death" c
INNER JOIN reporting.dhis_eafya_mapping_conditions_final e
ON c.disease_id = e.eafya_disease_id
--WHERE c.report_month = '202508'  
GROUP BY c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
ORDER BY c.report_month, e.section_id;
