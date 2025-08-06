-- HMIS 108 Census Information Query (Based on actual EHR database structure)
-- Aggregating from daily_inpatient_statistic table to create monthly HMIS 108 report

SELECT 
    DATE_PART('year', ds.date) as year,
    DATE_PART('month', ds.date) as month,
    w.name as ward_name,
    w.id as ward_id,
    
    -- C101: Number of beds (average bed capacity for the month)
    ROUND(AVG(ds.bed_capacity)::numeric, 0) as beds,
    
    -- C102: Number of admissions (sum of new admissions for the month)
    SUM(ds.new_admissions) as admissions,
    
    -- C103: Number of deaths (sum of deaths for the month)
    SUM(ds.deaths) as deaths,
    
    -- C104: Patient days (calculated from current admissions)
    SUM(ds.current_male_admissions + ds.current_female_admissions) as patient_days,
    
    -- C105: Average length of stay (Patient days / Admissions)
    CASE 
        WHEN SUM(ds.new_admissions) > 0 
        THEN ROUND((SUM(ds.current_male_admissions + ds.current_female_admissions)::numeric / SUM(ds.new_admissions)::numeric), 2) 
        ELSE 0 
    END as avg_length_of_stay,
    
    -- C106: Average occupancy (Patient days / days in month)
    ROUND((SUM(ds.current_male_admissions + ds.current_female_admissions)::numeric / DATE_PART('day', DATE_TRUNC('month', ds.date) + INTERVAL '1 month' - INTERVAL '1 day')::numeric), 2) as avg_occupancy,
    
    -- C107: Bed occupancy % ((Average occupancy / Beds) x 100)
    CASE 
        WHEN AVG(ds.bed_capacity) > 0 
        THEN ROUND(((SUM(ds.current_male_admissions + ds.current_female_admissions)::numeric / DATE_PART('day', DATE_TRUNC('month', ds.date) + INTERVAL '1 month' - INTERVAL '1 day')::numeric) / AVG(ds.bed_capacity)::numeric * 100), 2)
        ELSE 0 
    END as bed_occupancy_percent,
    
    -- Additional useful fields
    SUM(ds.current_male_admissions) as current_male_admissions,
    SUM(ds.current_female_admissions) as current_female_admissions,
    SUM(ds.medically_discharged) as medically_discharged,
    SUM(ds.released) as released

FROM daily_inpatient_statistic ds
JOIN ward w ON ds.ward_id = w.id
WHERE ds.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') -- Current reporting month
    AND ds.date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    DATE_PART('year', ds.date),
    DATE_PART('month', ds.date),
    w.name,
    w.id,
    DATE_TRUNC('month', ds.date)
ORDER BY 
    year DESC, 
    month DESC, 
    w.name;