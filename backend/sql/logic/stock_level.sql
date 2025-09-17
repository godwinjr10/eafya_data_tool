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