-- HMIS 108: REFERRALS SECTION
-- Based on actual database structure using patient_admission and referral tables

SELECT 
    DATE_PART('year', pa.admission_date) as year,
    DATE_PART('month', pa.admission_date) as month,
    rf.name as referral_facility_name,
    rp.name as referral_procedure_name,
    
    -- Count referrals by facility and procedure
    COUNT(DISTINCT pa.id) as total_referrals,
    
    -- Age and gender breakdown
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(pa.admission_date, p.date_of_birth)) < 5 THEN 1 END) as male_under_5,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(pa.admission_date, p.date_of_birth)) < 5 THEN 1 END) as female_under_5,
    COUNT(CASE WHEN p.gender = 'M' AND EXTRACT(YEAR FROM AGE(pa.admission_date, p.date_of_birth)) >= 5 THEN 1 END) as male_5_and_above,
    COUNT(CASE WHEN p.gender = 'F' AND EXTRACT(YEAR FROM AGE(pa.admission_date, p.date_of_birth)) >= 5 THEN 1 END) as female_5_and_above

FROM public.patient_admission pa
JOIN public.patient p ON pa.patient_id = p.id
LEFT JOIN public.referral_facility rf ON pa.referral_facility_id = rf.id
LEFT JOIN public.referral_procedure rp ON pa.referral_procedure_id = rp.id
WHERE pa.admission_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND pa.admission_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', pa.admission_date),
    DATE_PART('month', pa.admission_date),
    rf.name,
    rp.name
ORDER BY rf.name, rp.name;