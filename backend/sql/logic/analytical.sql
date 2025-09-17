CREATE TABLE IF NOT EXISTS reports."105_commodities" AS (
    SELECT 
        ROW_NUMBER() OVER (ORDER BY s.date_created DESC, s.product_id) AS id,
        TO_CHAR(s.date_created, 'YYYY-MM') AS report_month,
        s.product_id,
        s.product_name,
        s.unit,
        SUM(s.quantity_consumed) as quantity_consumed,
        SUM(CASE WHEN s.unit_in_stock = 0 THEN 1 ELSE 0 END) AS days_out_of_stock,
        SUM(s.level) AS stock_on_hand,
        SUM(CASE WHEN l.expiry_date < CURRENT_DATE THEN l.unit_in_stock ELSE 0 END) AS quantity_expired
    FROM reports.eafya_commodtities s
    INNER JOIN public.inventory_batch_level l ON l.product_id = s.product_id
    --WHERE s.date_created >= '2025-01-01' AND s.date_created < '2025-02-01'
    GROUP BY  s.product_id, s.product_name, s.unit, s.date_created
    ORDER BY s.date_created  desc
);

CREATE TABLE IF NOT EXISTS reports."105_conditions" AS (
    SELECT
        ROW_NUMBER() OVER (ORDER BY TO_CHAR(diagnoisis_date, 'YYYY-MM') DESC) AS id,
        TO_CHAR(diagnoisis_date, 'YYYY-MM') AS report_month,
        -- hmis_code,
        -- hmis_name,
        COUNT(CASE WHEN age_days between 0 and 28 AND gender = 'Male' THEN 1 END) AS "0-28d Male",
        COUNT(CASE WHEN age_days between 0 and 28 AND gender = 'Female' THEN 1 END) AS "0-28d Female",
        COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Male' THEN 1 END) AS "29d-4y Male",
        COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Female' THEN 1 END) AS "29d-4y Female",
        COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Male' THEN 1 END) AS "5-9y Male",
        COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Female' THEN 1 END) AS "5-9y Female",
        COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Male' THEN 1 END) AS "10-19y Male",
        COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Female' THEN 1 END) AS "10-19y Female",
        COUNT(CASE WHEN age_years >= 20 AND gender = 'Male' THEN 1 END) AS "20y+ Male",
        COUNT(CASE WHEN age_years >= 20 AND gender = 'Female' THEN 1 END) AS "20y+ Female"
    FROM (
        SELECT 
            diagnoisis_date,
            -- hmis_code,
            -- hmis_name,
            gender,
            DATE_PART('year', AGE(diagnoisis_date, birth_date::DATE)) AS age_years,
            DATE_PART('day', AGE(diagnoisis_date, birth_date::DATE)) 
              + DATE_PART('month', AGE(diagnoisis_date, birth_date::DATE)) * 30 
              + DATE_PART('year', AGE(diagnoisis_date, birth_date::DATE)) * 365 AS age_days
        FROM reports.eafya_conditions
        --WHERE diagnoisis_date >= '2024-10-01' AND diagnoisis_date < '2024-11-01'
        -- WHERE hmis_code IN ('213', '637', '214', '638', '639', '640', '641', '642', '643', '644', '645', '646', '647', '648', '649', '650', '215', '207', '354', '208', '355', '211', '259', '260', '210', '209', '267', '270', '271', '272', '273', '275', '536', '601', '274','202','204','205','194','195','196','636','197','198','633', '157', '158', '634', '152', '153', '154', '155', '156', '159', '160',  '161', '162', '163', '164', '165', '166', '167', '168', '169', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '635', '183', 
        -- '189', '190', '191', '192')
    ) sub
    GROUP BY TO_CHAR(diagnoisis_date, 'YYYY-MM')
    ORDER BY report_month DESC
);

