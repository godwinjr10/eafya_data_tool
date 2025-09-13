/*** 105_01 ***/
select
d.id, 
d.dataelement, 
s.dataelement_id ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1051 d
inner join reporting.dhis_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis_optioncombos o on o.code = d.categoryoptioncombo 
where dataelement = 'sv6SeKroHPV'
order by s.dataelement_name

/*** 105_02 ***/
select
d.id, 
d.dataelement, 
s.dataelement_id  ,
s.dataelement_name ,
d.categoryoptioncombo,
o."name" as optioncombo_name
FROM reporting.dhis2_dataelements_1052 d
inner join reporting.dhis_datasets_elements s on s.dataelement_id = d.dataelement 
inner join  reporting.dhis_optioncombos o on o.code = d.categoryoptioncombo 
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

/**** Update Scripts ****/
SELECT dataset_code, section_id, id, dataelement_id, dataelement_code, dataelement_name
FROM reporting.dhis2_datasets_elements
where section_id is not null
order by dataelement_code


SELECT distinct dataset_code FROM reporting.dhis2_datasets_elements
where section_id is not null
order by dataelement_code

select distinct section_id from reporting.dhis2_datasets_elements

update reporting.dhis2_datasets_elements set section_id = '10.2'
where id in (SELECT id FROM reporting.dhis2_datasets_elements where dataset_code = 'HMIS1055' and dataelement_code ilike '%CS%')