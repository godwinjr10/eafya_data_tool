create materialized view reporting."105_02_maternity_live_babies_resuscitated" as
SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS report_month,
    ward_name,
    COUNT(*) AS total_babies_resuscitated
FROM
    reporting.maternity
WHERE
    ward_name = 'MATERNITY'
    AND resuscitation = TRUE
GROUP BY
    TO_CHAR(admission_date, 'YYYYMM'),
    ward_name
ORDER BY
    report_month,
    ward_name;