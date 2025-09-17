select 
u.id as inventory_audit_id,
u.created_by_id as inventory_audit_created_by_id,
u.date_created as inventory_audit_date_created,
u.decrement as inventory_audit_decrement,
u.description as inventory_audit_description,
u.increment as inventory_audit_increment,
u.level as inventory_audit_level,
------------------------------------------------------------------------------------------------
s.id as store_inventory_id,
s.date_created as store_inventory_date_created,
s.replenishment_level as store_inventory_replenishment_level,
s.unit_in_stock as store_inventory_unit_in_stock,
--------------------------------------------------------------------------------------------
m.id as store_id,
m.date_created as store_date_created,
m.created_by_id as store_created_by_id,
m.name as store_name,
m.parent_id as store_parent_id,
m.stock_control_account_id as store_stock_control_account_id,
m.adjustment_control_ledger_id as store_adjustment_control_ledger_id,
--------------------------------------------------------------------------------------------------
p.id as product_id,
p.product_category_id as product_category_id,
p.date_created as product_date_created,
p.created_by_id as product_created_by_id,
p.dispensing_unit_id as product_dispensing_unit_id,
p.is_available as product_is_available,
p.is_cost_fixed as product_is_cost_fixed,
p.name as product_name,
p.product_type,
p.qty_per_unit as product_qty_per_unit,
p.receiving_unit_id as product_receiving_unit_id,
p.sku as product_sku,
p.unit_selling_price as product_unit_selling_price,
p.vat_class_id as product_vat_class_id,
-------------------------------------------------------------------------------------------------------
i.id as inventory_unit_id,
i.name as inventory_unit_name,
i.date_created as inventory_unit_date_created,
i.created_by_id as inventory_unit_created_by_id,
i.quantity as inventory_unit_quantity,
-----------------------------------------------------------------------------------------------------
b.id as inventory_batch_level_id,
b.batch_number as inventory_batch_number,
b.date_created as inventory_batch_level_date_created,
b.created_by_id as inventory_batch_level_created_by_id,
b.expiry_date as inventory_batch_level_expiry_date,
b.last_updated as inventory_batch_level_last_updated,
b.store_receipt_item_id as inventory_batch_level_store_receipt_item_id,
b.unit_in_stock as inventory_batch_level_unit_in_stock,
b.unit_selling_price as inventory_batch_level_unit_selling_price,
b.voucher_line_id as inventory_batch_level_voucher_line_id
--------------------------------------------------------------------------------------------------------
from public.inventory_audit u
inner join public.store_inventory s on s.id = u.store_inventory_id
inner join public.store m on m.id = s.store_id
inner JOIN public.product p ON p.id = s.product_id
inner JOIN public.inventory_unit i ON i.id = p.dispensing_unit_id
inner join public.inventory_batch_level b on b.product_id = p.id
;



------------------------ORGANISED----------------------------------------------------------------------------

select 
m.name as store_name,
p.name as product_name,
p.product_type,
i.name as inventory_unit_name,
i.quantity as inventory_unit_quantity,
b.batch_number as inventory_batch_number,
p.sku as product_sku,
p.is_available as product_is_available,
p.qty_per_unit as product_qty_per_unit,
b.unit_in_stock as inventory_batch_level_unit_in_stock,
u.increment as inventory_audit_increment,
u.decrement as inventory_audit_decrement,
u.level as inventory_audit_level,
u.description as inventory_audit_description,
s.replenishment_level as store_inventory_replenishment_level,
s.unit_in_stock as store_inventory_unit_in_stock,
p.is_cost_fixed as product_is_cost_fixed,
p.unit_selling_price as product_unit_selling_price,
b.unit_selling_price as inventory_batch_level_unit_selling_price,
b.expiry_date as inventory_batch_level_expiry_date,
b.last_updated as inventory_batch_level_last_updated,
u.id as inventory_audit_id,
s.id as store_inventory_id,
m.id as store_id,
p.id as product_id,
i.id as inventory_unit_id,
b.id as inventory_batch_level_id,
b.voucher_line_id as inventory_batch_level_voucher_line_id,
m.parent_id as store_parent_id,
m.stock_control_account_id as store_stock_control_account_id,
m.adjustment_control_ledger_id as store_adjustment_control_ledger_id,
p.product_category_id as product_category_id,
p.dispensing_unit_id as product_dispensing_unit_id,
p.receiving_unit_id as product_receiving_unit_id,
p.vat_class_id as product_vat_class_id,
b.store_receipt_item_id as inventory_batch_level_store_receipt_item_id,
u.date_created as inventory_audit_date_created,
s.date_created as store_inventory_date_created,
m.date_created as store_date_created,
p.date_created as product_date_created,
i.date_created as inventory_unit_date_created,
b.date_created as inventory_batch_level_date_created,
u.created_by_id as inventory_audit_created_by_id,
m.created_by_id as store_created_by_id,
p.created_by_id as product_created_by_id,
i.created_by_id as inventory_unit_created_by_id,
b.created_by_id as inventory_batch_level_created_by_id
from public.inventory_audit u
inner join public.store_inventory s on s.id = u.store_inventory_id
inner join public.store m on m.id = s.store_id
inner JOIN public.product p ON p.id = s.product_id
inner JOIN public.inventory_unit i ON i.id = p.dispensing_unit_id
inner join public.inventory_batch_level b on b.product_id = p.id
;



