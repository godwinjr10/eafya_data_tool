SELECT 
a.report_month,
m.section_id,
m.section_name,
m.hmis_code,
m.hmis_name,
a."0-28d Male" AS "0-28d_male",
a."0-28d Female" AS "0-28d_female",
a."29d-4y Male" AS "29d-4y_male",
a."29d-4y Female" AS "29d-4y_female",
a."5-9y Male" AS "5-9y_male",
a."5-9y Female" AS "5-9y_female",
a."10-19y Male" AS "10-19y_male",
a."10-19y Female" AS "10-19y_female",
a."20y+ Male" AS "20y+_male",
a."20y+ Female" AS "20y+_female"
FROM reporting."105_01_attendance" a
JOIN (
SELECT DISTINCT 
section_id, 
section_name, 
hmis_code, 
hmis_name 
FROM reporting.dhis_eafya_mapping_conditions
WHERE section_id = '1.1' 
AND hmis_code = 'OA01'
) m ON 1=1
WHERE 1=1

SELECT 
a.report_month,
a."0-28d Male" AS "0-28d_male",
a."0-28d Female" AS "0-28d_female",
a."29d-4y Male" AS "29d-4y_male",
a."29d-4y Female" AS "29d-4y_female",
a."5-9y Male" AS "5-9y_male",
a."5-9y Female" AS "5-9y_female",
a."10-19y Male" AS "10-19y_male",
a."10-19y Female" AS "10-19y_female",
a."20y+ Male" AS "20y+_male",
a."20y+ Female" AS "20y+_female"
FROM reporting."105_01_attendance" a

---- DHIS2 PUSH ATTENDANCE -----
select 
  c.report_month, 
  c.dataelement, 
  s.dataelement_name,
  d.categoryoptioncombo,
  o."name" as optioncombo_name,
  case d.categoryoptioncombo
      when 'zh2zAaHyYQx' then coalesce(c."0-28d Male", 0)
      when 'wDiX34aiw6i' then coalesce(c."0-28d Female", 0)
      when 'V2OuNTRI6ua' then coalesce(c."29d-4y Male", 0)
      when 'huBy3W5qiD2' then coalesce(c."29d-4y Female", 0)
      when 'F1rms8f9I9a' then coalesce(c."5-9y Male", 0)
      when 'Crc5reUlspd' then coalesce(c."5-9y Female", 0)
      when 'c7gvocRdg0f' then coalesce(c."10-19y Male", 0)
      when 'u3CkZqMHfHP' then coalesce(c."10-19y Female", 0)
      when 'dCKzhhINakS' then coalesce(c."20y+ Male", 0)
      when 'XVHTeecEOM3' then coalesce(c."20y+ Female", 0)
      else 0
  end as value
from reporting."105_01_attendance" c
inner join reporting.dhis2_dataelements_1051 d on d.dataelement = c.dataelement
inner join reporting.dhis_datasets_elements s on s.dataelement_id = d.dataelement 
inner join reporting.dhis_optioncombos o on o.code = d.categoryoptioncombo 
where c.report_month = '202502'
order by c.report_month, d.categoryoptioncombo;

---- DHIS2 PUSH REATTENDANCE -----
select 
  c.report_month, 
  c.dataelement, 
  s.dataelement_name,
  d.categoryoptioncombo,
  o."name" as optioncombo_name,
  case d.categoryoptioncombo
      when 'zh2zAaHyYQx' then coalesce(c."0-28d Male", 0)
      when 'wDiX34aiw6i' then coalesce(c."0-28d Female", 0)
      when 'V2OuNTRI6ua' then coalesce(c."29d-4y Male", 0)
      when 'huBy3W5qiD2' then coalesce(c."29d-4y Female", 0)
      when 'F1rms8f9I9a' then coalesce(c."5-9y Male", 0)
      when 'Crc5reUlspd' then coalesce(c."5-9y Female", 0)
      when 'c7gvocRdg0f' then coalesce(c."10-19y Male", 0)
      when 'u3CkZqMHfHP' then coalesce(c."10-19y Female", 0)
      when 'dCKzhhINakS' then coalesce(c."20y+ Male", 0)
      when 'XVHTeecEOM3' then coalesce(c."20y+ Female", 0)
      else 0
  end as value
from reporting."105_01_reattendance" c
inner join reporting.dhis2_dataelements_1051 d on d.dataelement = c.dataelement
inner join reporting.dhis_datasets_elements s on s.dataelement_id = d.dataelement 
inner join reporting.dhis_optioncombos o on o.code = d.categoryoptioncombo 
where c.report_month = '202505'
order by c.report_month, d.categoryoptioncombo;