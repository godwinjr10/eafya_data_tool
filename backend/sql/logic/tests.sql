WITH procedures AS (
    -- Obstetric
    SELECT 'SP01' AS code, 'Caesarean Section' AS procedure, ARRAY[503,504] AS ids
    UNION ALL SELECT 'SP02', 'Obstetric fistula repair', ARRAY[503,504]
    UNION ALL SELECT 'SP03', 'Evacuation', ARRAY[503,504]
    UNION ALL SELECT 'SP04', 'Other Obstetric Surgery', ARRAY[503,504]

    -- Gynaecological
    UNION ALL SELECT 'GN01', 'Laparotomy for ovarian surgery', ARRAY[503]
    UNION ALL SELECT 'GN02', 'Abdominal hysterectomy', ARRAY[602]
    UNION ALL SELECT 'GN03', 'Vaginal hysterectomy', ARRAY[603]
    UNION ALL SELECT 'GN04', 'Myomectomy', ARRAY[604]
    UNION ALL SELECT 'GN05', 'Laparotomy for ectopic pregnancy', ARRAY[605]
    UNION ALL SELECT 'GN06', 'Other gynaecological surgery', ARRAY[606]

    -- General Surgery
    UNION ALL SELECT 'GS01', 'Appendicectomy', ARRAY[701]
    UNION ALL SELECT 'GS02', 'Herniorrhaphy', ARRAY[702]
    UNION ALL SELECT 'GS03', 'Hydrocelectomy', ARRAY[703]
    UNION ALL SELECT 'GS04', 'Mastectomy', ARRAY[704]
    UNION ALL SELECT 'GS05', 'Thyroidectomy', ARRAY[705]
    UNION ALL SELECT 'GS06', 'Skin grafts', ARRAY[706]
    UNION ALL SELECT 'GS07', 'Other general surgery', ARRAY[707]

    -- Orthopaedic
    UNION ALL SELECT 'OR01', 'Fracture reduction', ARRAY[801]
    UNION ALL SELECT 'OR02', 'Open fracture treatment', ARRAY[802]
    UNION ALL SELECT 'OR03', 'Internal fixation', ARRAY[803]
    UNION ALL SELECT 'OR04', 'External fixation', ARRAY[804]
    UNION ALL SELECT 'OR05', 'Amputation', ARRAY[805]
    UNION ALL SELECT 'OR06', 'Other orthopaedic surgery', ARRAY[806]

    -- ENT
    UNION ALL SELECT 'EN01', 'Tonsillectomy', ARRAY[901]
    UNION ALL SELECT 'EN02', 'Adenoidectomy', ARRAY[902]
    UNION ALL SELECT 'EN03', 'Myringotomy', ARRAY[903]
    UNION ALL SELECT 'EN04', 'Other ENT surgery', ARRAY[904]

    -- Ophthalmology
    UNION ALL SELECT 'OP01', 'Cataract extraction', ARRAY[1001]
    UNION ALL SELECT 'OP02', 'Trabeculectomy', ARRAY[1002]
    UNION ALL SELECT 'OP03', 'Other ophthalmological surgery', ARRAY[1003]

    -- Urology
    UNION ALL SELECT 'UR01', 'Prostatectomy', ARRAY[1101]
    UNION ALL SELECT 'UR02', 'Cystostomy', ARRAY[1102]
    UNION ALL SELECT 'UR03', 'Other urological surgery', ARRAY[1103]

    -- Dental / Maxillofacial
    UNION ALL SELECT 'DN01', 'Tooth extraction', ARRAY[1201]
    UNION ALL SELECT 'DN02', 'Cleft lip repair', ARRAY[1202]
    UNION ALL SELECT 'DN03', 'Cleft palate repair', ARRAY[1203]
    UNION ALL SELECT 'DN04', 'Other dental/maxillofacial surgery', ARRAY[1204]
)
SELECT 
    p.code,
    p.procedure,
    EXTRACT(YEAR FROM t.date_created) AS year,
    EXTRACT(MONTH FROM t.date_created) AS month,
    COUNT(*) AS procedure_count
FROM 
    reporting.patient_major_theater t
JOIN 
    procedures p 
    ON t.major_theater_id = ANY(p.ids)
GROUP BY 
    p.code, p.procedure, year, month
ORDER BY 
    year DESC, month DESC, p.code;
