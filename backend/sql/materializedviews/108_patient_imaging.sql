CREATE MATERIALIZED VIEW reporting."108_patient_imaging" AS
WITH categorized AS (
    SELECT
        pi.patient_id,
        pi.gender,
        pi.category AS category_name,
        pi.imaging_name,
        DATE_PART('year', AGE(pi.date_created, pi.birth_date)) AS age
    FROM reporting.patient_imaging pi
),
age_gender_group AS (
    SELECT
        category_name,
        imaging_name,
        SUM(CASE WHEN age <= 4 AND gender = 'Male' THEN 1 ELSE 0 END) AS male_0_4,
        SUM(CASE WHEN age <= 4 AND gender = 'Female' THEN 1 ELSE 0 END) AS female_0_4,
        SUM(CASE WHEN age >= 5 AND gender = 'Male' THEN 1 ELSE 0 END) AS male_5_plus,
        SUM(CASE WHEN age >= 5 AND gender = 'Female' THEN 1 ELSE 0 END) AS female_5_plus
    FROM categorized
    GROUP BY category_name, imaging_name
)
SELECT
    category_name,
    imaging_name,
    male_0_4,
    female_0_4,
    male_5_plus,
    female_5_plus
FROM age_gender_group
ORDER BY category_name, imaging_name;
