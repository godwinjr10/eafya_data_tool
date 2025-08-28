CREATE MATERIALIZED VIEW reporting."105_family_planning_contraceptives" AS
SELECT
TO_CHAR(DATE_TRUNC('month', fp_administered_date), 'YYYYMM') AS report_month,
clinic_name,
family_planning_name,
COUNT(*) AS total_dispensed
FROM reporting.patient_family_planning
WHERE fp_administered_date IS NOT NULL
GROUP BY DATE_TRUNC('month', fp_administered_date),clinic_name,family_planning_name
ORDER BY report_month DESC;






