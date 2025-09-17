select 
c.name as lab_test_category,
l.name as lab_test,
l.id as lab_test_id,
l.parent_id,
s."name" as parent_test_name,
p.date_created,
p.status as lab_test_status,
p.result as lab_test_result
from dwh.fact_eafya_patient_lab_test p 
inner join dwh.dim_eafya_lab_test l on p.lab_test_id = l.id
inner join dwh.dim_eafya_lab_test_category c on l.lab_test_category_id = c.id
inner join dwh.dim_eafya_lab_tests_parent s on s.id = l.parent_id 
where l.parent_id  = 409

------------------ Lab Test Parent with components
select 
c.name as lab_test_category,
l.parent_id,
s."name" as parent_test_name,
l.name as lab_test,
l.id as lab_test_id
from dwh.dim_eafya_lab_test l
inner join dwh.dim_eafya_lab_test_category c on l.lab_test_category_id = c.id
inner join dwh.dim_eafya_lab_tests_parent s on s.id = l.parent_id 
order by s.id 


------------- 
select 
c.id,
c.name as lab_test_category,
l.id as lab_test_id,
l.name as lab_test,
l.parent_id,
s."name" as parent_test_name,
l.code ,
l.code_name ,
l.code_url 
from dwh.dim_eafya_lab_test l 
inner join dwh.dim_eafya_lab_test_category c on l.lab_test_category_id = c.id
left outer join dwh.dim_eafya_lab_tests_parent s on s.id = l.parent_id 
order by c.id, l.id