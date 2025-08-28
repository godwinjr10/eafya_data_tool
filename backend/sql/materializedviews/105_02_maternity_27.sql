create materialized view reporting."105_02_maternity_women_received_uterotonics_mgt_labour" as
SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    ward_name,
        COUNT(DISTINCT CASE WHEN drugs_given ILIKE '%oxytocin%' THEN patient_id END) AS received_oxytocin,
    COUNT(DISTINCT CASE WHEN drugs_given ILIKE '%misoprostol%' THEN patient_id END) AS received_misoprostol,
    COUNT(DISTINCT CASE WHEN drugs_given ILIKE '%heat stable carbetocin%' THEN patient_id END) AS received_heat_stable_carbetocin,
    COUNT(DISTINCT CASE WHEN drugs_given ILIKE ANY(ARRAY['%ergometrine%','%methylergonovine%']) THEN patient_id END) AS received_ergometrine
   FROM
    reporting.maternity
WHERE
    ward_name = 'MATERNITY'
       AND drugs_given IS NOT NULL
    AND drugs_given != ''  -- Exclude empty entries
GROUP BY
    TO_CHAR(admission_date, 'YYYYMM'),
    ward_name
ORDER BY
    report_month;