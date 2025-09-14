CREATE MATERIALIZED VIEW reporting."105_06_commodities" AS
SELECT
    COALESCE(d.report_month, q.report_month, s.report_month, e.report_month) AS report_month,
    COALESCE(d.store_name, q.store_name, s.store_name, e.store_name) AS store_name,
    COALESCE(d.product_id, q.product_id, s.product_id, e.product_id) AS product_id,
    COALESCE(d.product_name, q.product_name, s.product_name, e.product_name) AS product_name,
    COALESCE(d.days_out_of_stock, 0) AS days_out_of_stock,
    COALESCE(q.qty_consumed, 0) AS qty_consumed,
    COALESCE(s.stock_level, 0) AS stock_level,
    COALESCE(e.quantity_expired, 0) AS quantity_expired
FROM (
    -- Days out of stock
    SELECT
        TO_CHAR(DATE_TRUNC('month', c.last_updated), 'YYYYMM') AS report_month,
        c.store_name,
        c.product_id,
        c.product_name,
        COUNT(DISTINCT DATE(c.last_updated)) FILTER (WHERE c.level = 0) AS days_out_of_stock
    FROM reporting.commodities c
    WHERE c.last_updated IS NOT NULL
      AND c.store_id IN (SELECT mapping_id FROM reporting.materialized_view_ids where name ilike '%main store%' and mapping_id > 0)
      AND c.level = 0
    GROUP BY TO_CHAR(DATE_TRUNC('month', c.last_updated), 'YYYYMM'), c.store_name, c.product_id, c.product_name
) d
FULL OUTER JOIN (
    -- Quantity consumed
    SELECT
        TO_CHAR(c.date_created, 'YYYYMM') AS report_month,
        c.store_name,
        c.product_id,
        c.product_name,
        SUM(c.decrement) AS qty_consumed
    FROM reporting.commodities c
    WHERE c.level <> 0
      AND c.store_id IN (SELECT mapping_id
FROM reporting.materialized_view_ids where name ilike '%main store%' and mapping_id > 0) AND c.decrement IS NOT NULL
    GROUP BY TO_CHAR(c.date_created, 'YYYYMM'), c.store_name, c.product_id, c.product_name
) q
  ON d.report_month = q.report_month
  AND d.store_name = q.store_name
  AND d.product_id = q.product_id
FULL OUTER JOIN (
    -- Latest stock level
    SELECT *
    FROM (
        SELECT
            TO_CHAR(date_created, 'YYYYMM') AS report_month,
            store_name,
            product_id,
            product_name,
            level AS stock_level,
            ROW_NUMBER() OVER (
                PARTITION BY TO_CHAR(date_created, 'YYYYMM'), store_name, product_id
                ORDER BY date_created DESC
            ) AS rn
        FROM reporting.commodities
        WHERE store_id IN (SELECT mapping_id FROM reporting.materialized_view_ids where name ilike '%main store%' and mapping_id > 0)
    ) ranked
    WHERE rn = 1
) s
  ON COALESCE(d.report_month, q.report_month) = s.report_month
  AND COALESCE(d.store_name, q.store_name) = s.store_name
  AND COALESCE(d.product_id, q.product_id) = s.product_id
FULL OUTER JOIN (
    -- Quantity expired
    SELECT
        TO_CHAR(u.expiry_date, 'YYYYMM') AS report_month,
        u.store_name,
        u.product_id,
        u.product_name,
        SUM(u.unit_in_stock) AS quantity_expired
    FROM reporting.inventory_batch u
    WHERE u.store_id IN (SELECT mapping_id FROM reporting.materialized_view_ids where name ilike '%main store%' and mapping_id > 0)
      AND u.expiry_date IS NOT NULL
      AND u.unit_in_stock > 0
      AND u.expiry_date <= CURRENT_DATE
    GROUP BY TO_CHAR(u.expiry_date, 'YYYYMM'), u.store_name, u.product_id, u.product_name
) e
  ON COALESCE(d.report_month, q.report_month, s.report_month) = e.report_month
  AND COALESCE(d.store_name, q.store_name, s.store_name) = e.store_name
  AND COALESCE(d.product_id, q.product_id, s.product_id) = e.product_id
ORDER BY report_month, store_name, product_id;