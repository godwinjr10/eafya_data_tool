-- HMIS 108: DIAGNOSES SECTION
-- Based on actual database structure using disease tables

WITH disease_stats AS (
    SELECT 
        DATE_PART('year', pa.admission_date) as year,
        DATE_PART('month', pa.admission_date) as month,
        d.five_character_icd_code,
        d.name as disease_name,
        dc.name as chapter_name,
        dc.chapter_number,
        db.block_code,
        p.gender,
        p.date_of_birth,
        pa.admission_date,
        pa.discharge_date,
        pa.medical_discharge_date,
        CASE 
            WHEN pa.medical_discharge_date IS NOT NULL THEN 'DISCHARGED'
            WHEN pa.discharge_date IS NOT NULL THEN 'RELEASED'
            ELSE 'ADMITTED'
        END as patient_status
        
    FROM public.disease d
    JOIN public.disease_block db ON d.disease_block_id = db.id
    JOIN public.disease_chapter dc ON db.disease_chapter_id = dc.id
    JOIN public.patient_admission pa ON d.id = pa.admission_diagnosis_id
    JOIN public.patient p ON pa.patient_id = p.id
    WHERE pa.admission_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        AND pa.admission_date < DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
    year,
    month,
    five_character_icd_code,
    disease_name,
    chapter_name,
    chapter_number,
    block_code,
    
    -- Cases by age and gender
    COUNT(CASE WHEN gender = 'M' AND EXTRACT(YEAR FROM AGE(admission_date, date_of_birth)) < 5 THEN 1 END) as male_cases_0_4,
    COUNT(CASE WHEN gender = 'F' AND EXTRACT(YEAR FROM AGE(admission_date, date_of_birth)) < 5 THEN 1 END) as female_cases_0_4,
    COUNT(CASE WHEN gender = 'M' AND EXTRACT(YEAR FROM AGE(admission_date, date_of_birth)) >= 5 THEN 1 END) as male_cases_5_plus,
    COUNT(CASE WHEN gender = 'F' AND EXTRACT(YEAR FROM AGE(admission_date, date_of_birth)) >= 5 THEN 1 END) as female_cases_5_plus,
    
    -- Outcomes
    COUNT(CASE WHEN patient_status = 'DISCHARGED' THEN 1 END) as discharged,
    COUNT(CASE WHEN patient_status = 'RELEASED' THEN 1 END) as released,
    COUNT(CASE WHEN patient_status = 'ADMITTED' THEN 1 END) as still_admitted

FROM disease_stats
GROUP BY 
    year,
    month,
    five_character_icd_code,
    disease_name,
    chapter_name,
    chapter_number,
    block_code
ORDER BY 
    chapter_number,
    block_code,
    five_character_icd_code;