-- =====================================================
-- HMIS 108: Blood Transfusion Services
-- Section 4a & 4b: Blood Transfusion Services
-- =====================================================

CREATE VIEW reporting."108_blood_transfusion" AS
WITH blood_product_categories AS (
    SELECT 
        blood_product_type,
        CASE 
            WHEN blood_product_type ILIKE '%WHOLE BLOOD%' THEN 'Whole blood'
            WHEN blood_product_type ILIKE '%PACKED CELLS%' THEN 'Packed cells'
            WHEN blood_product_type ILIKE '%PLATELETS%' THEN 'Platelets'
            WHEN blood_product_type ILIKE '%FFP%' THEN 'Fresh Frozen Plasma'
            WHEN blood_product_type ILIKE '%CRYO%' THEN 'Cryo precipitates'
            ELSE 'Other'
        END as standardized_product_type,
        number_of_pack,
        degree_of_urgency,
        disease_name,
        encounter_date,
        age_group,
        gender
    FROM reporting.blood_transfusion_data
    WHERE blood_product_type IS NOT NULL
)
-- Section 4a: Blood Transfusion Services Summary
SELECT 
    TO_CHAR(encounter_date, 'YYYYMM') AS report_month,
    '4a' as section,
    standardized_product_type as blood_product_type,
    SUM(number_of_pack) as units_requested,
    SUM(number_of_pack) as units_received,
    SUM(number_of_pack) as units_transfused,
    COUNT(CASE WHEN degree_of_urgency = 'URGENT' THEN 1 END) as adverse_reactions,
    NULL::text as age_group,
    NULL::text as gender,
    NULL::int as unit
FROM blood_product_categories
GROUP BY TO_CHAR(encounter_date, 'YYYYMM'), standardized_product_type
UNION ALL
SELECT 
    TO_CHAR(encounter_date, 'YYYYMM') AS report_month,
    '4b' as section,
    standardized_product_type as blood_product_type,
    NULL::int as units_requested,
    NULL::int as units_received,
    NULL::int as units_transfused,
    NULL::int as adverse_reactions,
    age_group,
    gender,
    COUNT(*) as unit
FROM blood_product_categories
GROUP BY standardized_product_type, age_group, gender, TO_CHAR(encounter_date, 'YYYYMM')
ORDER BY section, blood_product_type, age_group, gender;
