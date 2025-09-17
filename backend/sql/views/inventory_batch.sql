create view reporting.inventory_batch as
select
u.store_id,
m.name AS store_name,
u.batch_number,
u.product_id,
p.name AS product_name,
p.product_type ,
u.unit_in_stock,
u.date_created,
u.last_updated,
u.expiry_date
FROM dwh.fact_eafya_inventory_batch_level u
INNER JOIN dwh.dim_eafya_store m ON m.id = u.store_id
INNER JOIN dwh.dim_eafya_product p ON p.id = u.product_id
ORDER BY u.date_created DESC;