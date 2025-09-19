CREATE VIEW reporting.postnatal_community_referal AS
SELECT
    TO_CHAR(admission_date, 'YYYYMM') AS month,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(admission_date, birth_date)) < 15) AS below_15yrs,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(admission_date, birth_date)) BETWEEN 15 AND 19) AS "15_19yrs",
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(admission_date, birth_date)) BETWEEN 20 AND 24) AS "20_24yrs",
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(admission_date, birth_date)) BETWEEN 25 AND 50) AS "25_50yrs",
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(admission_date, birth_date)) > 50) AS "50yrs+",
    COUNT(*) AS total_patients
FROM reporting.patient_postnatal
GROUP BY TO_CHAR(admission_date, 'YYYYMM')
ORDER BY month;