CREATE TABLE IF NOT EXISTS reports."105_family_planning" AS (
    SELECT 
        ROW_NUMBER() OVER (ORDER BY report_month DESC, family_planning_method_administered) AS id,
        report_month,
        family_planning_method_administered,
        COUNT(CASE WHEN age_years < 15 AND treatment_stage = 'new' THEN 1 END) AS "under_15_new",
        COUNT(CASE WHEN age_years < 15 AND treatment_stage = 'revisit' THEN 1 END) AS "under_15_revisit",
        COUNT(CASE WHEN age_years BETWEEN 15 AND 19 AND treatment_stage = 'new' THEN 1 END) AS "15_19_new",
        COUNT(CASE WHEN age_years BETWEEN 15 AND 19 AND treatment_stage = 'revisit' THEN 1 END) AS "15_19_revisit",
        COUNT(CASE WHEN age_years BETWEEN 20 AND 24 AND treatment_stage = 'new' THEN 1 END) AS "20_24_new",
        COUNT(CASE WHEN age_years BETWEEN 20 AND 24 AND treatment_stage = 'revisit' THEN 1 END) AS "20_24_revisit",
        COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND treatment_stage = 'new' THEN 1 END) AS "25_49_new",
        COUNT(CASE WHEN age_years BETWEEN 25 AND 49 AND treatment_stage = 'revisit' THEN 1 END) AS "25_49_revisit",
        COUNT(CASE WHEN age_years >= 50 AND treatment_stage = 'new' THEN 1 END) AS "50_plus_new",
        COUNT(CASE WHEN age_years >= 50 AND treatment_stage = 'revisit' THEN 1 END) AS "50_plus_revisit"
    FROM (
        SELECT 
            TO_CHAR(fp_administered_date, 'YYYY-MM') AS report_month,
            family_planning_method_administered,
            treatment_stage,
            CASE 
                WHEN birth_date IS NULL OR birth_date::TEXT = '00:00.0' THEN 0
                ELSE DATE_PART('year', AGE(CURRENT_DATE, birth_date::DATE))
            END AS age_years
        FROM reports.eafya_family_planning
    ) sub
    GROUP BY report_month, family_planning_method_administered
    ORDER BY report_month, family_planning_method_administered DESC
);

CREATE TABLE IF NOT EXISTS reports."105_child_health" AS (
    SELECT
        ROW_NUMBER() OVER (ORDER BY TO_CHAR(DATE_TRUNC('month', date_created), 'YYYY-MM') DESC, vaccine_name) AS id,
        TO_CHAR(DATE_TRUNC('month', date_created), 'YYYY-MM') AS report_month,
        vaccine_name,
        COUNT(*) AS total_cases
    FROM reports.eafya_child_health
    WHERE vaccine_id IN ('19', '20', '21', '22', '23')
       --AND date_created >= '2024-10-01'
      --AND date_created < '2024-11-01'
    GROUP BY TO_CHAR(DATE_TRUNC('month', date_created), 'YYYY-MM'), vaccine_name
    ORDER BY report_month DESC
);

CREATE TABLE IF NOT EXISTS reports."105_attendance" AS (
    SELECT
        ROW_NUMBER() OVER (ORDER BY TO_CHAR(patient_visit_date, 'YYYY-MM') DESC) AS id,
        TO_CHAR(patient_visit_date, 'YYYY-MM') AS report_month,
        --clinic_name,
        COUNT(CASE WHEN age_days between 0 and 28 AND gender = 'Male' THEN 1 END) AS "0-28d Male",
        COUNT(CASE WHEN age_days between 0 and 28 AND gender = 'Female' THEN 1 END) AS "0-28d Female",
        COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Male' THEN 1 END) AS "29d-4y Male",
        COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Female' THEN 1 END) AS "29d-4y Female",
        COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Male' THEN 1 END) AS "5-9y Male",
        COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Female' THEN 1 END) AS "5-9y Female",
        COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Male' THEN 1 END) AS "10-19y Male",
        COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Female' THEN 1 END) AS "10-19y Female",
        COUNT(CASE WHEN age_years >= 20 AND gender = 'Male' THEN 1 END) AS "20y+ Male",
        COUNT(CASE WHEN age_years >= 20 AND gender = 'Female' THEN 1 END) AS "20y+ Female"
    FROM (
        SELECT 
            patient_visit_date,
            gender,
            DATE_PART('year', AGE(patient_visit_date, birth_date::DATE)) AS age_years,
            DATE_PART('day', AGE(patient_visit_date, birth_date::DATE)) 
              + DATE_PART('month', AGE(patient_visit_date, birth_date::DATE)) * 30 
              + DATE_PART('year', AGE(patient_visit_date, birth_date::DATE)) * 365 AS age_days
        FROM reports.eafya_attendance
        --WHERE patient_visit_date >= '2024-10-01' AND patient_visit_date < '2024-11-01'
    ) sub
    GROUP BY TO_CHAR(patient_visit_date, 'YYYY-MM')
    ORDER BY report_month DESC
);

