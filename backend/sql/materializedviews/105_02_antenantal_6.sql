CREATE MATERIALIZED VIEW reporting."105_02_antenantal_6" AS
WITH ipt_prescriptions AS (
    SELECT 
        patient_id,
        DATE_PART('year', AGE(birth_date))::int AS age,
        DATE_TRUNC('month', date_created) AS report_month,
        'AN06' as hmis_code,
        ROW_NUMBER() OVER (
            PARTITION BY patient_id 
            ORDER BY date_created ASC
        ) AS ipt_dose_number
    FROM reporting.patient_prescription
    WHERE drug_name ILIKE '%FANSIDAR%'
      AND visit_type_name ILIKE '%Maternal%'
      AND clinic_session_id IS NOT NULL
)
SELECT 
    TO_CHAR(report_month, 'YYYYMM') AS report_month,
    hmis_code,
    CASE 
        WHEN ipt_dose_number = 1 THEN 'IPT1'
        WHEN ipt_dose_number = 2 THEN 'IPT2'
        WHEN ipt_dose_number = 3 THEN 'IPT3'
        ELSE 'IPT4+'
    END AS ipt_dose_group,

    -- Pivot-style aggregation for age groups
    COUNT(DISTINCT CASE WHEN age < 15 THEN patient_id END)     AS below_15,
    COUNT(DISTINCT CASE WHEN age BETWEEN 15 AND 19 THEN patient_id END) AS age_15_19,
    COUNT(DISTINCT CASE WHEN age BETWEEN 20 AND 24 THEN patient_id END) AS age_20_24,
    COUNT(DISTINCT CASE WHEN age BETWEEN 25 AND 49 THEN patient_id END) AS age_25_49,
    COUNT(DISTINCT CASE WHEN age >= 50 THEN patient_id END)    AS age_50_plus,
    COUNT(DISTINCT patient_id) AS total
FROM ipt_prescriptions
GROUP BY report_month, hmis_code, ipt_dose_group
ORDER BY report_month DESC, ipt_dose_group;
