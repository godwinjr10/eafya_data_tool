-- HMIS 108: CENSUS INFORMATION (Based on actual database structure)
-- Uses daily_inpatient_statistic table which has the actual ward statistics

SELECT 
    w.name as ward_name,
    w.id as ward_id,
    DATE_PART('year', dis.date) as year,
    DATE_PART('month', dis.date) as month,
    
    -- C101: Number of beds
    ROUND(AVG(dis.bed_capacity)::numeric, 0) as no_of_beds,
    
    -- C102: Number of admissions
    SUM(dis.new_admissions) as no_of_admissions,
    
    -- C103: Number of deaths
    SUM(dis.deaths) as no_of_deaths,
    
    -- C104: Patient days (sum of current admissions)
    SUM(dis.current_male_admissions + dis.current_female_admissions) as patient_days,
    
    -- C105: Average length of stay (Patient days / New admissions)
    CASE 
        WHEN SUM(dis.new_admissions) > 0 
        THEN ROUND((SUM(dis.current_male_admissions + dis.current_female_admissions)::numeric / SUM(dis.new_admissions)::numeric), 2)
        ELSE 0 
    END as avg_length_of_stay,
    
    -- C106: Average occupancy (Patient days / days in month)
    ROUND((SUM(dis.current_male_admissions + dis.current_female_admissions)::numeric / DATE_PART('day', DATE_TRUNC('month', dis.date) + INTERVAL '1 month' - INTERVAL '1 day')::numeric), 2) as avg_occupancy,
    
    -- C107: Bed occupancy percentage ((Average occupancy / Beds) x 100)
    CASE 
        WHEN AVG(dis.bed_capacity) > 0 
        THEN ROUND(((SUM(dis.current_male_admissions + dis.current_female_admissions)::numeric / DATE_PART('day', DATE_TRUNC('month', dis.date) + INTERVAL '1 month' - INTERVAL '1 day')::numeric) / AVG(dis.bed_capacity)::numeric * 100), 2)
        ELSE 0 
    END as bed_occupancy_percent,
    
    -- Additional statistics
    SUM(dis.current_male_admissions) as current_male_admissions,
    SUM(dis.current_female_admissions) as current_female_admissions,
    SUM(dis.medically_discharged) as medically_discharged,
    SUM(dis.released) as released

FROM public.daily_inpatient_statistic dis
JOIN public.ward w ON dis.ward_id = w.id
WHERE dis.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND dis.date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    w.name,
    w.id,
    DATE_PART('year', dis.date),
    DATE_PART('month', dis.date),
    DATE_TRUNC('month', dis.date)
ORDER BY w.name;