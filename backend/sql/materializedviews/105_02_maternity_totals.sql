create materialized view reporting."105_02_maternity_totals" as
WITH ma01 AS (
  SELECT 
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MA01'::text AS hmis_code,
    'total_admissions' as indicator,
    COUNT(patient_id)::bigint AS value
  FROM reporting.maternity
  GROUP BY TO_CHAR(admission_date, 'YYYYMM')
),
ma08 AS (
  SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MA08'::text AS hmis_code,
    'babies_under_2_5kg' as indicator,
    COUNT(*)::bigint AS value
  FROM reporting.maternity
  WHERE baby_weight IS NOT NULL AND baby_weight > 0 AND baby_weight < 2.5
  AND admission_ward_id  IN (
SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%maternity ward%' and mapping_id > 0)
  GROUP BY TO_CHAR(admission_date, 'YYYYMM')
),
ma09 AS (
  SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MA09'::text AS hmis_code,
    'live_babies' as indicator,
    COUNT(*)::bigint AS value
  FROM reporting.maternity
  WHERE admission_date IS NOT NULL
    AND baby_status = 'Live Birth'
    AND admission_ward_id  IN (
SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%maternity ward%' and mapping_id > 0)
  GROUP BY TO_CHAR(admission_date, 'YYYYMM')
),
ma11 AS (
  SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MA11'::text AS hmis_code,
    'Birth_with_Deformities' as indicator,
    COUNT(*)::bigint AS value
  FROM reporting.maternity
  WHERE admission_date IS NOT NULL
    AND baby_status = 'Birth with Deformities'
    AND admission_ward_id  IN (
SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%maternity ward%' and mapping_id > 0)
  GROUP BY TO_CHAR(admission_date, 'YYYYMM')
),
ma12 AS (
  SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MA12'::text AS hmis_code,
    'newborn_deaths' as indicator,
    COUNT(*)::bigint AS value
  FROM reporting.maternity
  WHERE baby_status IN ('Fresh Still Birth', 'Macerated Still Birth')
  AND admission_ward_id  IN (
SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%maternity ward%' and mapping_id > 0)
  GROUP BY TO_CHAR(admission_date, 'YYYYMM')
),
ma23 AS (
  SELECT
    TO_CHAR(date_created, 'YYYYMM') AS report_month,
    'MA23'::text AS hmis_code,
    'babies_asphyxia' as indicator,
    COUNT(*)::bigint AS value
  FROM reporting.patient_diagnosis
  WHERE date_created IS NOT null
    AND classification = 'Confirmed'
    AND disease_name ILIKE '%asphyxia%'
  GROUP BY TO_CHAR(date_created, 'YYYYMM')
),
ma24 AS (
  SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    'MA24'::text AS hmis_code,
    'resuscitated' as indicator,
    COUNT(*)::bigint AS value
  FROM reporting.maternity
  WHERE resuscitation = true
  AND admission_ward_id  IN (
SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%maternity ward%' and mapping_id > 0)
  GROUP BY TO_CHAR(admission_date, 'YYYYMM')
)
SELECT * FROM ma01
UNION ALL SELECT * FROM ma08
UNION ALL SELECT * FROM ma09
UNION ALL SELECT * FROM ma11
UNION ALL SELECT * FROM ma12
UNION ALL SELECT * FROM ma23
UNION ALL SELECT * FROM ma24
ORDER BY report_month, hmis_code;