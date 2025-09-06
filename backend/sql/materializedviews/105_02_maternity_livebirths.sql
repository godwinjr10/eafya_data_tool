create materialized view reporting."105_02_maternity_livebirths" as
SELECT 
TO_CHAR(admission_date, 'YYYYMM') AS report_month,
CASE 
  WHEN baby_status = 'Live Birth' THEN 'MA05a'
  WHEN baby_status = 'Fresh Still Birth' THEN 'MA05b'
  WHEN baby_status = 'Macerated Still Birth' THEN 'MA05c'
END AS hmis_code,
  COUNT(*) AS total_births,
  COUNT(CASE WHEN baby_weight IS NOT NULL AND baby_weight < 2.5 THEN 1 END) AS births_under_2_5kgs
FROM reporting.maternity
WHERE admission_date IS NOT null
AND admission_ward_id IN ('1')
AND baby_status IN ('Live Birth', 'Fresh Still Birth', 'Macerated Still Birth')
GROUP BY TO_CHAR(admission_date, 'YYYYMM'),
  CASE 
    WHEN baby_status = 'Live Birth' THEN 'MA05a'
    WHEN baby_status = 'Fresh Still Birth' THEN 'MA05b'
    WHEN baby_status = 'Macerated Still Birth' THEN 'MA05c'
  END
ORDER BY report_month, hmis_code;



