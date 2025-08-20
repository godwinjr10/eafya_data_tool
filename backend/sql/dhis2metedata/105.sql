/*** 105_01 ***/
select
d.id, 
d.dataelement, 
s.dataelement_code ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1051 d
inner join reporting.dhis2_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis2_optioncombos o on o.code = d.categoryoptioncombo 
order by s.dataelement_name

/*** 105_02 ***/
select
d.id, 
d.dataelement, 
s.dataelement_code ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1052 d
inner join reporting.dhis2_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis2_optioncombos o on o.code = d.categoryoptioncombo 
order by s.dataelement_name

/*** 105_04 ***/
select
d.id, 
d.dataelement, 
s.dataelement_code ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1054 d
inner join reporting.dhis2_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis2_optioncombos o on o.code = d.categoryoptioncombo 
order by s.dataelement_name

/*** 105_05 ***/
select
d.id, 
d.dataelement, 
s.dataelement_code ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1055 d
inner join reporting.dhis2_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis2_optioncombos o on o.code = d.categoryoptioncombo 
order by s.dataelement_name

/*** 105_06 ***/
select
d.id, 
d.dataelement, 
s.dataelement_code ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1056 d
inner join reporting.dhis2_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis2_optioncombos o on o.code = d.categoryoptioncombo 
order by s.dataelement_name