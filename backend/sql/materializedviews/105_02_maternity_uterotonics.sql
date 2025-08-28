create materialized view reporting."105_02_maternity_uterotonics" as
SELECT
TO_CHAR(admission_date, 'YYYYMM') AS report_month,
'MA27' as hmis_code,
COUNT(DISTINCT CASE WHEN drugs_given ILIKE '%oxytocin%' THEN patient_id END) AS oxytocin,
COUNT(DISTINCT CASE WHEN drugs_given ILIKE '%misoprostol%' THEN patient_id END) AS misoprostol,
COUNT(DISTINCT CASE WHEN drugs_given ILIKE '%heat stable carbetocin%' THEN patient_id END) AS carbetocin,
COUNT(DISTINCT CASE WHEN drugs_given ILIKE ANY(ARRAY['%ergometrine%','%methylergonovine%']) THEN patient_id END) AS ergometrine
from reporting.maternity
where drugs_given IS NOT NULL
AND drugs_given != ''  -- Exclude empty entries
GROUP by TO_CHAR(admission_date, 'YYYYMM')
ORDER by report_month;