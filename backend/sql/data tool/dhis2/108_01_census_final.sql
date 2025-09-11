SELECT 
c."Report Month", 
c.dataelement_code, 
r.dataelement_name ,
r.dataelement,
r.optioncombo_name,
r.optioncombo_code ,
c.value
FROM reporting.dhis2_census_information c
inner join reporting.dhis2_dataelements_108_final r on r.dataelement_code = c.dataelement_code
where "Report Month" ='202502'