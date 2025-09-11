SELECT 
a.report_month,
m.section_id,
m.section_name,
m.hmis_code,
m.hmis_name,
a."0-28d Male" AS "0-28d_male",
a."0-28d Female" AS "0-28d_female",
a."29d-4y Male" AS "29d-4y_male",
a."29d-4y Female" AS "29d-4y_female",
a."5-9y Male" AS "5-9y_male",
a."5-9y Female" AS "5-9y_female",
a."10-19y Male" AS "10-19y_male",
a."10-19y Female" AS "10-19y_female",
a."20y+ Male" AS "20y+_male",
a."20y+ Female" AS "20y+_female"
FROM reporting."105_01_attendance" a
JOIN (
SELECT DISTINCT 
section_id, 
section_name, 
hmis_code, 
hmis_name 
FROM reporting.dhis_eafya_mapping_conditions
WHERE section_id = '1.1' 
AND hmis_code = 'OA01'
) m ON 1=1
WHERE 1=1

---- New -----
SELECT 
c.report_month, 
c.hmis_code, 
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
FROM reporting."105_01_reattendance" c
INNER JOIN reporting.dhis_eafya_mapping_conditions_final e ON e.eafya_disease_id = c.disease_id
WHERE c.report_month = '202502'
GROUP by c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
ORDER by c.report_month, e.section_id