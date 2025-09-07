CREATE MATERIALIZED VIEW reporting.postnatal_attendance AS

WITH timings AS (
    SELECT '6 Days' AS timing
    UNION ALL
    SELECT '6 Weeks'
    UNION ALL
    SELECT '6 Months'
),
patient_admissions AS (
    SELECT 
        patient_id,
        admission_date,
        birth_date,
        TO_CHAR(admission_date, 'YYYYMM') AS report_month,
        CURRENT_DATE - admission_date::date AS days_since_admission,
        DATE_PART('year', AGE(admission_date::date, birth_date::date)) AS age_years
    FROM reporting.patient_postnatal
    WHERE admission_date IS NOT NULL AND birth_date IS NOT null
    AND admission_ward_id IN (SELECT mapping_id
FROM reporting.materialized_view_ids
where name ilike '%postnantal ward%' and mapping_id > 0)
),
timing_with_age AS (
    SELECT
        patient_id,
        report_month,
        CASE 
            WHEN days_since_admission BETWEEN 0 AND 6 THEN '6 Days'
            WHEN days_since_admission BETWEEN 42 AND 49 THEN '6 Weeks'
            WHEN days_since_admission BETWEEN 180 AND 210 THEN '6 Months'
            ELSE NULL
        END AS timing,
        age_years
    FROM patient_admissions
    WHERE
        days_since_admission BETWEEN 0 AND 6
        OR days_since_admission BETWEEN 42 AND 49
        OR days_since_admission BETWEEN 180 AND 210
      ),
aggregated AS (
    SELECT
        timing,
        report_month,
        COUNT(DISTINCT patient_id) AS total_patients,
        COUNT(DISTINCT CASE WHEN age_years < 15 THEN patient_id END) AS below_15yrs,
        COUNT(DISTINCT CASE WHEN age_years BETWEEN 15 AND 19 THEN patient_id END) AS between_15_19yrs,
        COUNT(DISTINCT CASE WHEN age_years BETWEEN 20 AND 24 THEN patient_id END) AS between_20_24yrs,
        COUNT(DISTINCT CASE WHEN age_years BETWEEN 25 AND 50 THEN patient_id END) AS between_25_50yrs,
        COUNT(DISTINCT CASE WHEN age_years > 50 THEN patient_id END) AS above_50yrs
    FROM timing_with_age
    WHERE timing IS NOT NULL
    GROUP BY timing, report_month
),
report_months AS (
    SELECT DISTINCT report_month FROM patient_admissions
),
timing_report_month AS (
    SELECT t.timing, rm.report_month
    FROM timings t
    CROSS JOIN report_months rm
)
SELECT
    trm.timing,
    trm.report_month,
    COALESCE(a.total_patients, 0) AS total_patients,
    COALESCE(a.below_15yrs, 0) AS below_15yrs,
    COALESCE(a.between_15_19yrs, 0) AS "15_19yrs",
    COALESCE(a.between_20_24yrs, 0) AS "20_24yrs",
    COALESCE(a.between_25_50yrs, 0) AS "25_50yrs",
    COALESCE(a.above_50yrs, 0) AS "50+yrs"
FROM timing_report_month trm
LEFT JOIN aggregated a
    ON trm.timing = a.timing AND trm.report_month = a.report_month
ORDER BY trm.report_month, trm.timing;
