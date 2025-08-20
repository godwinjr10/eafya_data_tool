SELECT
--  TO_CHAR(DATE_TRUNC('month', a.last_updated), 'YYYY-MM') AS report_month,
a.date_created,
a.last_updated,
  s.name AS store_name,
  p.id as product_id,
  p.name AS product_name,
  a.level,
  a.increment,
  a.decrement
 -- COUNT(DISTINCT DATE(a.last_updated)) FILTER (WHERE a.level = 0) AS days_out_of_stock
FROM public.inventory_audit a
INNER JOIN public.store_inventory si ON si.id = a.store_inventory_id
INNER JOIN public.store s ON s.id = si.store_id
INNER JOIN public.product p ON p.id = si.product_id
where
a.last_updated IS NOT null
and s.id='32' 
--and a.level=0 
and p.id ='678'
--and a.last_updated BETWEEN '2025-05-01' AND '2025-05-31'
--GROUP BY
--  TO_CHAR(DATE_TRUNC('month', a.last_updated), 'YYYY-MM'),
--  s.name,
--  p.id,
--  p.name
ORDER BY a.date_created, s.name, p.name;