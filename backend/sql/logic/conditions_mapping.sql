SELECT 
i.moh_report_group_id as hmis_code,
g."name" as hmis_name,
g.parent_id ,
i.disease_id as eafya_disease_id, 
(select id, name from public.moh_report_group g where parent_id = 0 and g.id=i.moh_report_group_id ) as section_name,
d.name as eafya_disease_name
FROM public.moh_report_item i
inner join public.moh_report_group g on g.id = i.moh_report_group_id 
inner join public.disease d on d.id = i.disease_id 
--where g.parent_id = 151
where g.parent_id <> 0
order by i.moh_report_group_id