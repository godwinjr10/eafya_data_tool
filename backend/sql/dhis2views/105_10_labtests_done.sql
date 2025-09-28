CREATE VIEW reporting."105_10_labtests_done" AS
select
TO_CHAR(DATE_TRUNC('month', t.lab_test_date), 'YYYYMM') AS report_month,
t.lab_test_id as lab_test_id,
t.lab_test_name,
COUNT(*) AS total_cases,
COUNT(CASE WHEN t.result ILIKE '%positive%' THEN 1 END) AS positive_cases
FROM reporting.patient_labtests t
GROUP by TO_CHAR(DATE_TRUNC('month', t.lab_test_date), 'YYYYMM'),
t.lab_test_name, t.lab_test_id
ORDER by report_month;


