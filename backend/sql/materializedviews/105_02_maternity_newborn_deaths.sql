create materialized view reporting."105_02_maternity_newborn_deaths" as
SELECT
    TO_CHAR(admission_date, 'YYYY-MM') AS report_month,
    COUNT(*) AS newborn_deaths
FROM
    reporting.maternity
WHERE
    ward_name = 'MATERNITY'
    AND baby_status in ('Fresh Still Birth', 'Macerated Still Birth')
GROUP BY
    TO_CHAR(admission_date, 'YYYY-MM')
ORDER BY
    report_month;