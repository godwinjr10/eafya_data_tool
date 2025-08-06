-- HMIS 108: RADIOLOGY AND IMAGING SECTION
-- Based on actual database structure using imaging tables

SELECT 
    DATE_PART('year', i.date_created) as year,
    DATE_PART('month', i.date_created) as month,
    ic.name as imaging_category,
    i.name as imaging_name,
    
    -- Count by imaging type and category
    COUNT(DISTINCT i.id) as total_examinations,
    
    -- Age and gender breakdown
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(i.date_created, p.date_of_birth)) < 5 THEN 1 END) as male_under_5,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(i.date_created, p.date_of_birth)) < 5 THEN 1 END) as female_under_5,
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(i.date_created, p.date_of_birth)) >= 5 THEN 1 END) as male_5_and_above,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(i.date_created, p.date_of_birth)) >= 5 THEN 1 END) as female_5_and_above,
    
    -- Results statistics
    COUNT(CASE WHEN irt.template IS NOT NULL THEN 1 END) as results_reported,
    COUNT(CASE WHEN id.item_image_id IS NOT NULL THEN 1 END) as images_stored

FROM public.imaging i
JOIN public.imaging_category ic ON i.imaging_category_id = ic.id
LEFT JOIN public.imaging_result_template irt ON i.imaging_result_template_id = irt.id
LEFT JOIN public.imaging_detail id ON id.imaging_id = i.id
JOIN public.patient_admission pa ON i.admission_id = pa.id
JOIN public.patient p ON pa.patient_id = p.id
WHERE i.date_created >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND i.date_created < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', i.date_created),
    DATE_PART('month', i.date_created),
    ic.name,
    i.name
ORDER BY ic.name, i.name;