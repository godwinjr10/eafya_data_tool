CREATE VIEW reporting."105_family_planning_contraceptives" AS
SELECT
    TO_CHAR(DATE_TRUNC('month', administered_on), 'YYYYMM') AS report_month,
    category,
    CASE 
        WHEN category ILIKE 'Oral Contraceptives' THEN '1.3.28'
        WHEN category ILIKE 'Injectables' THEN '1.3.29'
        WHEN category ILIKE 'Implants' THEN '1.3.30'
        WHEN category ILIKE 'IUCD' THEN '1.3.31'
        WHEN category ILIKE 'Condoms (Male)' THEN '1.3.32'
        WHEN category ILIKE 'Condoms (Female)' THEN '1.3.33'
        WHEN category ILIKE 'Tubal Ligation' THEN '1.3.34'
        WHEN category ILIKE 'Vasectomy' THEN '1.3.35'
        ELSE 'UNKNOWN'
    END AS hmis_code,
    COUNT(*) AS total_dispensed
FROM reporting.patient_family_planning
WHERE administered_on IS NOT NULL
GROUP BY DATE_TRUNC('month', administered_on), category, hmis_code
ORDER BY report_month DESC;
