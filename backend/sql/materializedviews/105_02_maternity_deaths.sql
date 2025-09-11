create materialized view reporting."105_02_maternity_maternal_deaths" as
SELECT
TO_CHAR(admission_date, 'YYYYMM') AS report_month,
'ND01' as hmis_code,
COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date)) < 15 THEN 1 END) AS "under_15_years",
COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date)) BETWEEN 15 AND 19 THEN 1 END) AS "15_to_19_years",
COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date)) BETWEEN 20 AND 24 THEN 1 END) AS "20_to_24_years",
COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date)) BETWEEN 25 AND 49 THEN 1 END) AS "25_to_49_years",
COUNT(CASE WHEN DATE_PART('year', AGE(admission_date, birth_date)) >= 50 THEN 1 END) AS "50_plus_years"
from reporting.maternity
where (mother_status = 'Dead')
AND admission_ward_id IN (
SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%maternity ward%' and mapping_id > 0)
GROUP by TO_CHAR(admission_date, 'YYYYMM')
ORDER by report_month;
