SELECT 
a.report_month,
m.section_id,
m.section_name,
m.hmis_code,
m.hmis_name,
a.qty_consumed AS "Quantity Consumed",
a.days_out_of_stock AS "Days out Stock",
a.stock_level AS "stock on hand",
a.quantity_expired AS "Quantity Expired"
FROM reporting."105_06_commodities" a
JOIN (
SELECT DISTINCT section_id, section_name, hmis_code, hmis_name, eafya_product_id
FROM reporting.dhis_eafya_mapping_commodities
WHERE section_id = '6.1'
) m 
ON a.product_id = m.eafya_product_id
WHERE a.report_month = '202505'

--- DHIS2 PUSH TABLE CREATION ----
create table reporting.commodities_push as 
SELECT 
a.report_month,
m.section_id,
m.section_name,
m.hmis_code,
m.hmis_name,
m.dhis2_data_element_id as dataelement,
m.data_element_name,
a.qty_consumed,
a.days_out_of_stock,
a.stock_level,
a.quantity_expired
FROM reporting."105_06_commodities" a
JOIN (
SELECT DISTINCT section_id, section_name, hmis_code, hmis_name, dhis2_data_element_id, data_element_name, eafya_product_id
FROM reporting.dhis_eafya_mapping_commodities
WHERE section_id = '6.1'
) m 
ON a.product_id = m.eafya_product_id

--- integration push query----
SELECT
    t.report_month AS period,
    t.hmis_name,
    t.dataelement AS dataElement,
    'HllvX50cXC0' AS categoryOptionCombo,
    t.data_element_name,
    COALESCE(
        CASE
            WHEN data_element_name = 'Stock at Hand' THEN t."stock_level"
            WHEN data_element_name = 'Quantity Consumed' THEN t."qty_consumed"
            WHEN data_element_name = 'Days out of stock' THEN t."days_out_of_stock"
            WHEN data_element_name = 'Quantity Expired' THEN t."quantity_expired"
        END,
        0
    ) AS value
FROM reporting.commodities_push t
WHERE t.report_month = '202505';