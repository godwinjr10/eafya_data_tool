CREATE MATERIALIZED VIEW reporting."105_10_labtests_done" AS
select
TO_CHAR(DATE_TRUNC('month', t.date_created), 'YYYYMM') AS report_month,
t.lab_test_id as lab_test_id,
t.lab_test as lab_test_name,
COUNT(*) AS total_cases,
COUNT(CASE WHEN t.result ILIKE '%positive%' THEN 1 END) AS positive_cases
FROM reporting.patient_lab_test t
GROUP by TO_CHAR(DATE_TRUNC('month', t.date_created), 'YYYYMM'),
t.lab_test, t.lab_test_id
ORDER by report_month;


