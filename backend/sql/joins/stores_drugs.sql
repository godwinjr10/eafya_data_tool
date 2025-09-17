select 
p.id as product_id,
l.pharmacology_id,
y."name" as prescription_category_name,
g."name" as pharmacology_name,
p."name" as product_name,
p.product_type,
c."name" as product_category_name,
i.store_id,
s."name" as store_name, 
u.name as dispensing_unit_measure,
r.name as receiving_unit_measure,
--g.dosage,
--g.route,
--g.drug_name ,
--g.duration ,
--g.frequency ,
g.prescription_category_id,
i.unit_in_stock 
from public.product p
inner join public.product_category c on c.id = p.product_category_id 
inner join public.inventory_unit u on u.id = p.dispensing_unit_id 
inner join public.inventory_unit r on r.id = p.receiving_unit_id 
inner join public.store_inventory i on i.product_id = p.id 
inner join public.store s on s.id = i.store_id 
inner join public.product_pharmacology l on l.product_id = p.id 
inner join public.pharmacology g on g.id = l.pharmacology_id 
inner join public.prescription_category y on y.id = g.prescription_category_id 
where s.id = 18
and p.product_type = 'drug'
order by y.name, p.id