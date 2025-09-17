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