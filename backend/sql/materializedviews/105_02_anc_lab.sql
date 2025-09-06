CREATE MATERIALIZED VIEW reporting."105_02_anc_lab" AS
SELECT 
TO_CHAR(l.date_created, 'YYYYMM') AS report_month,
l."result",
'AN07' as hmis_code,
COUNT(*) AS count 
FROM reporting.patient_antenatal p 
inner join reporting.patient_lab_test l on l.encounter_id = p.encounter_id
where l.lab_test_id = 823 
AND clinic_id IN ('1')
and l."result" is not null
GROUP BY TO_CHAR(l.date_created, 'YYYYMM'), l."result"
ORDER BY report_month DESC;