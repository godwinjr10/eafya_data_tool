CREATE MATERIALIZED VIEW reporting.postnatal_community_referal AS
SELECT
    TO_CHAR(date_created, 'YYYYMM') AS month,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(date_created, birth_date)) < 15) AS below_15yrs,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(date_created, birth_date)) BETWEEN 15 AND 19) AS "15_19yrs",
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(date_created, birth_date)) BETWEEN 20 AND 24) AS "20_24yrs",
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(date_created, birth_date)) BETWEEN 25 AND 50) AS "25_50yrs",
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(date_created, birth_date)) > 50) AS "50yrs+",
    COUNT(*) AS total_patients
FROM reporting.patient_postnatal
GROUP BY TO_CHAR(date_created, 'YYYYMM')
ORDER BY month;

-- Optional: To speed up refreshes later, you can index the view
CREATE INDEX idx_postnatal_community_referal_month
    ON reporting.postnatal_community_referal(month);

-- To refresh when needed:
-- REFRESH MATERIALIZED VIEW reporting.postnatal_community_referal;
