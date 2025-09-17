select 
d.id as eafya_disease_id,
d."name" as eafya_disease_name,
REPLACE(m.hmis_code, '105-', '') as hmis_code,
m.hmis_condition ,
--d.five_character_icd_code,
m.icd_10_code,
m.icd_10_description,
m.icd_ll_code ,
m.icd_ll_description
from disease d 
inner join reporting.eafya_hmis_icd_mapping m on m.icd_10_code = d.five_character_icd_code 
order by hmis_code

---- ICD 11 codes
create table reporting.eafya_disease_icd_mapping as
select 
d.id as eafya_disease_id,
d."name" as eafya_disease_name,
REPLACE(m.hmis_code, '105-', '') as hmis_code,
m.hmis_condition ,
--d.five_character_icd_code,
m.icd_10_code,
m.icd_10_description,
m.icd_ll_code ,
m.icd_ll_description
from disease d 
inner join reporting.eafya_hmis_icd_mapping m on m.icd_ll_code = d.five_character_icd_code 
order by hmis_code