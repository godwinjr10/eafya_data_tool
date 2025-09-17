create view reporting.commodities as 
SELECT
    m.id AS store_id,
    m.name AS store_name,
    p.id AS product_id,
    p.name AS product_name,
    p.product_type,
    u.increment,
    u.decrement,
    u.level,
    u.created_by_id,
    u.date_created,
    u.last_updated
FROM dwh.fact_eafya_inventory_audit u
INNER JOIN dwh.fact_eafya_store_inventory s ON s.id = u.store_inventory_id
INNER JOIN dwh.dim_eafya_store m ON m.id = s.store_id
INNER JOIN dwh.dim_eafya_product p ON p.id = s.product_id
where m.id in (SELECT mapping_id FROM reporting.materialized_view_ids where name ilike '%Main Store%' and mapping_id > 0)