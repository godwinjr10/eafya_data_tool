CREATE MATERIALIZED VIEW reporting."105_02_anc_bloodgroup" AS
SELECT
TO_CHAR(DATE_TRUNC('month', lab_test_date), 'YYYYMM') AS report_month,
"result"                                              AS blood_group,
COUNT(*)                                              AS total_tests
FROM reporting.patient_labtests
WHERE clinic_id IN (SELECT mapping_id FROM reporting.materialized_view_ids WHERE name ILIKE '%antenatal%' AND mapping_id > 0)
AND gender = 'Female'
AND origin = 'op'
AND lab_test_name ILIKE '%Blood Group%'
AND "result" IS NOT NULL
GROUP BY 1, 2
ORDER BY 1, 2;