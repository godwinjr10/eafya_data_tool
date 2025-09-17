select 
TO_CHAR(u.expiry_date , 'YYYYMM') as report_month,
u.store_name,
u.product_id,
u.product_name,
u.batch_number,
SUM(u.unit_in_stock) AS quantity_expired
from reporting.inventory_batch u
where u.store_id  = '32' 
and u.expiry_date IS NOT NULL
AND u.unit_in_stock > 0
AND u.expiry_date <= CURRENT_DATE
and u.expiry_date BETWEEN '2025-05-01' AND '2025-05-31'
group by TO_CHAR(u.expiry_date, 'YYYYMM'),  u.store_name, u.product_id, u.product_name, u.batch_number, u.expiry_date, u.unit_in_stock
order by report_month desc

select * from public.inventory_batch_level
where expiry_date < CURRENT_DATE 
and TO_CHAR(expiry_date, 'YYYY')='2025'
and expiry_date BETWEEN '2025-05-01' AND '2025-05-31'