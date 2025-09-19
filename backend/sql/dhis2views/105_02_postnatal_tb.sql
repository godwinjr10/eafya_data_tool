CREATE VIEW reporting.postnatal_tb AS
WITH months AS (
    SELECT DISTINCT TO_CHAR(admission_date, 'YYYYMM') AS report_month
    FROM reporting.patient_postnatal
    WHERE admission_date IS NOT null
),
statuses AS (
    SELECT unnest(ARRAY['screened', 'presumed', 'diagnosed']) AS status
),
postnatal_patients AS (
    SELECT
        p.patient_id,
        p.encounter_id,
        p.admission_date,
        p.birth_date,
        TO_CHAR(p.admission_date, 'YYYYMM') AS report_month,
        DATE_PART('year', AGE(p.admission_date::date, p.birth_date::date)) AS age_years,
        e.visit_type_name
    FROM reporting.patient_postnatal p
    INNER JOIN reporting.encounters e ON p.encounter_id = e.encounter_id
    WHERE p.admission_date IS NOT NULL
      AND p.birth_date IS NOT NULL
      AND e.visit_type_name ILIKE '%postnatal%'
),
tb_lab_tests AS (
    SELECT
        plt.patient_id,
        plt.encounter_id,
        plt.lab_test,
        plt.result,
        plt.status
    FROM reporting.patient_lab_test plt
    WHERE plt.lab_test ILIKE '%TB%'
),
tb_diagnoses AS (
    SELECT DISTINCT
        pd.patient_id,
        pd.encounter_id
    FROM reporting.patient_diagnosis pd
    WHERE pd.disease_name ILIKE '%Tuberculosis%'
),
tb_status AS (
    SELECT
        pp.patient_id,
        pp.report_month,
        pp.age_years,
        CASE WHEN tb.patient_id IS NOT NULL THEN TRUE ELSE FALSE END AS screened,
        CASE WHEN tb.status ILIKE '%presumed%' OR tb.result ILIKE '%presumed%' THEN TRUE ELSE FALSE END AS presumed,
        CASE 
            WHEN tb.status ILIKE '%diagnosed%' 
                 OR tb.result ILIKE '%positive%' 
                 OR tb_diag.patient_id IS NOT NULL THEN TRUE ELSE FALSE 
        END AS diagnosed
    FROM postnatal_patients pp
    LEFT JOIN tb_lab_tests tb 
        ON pp.patient_id = tb.patient_id 
       AND pp.encounter_id = tb.encounter_id
    LEFT JOIN tb_diagnoses tb_diag 
        ON pp.patient_id = tb_diag.patient_id 
       AND pp.encounter_id = tb_diag.encounter_id
),
age_grouped AS (
    SELECT
        patient_id,
        report_month,
        CASE
            WHEN age_years < 15 THEN 'below_15yrs'
            WHEN age_years BETWEEN 15 AND 19 THEN '15_19yrs'
            WHEN age_years BETWEEN 20 AND 24 THEN '20_24yrs'
            WHEN age_years BETWEEN 25 AND 50 THEN '25_50yrs'
            ELSE '50plus'
        END AS age_group,
        screened,
        presumed,
        diagnosed
    FROM tb_status
),
unioned AS (
    SELECT report_month, 'screened' AS status, age_group, patient_id
    FROM age_grouped WHERE screened
    UNION ALL
    SELECT report_month, 'presumed' AS status, age_group, patient_id
    FROM age_grouped WHERE presumed
    UNION ALL
    SELECT report_month, 'diagnosed' AS status, age_group, patient_id
    FROM age_grouped WHERE diagnosed
),
base_grid AS (
    SELECT m.report_month, s.status
    FROM months m
    CROSS JOIN statuses s
)
SELECT
    bg.report_month,
    bg.status,
    COALESCE(COUNT(DISTINCT CASE WHEN u.age_group = 'below_15yrs' THEN u.patient_id END), 0) AS below_15yrs,
    COALESCE(COUNT(DISTINCT CASE WHEN u.age_group = '15_19yrs' THEN u.patient_id END), 0) AS "15_19yrs",
    COALESCE(COUNT(DISTINCT CASE WHEN u.age_group = '20_24yrs' THEN u.patient_id END), 0) AS "20_24yrs",
    COALESCE(COUNT(DISTINCT CASE WHEN u.age_group = '25_50yrs' THEN u.patient_id END), 0) AS "25_50yrs",
    COALESCE(COUNT(DISTINCT CASE WHEN u.age_group = '50plus' THEN u.patient_id END), 0) AS "50plus"
FROM base_grid bg
LEFT JOIN unioned u 
    ON bg.report_month = u.report_month 
   AND bg.status = u.status
GROUP BY bg.report_month, bg.status
ORDER BY bg.report_month, 
         CASE bg.status 
            WHEN 'presumed' THEN 1
            WHEN 'diagnosed' THEN 2
            WHEN 'screened' THEN 3
            ELSE 4 
         END;

