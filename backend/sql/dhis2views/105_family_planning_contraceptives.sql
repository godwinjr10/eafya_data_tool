-- CREATE MATERIALIZED VIEW reporting."105_family_planning_contraceptives" AS
-- SELECT
-- TO_CHAR(DATE_TRUNC('month', fp_administered_date), 'YYYYMM') AS report_month,
-- clinic_name,
-- family_planning_name,
-- COUNT(*) AS total_dispensed
-- FROM reporting.patient_family_planning
-- WHERE fp_administered_date IS NOT NULL
-- GROUP BY DATE_TRUNC('month', fp_administered_date),clinic_name,family_planning_name
-- ORDER BY report_month DESC;
CREATE VIEW reporting."105_family_planning_contraceptives" AS
SELECT
    TO_CHAR(DATE_TRUNC('month', administered_on), 'YYYYMM') AS report_month,
    family_planning_name,
    CASE 
        WHEN family_planning_name ILIKE 'Oral Contraceptives' THEN '1.3.28'
        WHEN family_planning_name ILIKE 'Injectables' THEN '1.3.29'
        WHEN family_planning_name ILIKE 'Implants' THEN '1.3.30'
        WHEN family_planning_name ILIKE 'IUCD' THEN '1.3.31'
        WHEN family_planning_name ILIKE 'Condoms (Male)' THEN '1.3.32'
        WHEN family_planning_name ILIKE 'Condoms (Female)' THEN '1.3.33'
        WHEN family_planning_name ILIKE 'Tubal Ligation' THEN '1.3.34'
        WHEN family_planning_name ILIKE 'Vasectomy' THEN '1.3.35'
        ELSE 'UNKNOWN'
    END AS hmis_code,
    COUNT(*) AS total_dispensed
FROM reporting.patient_family_planning
WHERE fp_administered_date IS NOT NULL
GROUP BY DATE_TRUNC('month', fp_administered_on), family_planning_name, hmis_code
ORDER BY report_month DESC;