CREATE TABLE IF NOT EXISTS reports."105_postnatal" AS (
    SELECT 
        ROW_NUMBER() OVER (ORDER BY report_month DESC, ward_name, interval_type) AS id,
        ward_name,
        interval_type,
        total_attendances,
        report_month
    FROM (
        SELECT 
            ward_name,
            '6-day' AS interval_type,
            COUNT(*) AS total_attendances,
            TO_CHAR(patient_registered_date, 'YYYY-MM') AS report_month
        FROM reports.eafya_postnatal
        WHERE admission_date >= DATE '2025-01-01' 
          AND admission_date < DATE '2025-01-01' + INTERVAL '6 days'
        GROUP BY ward_name, report_month

        UNION ALL

        SELECT 
            ward_name,
            '6-week' AS interval_type,
            COUNT(*) AS total_attendances,
            TO_CHAR(patient_registered_date, 'YYYY-MM') AS report_month
        FROM reports.eafya_postnatal
        WHERE admission_date >= DATE '2025-01-01' 
          AND admission_date < DATE '2025-01-01' + INTERVAL '6 weeks'
        GROUP BY ward_name, report_month

        UNION ALL

        SELECT 
            ward_name,
            '6-month' AS interval_type,
            COUNT(*) AS total_attendances,
            TO_CHAR(patient_registered_date, 'YYYY-MM') AS report_month
        FROM reports.eafya_postnatal
        WHERE admission_date >= DATE '2025-01-01' 
          AND admission_date < DATE '2025-01-01' + INTERVAL '6 months'
        GROUP BY ward_name, report_month
    ) sub
);

