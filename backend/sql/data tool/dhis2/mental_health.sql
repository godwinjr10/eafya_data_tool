/*** DATA TOOL 108 Mental Health Report Script ***/
SELECT
    c.report_month,
    e.section_id,
    e.section_name,
    e.hmis_code,
    e.hmis_name,
    -- Cases by age & gender
    SUM(COALESCE(c."<5Y Male", 0)) AS "lt5y_male_cases",
    SUM(COALESCE(c."<5Y Female", 0)) AS "lt5y_female_cases",
    SUM(COALESCE(c."5-9Y Male", 0)) AS "5_9y_male_cases",
    SUM(COALESCE(c."5-9Y Female", 0)) AS "5_9y_female_cases",
    SUM(COALESCE(c."10-19Y Male", 0)) AS "10_19y_male_cases",
    SUM(COALESCE(c."10-19Y Female", 0)) AS "10_19y_female_cases",
    SUM(COALESCE(c."20-34Y Male", 0)) AS "20_34y_male_cases",
    SUM(COALESCE(c."20-34Y Female", 0)) AS "20_34y_female_cases",
    SUM(COALESCE(c."35-59Y Male", 0)) AS "35_59y_male_cases",
    SUM(COALESCE(c."35-59Y Female", 0)) AS "35_59y_female_cases",
    SUM(COALESCE(c."60+Y Male", 0)) AS "60_plus_male_cases",
    SUM(COALESCE(c."60+Y Female", 0)) AS "60_plus_female_cases"
FROM reporting."108_mental_health" c
INNER JOIN reporting.dhis_eafya_mapping_conditions_final e ON c.disease_id = e.eafya_disease_id
-- WHERE c.report_month = '202508'
GROUP BY c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
ORDER BY c.report_month, e.section_id;
