select
d.id, 
d.dataelement, 
s.dataelement_code ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_108 d
inner join reporting.dhis2_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis2_optioncombos o on o.code = d.categoryoptioncombo 

SELECT id, code, "name" FROM reporting.dhis2_optioncombos;

SELECT id, dataset_id, dataset_code, dataset_name, dataelement_id, dataelement_code, dataelement_name, created_at
FROM reporting.dhis2_datasets_elements

SELECT id, code, "name" FROM reporting.dhis2_datasets;


SELECT 
a.id, 
a.code, 
a.name, 
a.status, 
a."level", 
a.objectives, 
a.costugx, 
a.costusd, 
a.rate, 
a.months, 
a."pillarId", 
p."name" as component,
a."implementorId", 
i."name" as implementor,
a."grantId",
g."name" as grant
FROM  workplan.activity a
inner join workplan.pillar p on p.id = a."grantId" 
inner join workplan.grant g on g.id = a."grantId" 
inner join workplan.implementor i on i.id = a."implementorId" 


select count(*) from workplan.activity;
select sum(costusd) from workplan.activity;
select sum(costugx) from workplan.activity;

select 
status, 
count(name) 
from workplan.activity
group by status
