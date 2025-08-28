SELECT 
TO_CHAR(l.date_created, 'YYYYMM') AS report_month,
l."result",
'AN07' as hmis_code,
COUNT(*) AS count 
FROM reporting.patient_antenatal p 
inner join reporting.patient_lab_test l on l.encounter_id = p.encounter_id
where l.lab_test_id = 823 
and l."result" is not null
GROUP BY TO_CHAR(l.date_created, 'YYYYMM'), l."result"
ORDER BY report_month DESC;


select * from dwh.dim_eafya_pharmacology where name ilike '%fansider%'
select * from dwh.dim_eafya_product where name ilike '%fansider%'
select * from dwh.dim_eafya_disease where name ilike '%Anaemia%'