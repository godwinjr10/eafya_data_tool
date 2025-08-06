-- HMIS 108: BLOOD TRANSFUSION SECTION
-- Based on actual database structure using blood_transfusion tables

WITH blood_stats AS (
    SELECT 
        DATE_PART('year', bt.date_created) as year,
        DATE_PART('month', bt.date_created) as month,
        bti.pack_number,
        bti.number_of_pack,
        btvm.blood_pressure,
        btvm.pulse,
        btvm.respiratory,
        btvm.temperature,
        p.gender,
        p.date_of_birth,
        bt.date_created as transfusion_date
        
    FROM public.blood_transfusion bt
    JOIN public.blood_transfusion_inventory_item bti ON bti.patient_blood_transfusion_id = bt.id
    LEFT JOIN public.blood_transfusion_vital_monitor btvm ON btvm.patient_blood_transfusion_id = bt.id
    JOIN public.patient_admission pa ON bt.admission_id = pa.id
    JOIN public.patient p ON pa.patient_id = p.id
    WHERE bt.date_created >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        AND bt.date_created < DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
    year,
    month,
    
    -- Total units statistics
    COUNT(DISTINCT pack_number) as total_units_requested,
    SUM(number_of_pack) as total_units_transfused,
    
    -- Adverse reactions (based on vital signs)
    COUNT(CASE 
        WHEN blood_pressure IS NOT NULL 
        AND (
            CAST(SPLIT_PART(blood_pressure, '/', 1) AS INTEGER) > 140 
            OR CAST(SPLIT_PART(blood_pressure, '/', 2) AS INTEGER) > 90
            OR pulse > 100
            OR respiratory > 20
            OR temperature > 38.0
        ) 
        THEN 1 
    END) as adverse_reactions,
    
    -- Age and gender breakdown
    COUNT(CASE WHEN gender = 'M' AND EXTRACT(YEAR FROM AGE(transfusion_date, date_of_birth)) < 5 THEN 1 END) as male_under_5,
    COUNT(CASE WHEN gender = 'F' AND EXTRACT(YEAR FROM AGE(transfusion_date, date_of_birth)) < 5 THEN 1 END) as female_under_5,
    COUNT(CASE WHEN gender = 'M' AND EXTRACT(YEAR FROM AGE(transfusion_date, date_of_birth)) >= 5 THEN 1 END) as male_5_and_above,
    COUNT(CASE WHEN gender = 'F' AND EXTRACT(YEAR FROM AGE(transfusion_date, date_of_birth)) >= 5 THEN 1 END) as female_5_and_above

FROM blood_stats
GROUP BY year, month;