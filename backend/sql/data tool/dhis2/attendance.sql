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