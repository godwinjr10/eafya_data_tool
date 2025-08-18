create materialized view reporting."108_01_census_information" as
WITH 
bed_counts AS (
    SELECT 
        ward_name,
        COUNT(DISTINCT bed_id) AS total_beds
    FROM reporting.patient_bed_admissions
    GROUP BY ward_name
),
admission_counts AS (
    SELECT 
        ward_name,
        TO_CHAR(admission_date, 'YYYY-MM') AS report_month,
        COUNT(DISTINCT patient_id) AS total_admissions
    FROM reporting.patient_bed_admissions
    GROUP BY ward_name, TO_CHAR(admission_date, 'YYYY-MM')
),
patient_days AS (
    SELECT
        ward_name,
        TO_CHAR(admission_date, 'YYYY-MM') AS report_month,
        SUM(
            CASE 
                WHEN medical_discharge_date IS NULL THEN 
                    DATE_PART('day', CURRENT_DATE - admission_date)
                WHEN TO_CHAR(medical_discharge_date, 'YYYY-MM') = TO_CHAR(admission_date, 'YYYY-MM') THEN
                    1
                ELSE 
                    DATE_PART('day', medical_discharge_date - admission_date)
            END
        ) AS total_patient_days
    FROM reporting.patient_days
    GROUP BY ward_name, TO_CHAR(admission_date, 'YYYY-MM')
),
ward_data AS (
    SELECT
        a.report_month,
        a.ward_name,
        b.total_beds,
        a.total_admissions,
        COALESCE(pd.total_patient_days, 0) AS total_patient_days
    FROM admission_counts a
    LEFT JOIN patient_days pd ON a.ward_name = pd.ward_name AND a.report_month = pd.report_month
    LEFT JOIN bed_counts b ON a.ward_name = b.ward_name
),
monthly_totals AS (
    SELECT
        report_month,
        'TOTAL' AS ward_name,
        SUM(total_beds) AS total_beds,
        SUM(total_admissions) AS total_admissions,
        SUM(total_patient_days) AS total_patient_days
    FROM ward_data
    GROUP BY report_month
),
combined_data AS (
    SELECT * FROM ward_data
    UNION ALL
    SELECT * FROM monthly_totals
)
SELECT
    report_month AS "Report Month",
    ward_name AS "Wards",
    total_beds AS "A Cl01. No. of beds",
    total_admissions AS "B Cl02. No. of admissions",
    total_patient_days AS "D Cl04. Patient days",
    CASE 
        WHEN total_admissions = 0 THEN 0
        ELSE ROUND(total_patient_days::numeric / total_admissions, 1)
    END AS "E Cl05. Average length of stay (E=D/B)",
    ROUND(total_patient_days::numeric / 30, 1) AS "F Cl06. Average occupancy (F=D/30 days)",
    CASE 
        WHEN total_beds = 0 THEN 0
        ELSE ROUND((total_patient_days::numeric / (total_beds * 30)) * 100, 1)
    END AS "G Cl07. Bed occupancy (F/A)x100"
FROM combined_data
ORDER BY 
    report_month,
    CASE WHEN ward_name = 'TOTAL' THEN 1 ELSE 0 END,
    ward_name;