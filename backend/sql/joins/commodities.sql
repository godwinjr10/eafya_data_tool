select 
p.id AS product_id,
m."name" as store_name,
p.name AS product_name,
i.name AS unit,
u.decrement as quantity_consumed,
u.level,
s.unit_in_stock,
u.date_created
from public.inventory_audit u
inner join public.store_inventory s on s.id = u.store_inventory_id
inner join public.store m on m.id = s.store_id
inner JOIN public.product p ON p.id = s.product_id
inner JOIN public.inventory_unit i ON i.id = p.dispensing_unit_id
inner join public.product_pharmacology y on y.product_id = s.product_id 
inner join public.pharmacology g on g.id = y.pharmacology_id 