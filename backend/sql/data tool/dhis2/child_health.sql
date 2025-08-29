/**** DATA TOOL 105 Conditions Report Script ****/
SELECT
c.report_month,
e.section_id,
e.section_name,
e.hmis_code,
e.hmis_name,
SUM(COALESCE(c."0-5m Male", 0)) AS "0_5m_male",
SUM(COALESCE(c."0-5m Female", 0)) AS "0_5m_female",
SUM(COALESCE(c."6-11m Male", 0)) AS "6_11m_male",
SUM(COALESCE(c."6-11m Female", 0)) AS "6_11m_female",
SUM(COALESCE(c."12-59m Male", 0)) AS "12_59m_male",
SUM(COALESCE(c."12-59m Female", 0)) AS "12_59m_female",
SUM(COALESCE(c."5-14y Male", 0)) AS "5_14y_male",
SUM(COALESCE(c."5-14y Female", 0)) AS "5_14y_female"
FROM reporting."105_02_child_health" c
INNER JOIN reporting.dhis_eafya_mapping_vaccines e ON e.eafya_vaccine_id = c.vaccine_id
WHERE c.report_month = '202502'
GROUP by c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
ORDER by c.report_month, e.section_id