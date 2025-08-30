
CREATE MATERIALIZED VIEW reporting."105_02_antenatal_10" AS
WITH supplements AS (
    SELECT 
        patient_id,
        DATE_PART('year', AGE(birth_date))::int AS age,
        DATE_TRUNC('month', date_created) AS report_month,
        'AN10' AS hmis_code,
        drug_name,
        dosage,
        duration,
        frequency
    FROM reporting.patient_prescription
    WHERE drug_name ILIKE '%folic%'
      AND clinic_session_id IS NOT NULL
      AND visit_type_name ILIKE '%Maternal%'
)
SELECT 
    TO_CHAR(report_month, 'YYYYMM') AS report_month,
    hmis_code,

    -- classify into HMIS categories
    CASE 
        WHEN drug_name ILIKE '%iron%' THEN 'Iron & Folic Acid (13+ weeks)'
        ELSE 'Folic Acid (0-12 weeks)'
    END AS supplement_category,

    -- age group buckets
    COUNT(DISTINCT CASE WHEN age < 15 THEN patient_id END)     AS below_15,
    COUNT(DISTINCT CASE WHEN age BETWEEN 15 AND 19 THEN patient_id END) AS age_15_19,
    COUNT(DISTINCT CASE WHEN age BETWEEN 20 AND 24 THEN patient_id END) AS age_20_24,
    COUNT(DISTINCT CASE WHEN age BETWEEN 25 AND 49 THEN patient_id END) AS age_25_49,
    COUNT(DISTINCT CASE WHEN age >= 50 THEN patient_id END)    AS age_50_plus,
    COUNT(DISTINCT patient_id) AS total
FROM supplements
-- ensure at least 30 tablets issued (basic heuristic: duration or dosage should reflect)
WHERE (duration ILIKE '%30%' OR duration ILIKE '%1/12%' OR duration ILIKE '%month%')
GROUP BY report_month, hmis_code, supplement_category
ORDER BY report_month DESC, supplement_category;



