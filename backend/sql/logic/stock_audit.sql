SELECT store_id, store_name, product_id, product_name, product_type, "increment", decrement, "level", created_by_id, first_name, last_name, "role", date_created, last_updated
FROM reporting.commodities;

---- Days out of Stock --- level
SELECT
TO_CHAR(DATE_TRUNC('month', c.last_updated), 'YYYYMM') AS report_month,
c.store_name,
c.product_id,
c.product_name,
COUNT(DISTINCT DATE(c.last_updated)) FILTER (WHERE c.level = 0) AS days_out_of_stock
FROM reporting.commodities c
where c.last_updated IS NOT null
and c.store_id ='32' 
and c.level=0 
--and p.id ='678'
and c.last_updated BETWEEN '2025-05-01' AND '2025-05-31'
GROUP by TO_CHAR(DATE_TRUNC('month', c.last_updated), 'YYYYMM'), c.store_name, c.product_id, c.product_name, c."level" 
ORDER BY report_month, c.store_name, c.product_id, c.product_name

---- Qutatnity Consumed --- level
SELECT
TO_CHAR(c.date_created, 'YYYYMM') as report_month,
c.store_name,
c.product_id,
c.product_name,
SUM(c.decrement) as qty_consumed
from reporting.commodities c
where c."level" <> 0 
and c.store_id ='32'
--  and p.id = '726' 
and c.date_created BETWEEN '2025-05-01' AND '2025-05-31'
and c.decrement is not null
group by TO_CHAR(c.date_created, 'YYYYMM'), c.store_name, c.product_id, c.product_name
order by report_month desc

---- Stock --- level
SELECT DISTINCT ON (store_name, product_id)
TO_CHAR(date_created, 'YYYYMM') AS report_month,
store_name,
product_id,
product_name,
level as stock_level
FROM reporting.commodities
WHERE date_created BETWEEN '2025-05-01' AND '2025-05-31'
AND store_name = 'PHARMACY STORE'
--AND product_id = 726
ORDER BY store_name, product_id, date_created DESC;
