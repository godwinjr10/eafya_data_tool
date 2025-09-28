CREATE VIEW reporting."105_02_anc_bloodgroup" AS
SELECT 
TO_CHAR(l.lab_test_date, 'YYYYMM') AS report_month,
l."result",
'AN07' as hmis_code,
COUNT(*) AS count 
FROM reporting.patient_antenatal p 
inner join reporting.patient_labtests l on l.encounter_id = p.encounter_id
where l.lab_test_id IN (SELECT mapping_id FROM reporting.customizationset where name ilike '%Blood Group%' and mapping_id > 0)
and l."result" is not null
GROUP BY TO_CHAR(l.lab_test_date, 'YYYYMM'), l."result"
ORDER BY report_month DESC;