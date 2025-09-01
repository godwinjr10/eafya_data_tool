/*** DATA TOOL 108 Maternal Conditions Report Script ***/
SELECT
    c.report_month,
    e.section_id,
    e.section_name,
    e.hmis_code,
    e.hmis_name,
     -- Cases
    SUM(COALESCE(c."Cases Below 15 Years", 0)) AS "below_15y_cases",
    SUM(COALESCE(c."Cases 15-19 Years", 0)) AS "15_19y_cases",
    SUM(COALESCE(c."Cases 20-24 Years", 0)) AS "20_24y_cases",
    SUM(COALESCE(c."Cases 25-49 Years", 0)) AS "25_49y_cases",
    SUM(COALESCE(c."Cases 50+ Years", 0)) AS "50_plus_y_cases",
    -- Deaths
    SUM(COALESCE(c."Deaths Below 15 Years", 0)) AS "below_15y_deaths",
    SUM(COALESCE(c."Deaths 15-19 Years", 0)) AS "15_19y_deaths",
    SUM(COALESCE(c."Deaths 20-24 Years", 0)) AS "20_24y_deaths",
    SUM(COALESCE(c."Deaths 25-49 Years", 0)) AS "25_49y_deaths",
    SUM(COALESCE(c."Deaths 50+ Years", 0)) AS "50_plus_y_deaths"
FROM reporting."108_maternal_conditions" c
INNER JOIN reporting.dhis_eafya_mapping_conditions_final e ON c.disease_id = e.eafya_disease_id
-- WHERE c.report_month = '202508'
GROUP BY c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
ORDER BY c.report_month, e.section_id;
