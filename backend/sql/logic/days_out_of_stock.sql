SELECT
TO_CHAR(DATE_TRUNC('month', c.last_updated), 'YYYYMM') AS report_month,
c.store_name,
c.product_id,
c.product_name,
c."level",
COUNT(DISTINCT DATE(c.last_updated)) FILTER (WHERE c.level = 0) AS days_out_of_stock
FROM reporting.commodities c
where c.last_updated IS NOT null
and c.store_id ='32' 
and c.level=0 
--and p.id ='678'
and c.last_updated BETWEEN '2025-05-01' AND '2025-05-31'
GROUP by TO_CHAR(DATE_TRUNC('month', c.last_updated), 'YYYYMM'), c.store_name, c.product_id, c.product_name, c."level" 
ORDER BY report_month, c.store_name, c.product_id, c.product_name