CREATE TABLE IF NOT EXISTS reports."105_maternity" AS (
    -- Maternity Monthly Report
    WITH monthly_stats AS (
        SELECT 
            EXTRACT(YEAR FROM admission_date) || '-' || EXTRACT(MONTH FROM admission_date) as report_month
        FROM reports.eafya_maternity
        GROUP BY 
            EXTRACT(YEAR FROM admission_date),
            EXTRACT(MONTH FROM admission_date)
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY report_month DESC, indicator_code, indicator_name) AS id,
        report_month, 
        indicator_code, 
        indicator_name, 
        total
    FROM (
        -- MA01. Admissions
        SELECT 
            ms.report_month,
            'MA01' as indicator_code,
            'Admissions' as indicator_name,
            COUNT(*) as total,
            'JY0M7eC2N42' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        -- MA02. Referrals to maternity unit
        SELECT 
            ms.report_month,
            'MA02' as indicator_code,
            'Referrals to maternity unit - Total' as indicator_name,
            COUNT(CASE WHEN referring_facility IS NOT NULL THEN 1 END) as total,
            'AGmXoLiT89x' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA02' as indicator_code,
            'Referrals to maternity unit - From community' as indicator_name,
            COUNT(CASE WHEN referring_facility IS NOT NULL AND encounter_notes ILIKE '%community%' THEN 1 END) as total,
            'TMF6CkVvMuD' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        -- MA03. Referrals from maternity by age group
        SELECT 
            ms.report_month,
            'MA03' as indicator_code,
            'Below 15 Years' as indicator_name,
            COUNT(CASE WHEN EXTRACT(YEAR FROM age(m.admission_date, m.birth_date)) < 15 THEN 1 END) as total,
            'YNqGVS6GEyo' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA03' as indicator_code,
            '15-19 Years' as indicator_name,
            COUNT(CASE WHEN EXTRACT(YEAR FROM age(m.admission_date, m.birth_date)) BETWEEN 15 AND 19 THEN 1 END) as total,
            'YNqGVS6GEyo' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA03' as indicator_code,
            '20-24 Years' as indicator_name,
            COUNT(CASE WHEN EXTRACT(YEAR FROM age(m.admission_date, m.birth_date)) BETWEEN 20 AND 24 THEN 1 END) as total,
            'YNqGVS6GEyo' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA03' as indicator_code,
            '25-49 Years' as indicator_name,
            COUNT(CASE WHEN EXTRACT(YEAR FROM age(m.admission_date, m.birth_date)) BETWEEN 25 AND 49 THEN 1 END) as total,
            'YNqGVS6GEyo' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA03' as indicator_code,
            '50+ Years' as indicator_name,
            COUNT(CASE WHEN EXTRACT(YEAR FROM age(m.admission_date, m.birth_date)) >= 50 THEN 1 END) as total,
            'YNqGVS6GEyo' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        -- MA05. Births in the unit
        SELECT 
            ms.report_month,
            'MA05a' as indicator_code,
            'Live births - Total' as indicator_name,
            COUNT(CASE WHEN baby_status = 'Live Birth' THEN 1 END) as total,
            'fEz9wGsA6YU' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA05a' as indicator_code,
            'Live births - <2.5kgs' as indicator_name,
            COUNT(CASE WHEN baby_status = 'Live Birth' AND baby_weight < 2.5 THEN 1 END) as total,
            'P1MyPWVxi5T' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA05b' as indicator_code,
            'Fresh still birth - Total' as indicator_name,
            COUNT(CASE WHEN baby_status = 'Fresh Still Birth' THEN 1 END) as total,
            'T8W0wbzErSF' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA05b' as indicator_code,
            'Fresh still birth - <2.5kgs' as indicator_name,
            COUNT(CASE WHEN baby_status = 'Fresh Still Birth' AND baby_weight < 2.5 THEN 1 END) as total,
            'bl6lQqygEK1' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA05c' as indicator_code,
            'Macerated still birth - Total' as indicator_name,
            COUNT(CASE WHEN baby_status = 'Macerated Still Birth' THEN 1 END) as total,
            'ULL9lX3DO7V' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA05c' as indicator_code,
            'Macerated still birth - <2.5kgs' as indicator_name,
            COUNT(CASE WHEN baby_status = 'Macerated Still Birth' AND baby_weight < 2.5 THEN 1 END) as total,
            'MzqiroyuhJh' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        -- MA23. Birth asphyxia
        SELECT 
            ms.report_month,
            'MA23' as indicator_code,
            'No. of babies with Birth asphyxia' as indicator_name,
            COUNT(CASE WHEN encounter_notes ILIKE '%asphyxia%' OR encounter_notes ILIKE '%breathing difficulty%' THEN 1 END) as total,
            'nnmOsAUssg9' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        -- MA27. Uterotonics in 3rd stage
        SELECT 
            ms.report_month,
            'MA27' as indicator_code,
            'Uterotonics in 3rd stage - Oxytocin' as indicator_name,
            COUNT(CASE WHEN drugs_given ILIKE '%oxytocin%' THEN 1 END) as total,
            'nA0w3UvRDpD' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA27' as indicator_code,
            'Uterotonics in 3rd stage - Misoprostol' as indicator_name,
            COUNT(CASE WHEN drugs_given ILIKE '%misoprostol%' OR drugs_given ILIKE '%misopristol%' THEN 1 END) as total,
            'IRfdGnNJzGW' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA27' as indicator_code,
            'Uterotonics in 3rd stage - Heat stable Carbetocin' as indicator_name,
            COUNT(CASE WHEN drugs_given ILIKE '%carbetocin%' THEN 1 END) as total,
            'qBXjgpcV5zX' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA27' as indicator_code,
            'Uterotonics in 3rd stage - Ergometrine' as indicator_name,
            COUNT(CASE WHEN drugs_given ILIKE '%ergometrine%' THEN 1 END) as total,
            'SxPXVqUFskM' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        -- MA28. PPH Treatment
        SELECT 
            ms.report_month,
            'MA28' as indicator_code,
            'PPH Treatment - Oxytocin' as indicator_name,
            COUNT(CASE 
                WHEN (encounter_notes ILIKE '%PPH%' OR encounter_notes ILIKE '%postpartum h%')
                AND drugs_given ILIKE '%oxytocin%' THEN 1 
            END) as total,
            'PU4JyVtmAYY' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA28' as indicator_code,
            'PPH Treatment - Misoprostol' as indicator_name,
            COUNT(CASE 
                WHEN (encounter_notes ILIKE '%PPH%' OR encounter_notes ILIKE '%postpartum h%')
                AND (drugs_given ILIKE '%misoprostol%' OR drugs_given ILIKE '%misopristol%') THEN 1 
            END) as total,
            'hawWpaDwa8v' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA28' as indicator_code,
            'PPH Treatment - Tranexamic' as indicator_name,
            COUNT(CASE 
                WHEN (encounter_notes ILIKE '%PPH%' OR encounter_notes ILIKE '%postpartum h%')
                AND drugs_given ILIKE '%tranexamic%' THEN 1 
            END) as total,
            'ziCT29DWKRC' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
        UNION ALL
        SELECT 
            ms.report_month,
            'MA28' as indicator_code,
            'PPH Treatment - Ergometrine' as indicator_name,
            COUNT(CASE 
                WHEN (encounter_notes ILIKE '%PPH%' OR encounter_notes ILIKE '%postpartum h%')
                AND drugs_given ILIKE '%ergometrine%' THEN 1 
            END) as total,
            'nTMjQrqEa8m' as dataelement_id,
            NULL as categoryoptioncombo_uid
        FROM monthly_stats ms
        JOIN reports.eafya_maternity m ON 
            EXTRACT(YEAR FROM m.admission_date) || '-' || EXTRACT(MONTH FROM m.admission_date) = ms.report_month
        GROUP BY ms.report_month
    ) AS report_data
    -- INNER JOIN reports.dhis2_datasets_elements_new d ON d.dataelement_uid = report_data.dataelement_id
    ORDER BY 
        report_month,
        indicator_code,
        indicator_name
);