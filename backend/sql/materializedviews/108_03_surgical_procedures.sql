CREATE MATERIALIZED VIEW reporting."108_surgical_procedures" AS
WITH surgical_data AS (
    SELECT 
        EXTRACT(YEAR FROM date_created) AS year,
        EXTRACT(MONTH FROM date_created) AS month,
        major_theater_id,
        COUNT(*) AS procedure_count
    FROM 
        reporting.patient_major_theater
    WHERE 
        major_theater_id IN (
            -- Obstetrics (503, 504)
            503, 504,
            -- Gynaecology (503, 602, 603, 604, 605, 606)
            602, 603, 604, 605, 606,
            -- Plastic Surgery (701, 702, 703, 704)
            701, 702, 703, 704,
            -- Cardiothoracic Surgery (801, 802, 803, 804, 805)
            801, 802, 803, 804, 805,
            -- Vascular Surgery (901, 902, 903)
            901, 902, 903,
            -- Paediatric Surgery (1101, 1102, 1103, 1104, 1105, 1106, 1107)
            1101, 1102, 1103, 1104, 1105, 1106, 1107,
            -- Ocular Surgery (1301, 1302, 1303, 1304, 1305, 1306, 1307)
            1301, 1302, 1303, 1304, 1305, 1306, 1307,
            -- Trauma & Orthopaedic Surgery (1401, 1402, 1403, 1404, 1405, 1406, 1407)
            1401, 1402, 1403, 1404, 1405, 1406, 1407,
            -- Endocrine Surgery (1501, 1502, 1503)
            1501, 1502, 1503,
            -- Neurosurgery (1601, 1602, 1603, 1604, 1605, 1606, 1607)
            1601, 1602, 1603, 1604, 1605, 1606, 1607,
            -- ENT Surgery (1701, 1702, 1703, 1704, 1705, 1706, 1707)
            1701, 1702, 1703, 1704, 1705, 1706, 1707,
            -- Breast Surgery (1801, 1802)
            1801, 1802,
            -- Urology (1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908)
            1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908,
            -- Upper GI Surgery (2001, 2002, 2003, 2004)
            2001, 2002, 2003, 2004,
            -- Hepatobiliary Surgery (2101, 2102, 2103, 2104, 2105, 2106)
            2101, 2102, 2103, 2104, 2105, 2106,
            -- Colorectal Surgery (2201, 2202, 2203, 2204, 2205)
            2201, 2202, 2203, 2204, 2205,
            -- Hernia Surgery (2301)
            2301,
            -- Oral & Maxillofacial Surgery (2401, 2402, 2403, 2404, 2405, 2406)
            2401, 2402, 2403, 2404, 2405, 2406,
            -- Other surgical procedures (2501, 2502, 2503, 2504, 2505)
            2501, 2502, 2503, 2504, 2505
        )
    GROUP BY 
        EXTRACT(YEAR FROM date_created),
        EXTRACT(MONTH FROM date_created),
        major_theater_id
)
SELECT 
    section,
    code,
    procedure,
    year,
    month,
    COALESCE(procedure_count, 0) AS procedure_count
FROM (
    -- 3.1 Obstetrics
    SELECT 
        '3.1' AS section,
        'SP01' AS code,
        'Caesarean sections' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id IN (503, 504) THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.1' AS section,
        'SP02' AS code,
        'Obstetric fistula repair (RVF, VVF, RVVF)' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id IN (503, 504) THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.1' AS section,
        'SP03' AS code,
        'Evacuations (incomplete abortion)' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id IN (503, 504) THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL    
    SELECT 
        '3.1' AS section,
        'SP04' AS code,
        'Other Obstetric Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id IN (503, 504) THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    -- 3.2 Gynaecology
    SELECT 
        '3.2' AS section,
        'GN01' AS code,
        'Laparotomy for ovarian surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 503 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL
    SELECT 
        '3.2' AS section,
        'GN02' AS code,
        'Abdominal hysterectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 602 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    SELECT 
        '3.2' AS section,
        'GN03' AS code,
        'Vaginal hysterectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 603 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    SELECT 
        '3.2' AS section,
        'GN04' AS code,
        'Myomectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 604 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    SELECT 
        '3.2' AS section,
        'GN05' AS code,
        'Laparotomy for ectopic pregnancy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 605 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.2' AS section,
        'GN06' AS code,
        'Other gynaecological surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 606 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.3 Plastic Surgery
    SELECT 
        '3.3' AS section,
        'PR01' AS code,
        'Skin grafting' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 701 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.3' AS section,
        'PR02' AS code,
        'Release of contractures (burns)' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 702 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.3' AS section,
        'PR03' AS code,
        'Cleft lip and palate surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 703 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.3' AS section,
        'PR04' AS code,
        'Other plastic surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 704 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.4 Cardiothoracic Surgery
    SELECT 
        '3.4' AS section,
        'CS01' AS code,
        'Thoracotomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 801 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    SELECT 
        '3.4' AS section,
        'CS02' AS code,
        'Coronary artery bypass graft' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 802 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL 
    SELECT 
        '3.4' AS section,
        'CS03' AS code,
        'Heart valve surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 803 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.4' AS section,
        'CS04' AS code,
        'Atrio/ventricular septal defect surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 804 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.4' AS section,
        'CS05' AS code,
        'Other cardiothoracic surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 805 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    -- 3.5 Vascular Surgery
    SELECT 
        '3.5' AS section,
        'VS01' AS code,
        'Varicose vein - ligation & stripping' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 901 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.5' AS section,
        'VS02' AS code,
        'Repair of abdominal aortic aneurysm' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 902 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.5' AS section,
        'VS03' AS code,
        'Other vascular surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 903 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.6 Paediatric Surgery
    SELECT 
        '3.6' AS section,
        'PS01' AS code,
        'Laparotomy for intussusception' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1101 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.6' AS section,
        'PS02' AS code,
        'Neonatal laparotomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1102 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    SELECT 
        '3.6' AS section,
        'PS03' AS code,
        'Neonatal colostomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1103 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.6' AS section,
        'PS04' AS code,
        'Pull through' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1104 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.6' AS section,
        'PS05' AS code,
        'Ramstedt''s pyloromyotomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1105 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL  
    SELECT 
        '3.6' AS section,
        'PS06' AS code,
        'Gastroschisis repair' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1106 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    
    UNION ALL
    
    SELECT 
        '3.6' AS section,
        'PS07' AS code,
        'Other paediatric surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1107 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    
    UNION ALL
    
    -- 3.7 Ocular Surgery
    SELECT 
        '3.7' AS section,
        'OC01' AS code,
        'Cataract Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1301 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.7' AS section,
        'OC02' AS code,
        'Glaucoma Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1302 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.7' AS section,
        'OC03' AS code,
        'Orbital Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1303 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.7' AS section,
        'OC04' AS code,
        'Ophthalmic laser Interventions' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1304 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.7' AS section,
        'OC05' AS code,
        'Surgery for penetrating eye injury' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1305 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL
    SELECT 
        '3.7' AS section,
        'OC06' AS code,
        'Trachoma Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1306 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.7' AS section,
        'OC07' AS code,
        'Other ocular surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1307 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.8 Trauma & Orthopaedic Surgery
    SELECT 
        '3.8' AS section,
        'OR01' AS code,
        'Internal fixation' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1401 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL 
    SELECT 
        '3.8' AS section,
        'OR02' AS code,
        'External fixation' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1402 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.8' AS section,
        'OR03' AS code,
        'Arthoplasty' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1403 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.8' AS section,
        'OR04' AS code,
        'Amputation' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1404 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month    
    UNION ALL   
    SELECT 
        '3.8' AS section,
        'OR05' AS code,
        'Spinal surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1405 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.8' AS section,
        'OR06' AS code,
        'Arthroscopy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1406 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL 
    SELECT 
        '3.8' AS section,
        'OR07' AS code,
        'Other trauma & orthopaedic surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1407 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL 
    -- 3.9 Endocrine Surgery
    SELECT 
        '3.9' AS section,
        'ES01' AS code,
        'Thyroidectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1501 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL 
    SELECT 
        '3.9' AS section,
        'ES02' AS code,
        'Adrenalectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1502 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.9' AS section,
        'ES03' AS code,
        'Other endocrine surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1503 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL
    -- 3.10 Neurosurgery
    SELECT 
        '3.10' AS section,
        'NS01' AS code,
        'Brain surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1601 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.10' AS section,
        'NS02' AS code,
        'Burr hole' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1602 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.10' AS section,
        'NS03' AS code,
        'Craniotomy/craniectomy for trauma' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1603 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL  
    SELECT 
        '3.10' AS section,
        'NS04' AS code,
        'ETV/CPC (Endoscopic 3rd Ventriculostomy/cauterisation) choroid plexus' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1604 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.10' AS section,
        'NS05' AS code,
        'Spinabifida surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1605 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL  
    SELECT 
        '3.10' AS section,
        'NS06' AS code,
        'VP shunt' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1606 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL 
    SELECT 
        '3.10' AS section,
        'NS07' AS code,
        'Other neurosurgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1607 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL  
    -- 3.11 ENT Surgery
    SELECT 
        '3.11' AS section,
        'TS01' AS code,
        'Tracheostomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1701 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month  
    UNION ALL   
    SELECT 
        '3.11' AS section,
        'TS02' AS code,
        'Adenotonsillectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1702 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.11' AS section,
        'TS03' AS code,
        'Nasal surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1703 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month   
    UNION ALL   
    SELECT 
        '3.11' AS section,
        'TS04' AS code,
        'Laryngological surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1704 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month    
    UNION ALL    
    SELECT 
        '3.11' AS section,
        'TS05' AS code,
        'Otological surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1705 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month    
    UNION ALL   
    SELECT 
        '3.11' AS section,
        'TS06' AS code,
        'ENT endoscopic surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1706 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.11' AS section,
        'TS07' AS code,
        'Other ENT surgeries' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1707 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.12 Breast Surgery
    SELECT 
        '3.12' AS section,
        'BS01' AS code,
        'Mastectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1801 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.12' AS section,
        'BS02' AS code,
        'Other breast surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1802 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.13 Urology
    SELECT 
        '3.13' AS section,
        'UR01' AS code,
        'Prostatectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1901 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR02' AS code,
        'Renal surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1902 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR03' AS code,
        'Uretinal surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1903 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR04' AS code,
        'Testicular Surgery (Orchidopex, ochidectomy,BSO)' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1904 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR05' AS code,
        'Urine diversion (SPC, Nephrostomy)' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1905 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR06' AS code,
        'Kidney transplant' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1906 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR07' AS code,
        'Hydrocelectomy(LF)' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1907 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.13' AS section,
        'UR08' AS code,
        'Other urological surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 1908 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.14 Upper GI Surgery
    SELECT 
        '3.14' AS section,
        'UG01' AS code,
        'Gastric Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2001 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.14' AS section,
        'UG02' AS code,
        'Ileostomy surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2002 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.14' AS section,
        'UG03' AS code,
        'Laparoscopic Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2003 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.14' AS section,
        'UG04' AS code,
        'Other upper GI surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2004 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.15 Hepatobiliary Surgery
    SELECT 
        '3.15' AS section,
        'HS01' AS code,
        'Cholecystectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2101 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.15' AS section,
        'HS02' AS code,
        'Liver surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2102 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.15' AS section,
        'HS03' AS code,
        'Pancreatic surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2103 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.15' AS section,
        'HS04' AS code,
        'Splenic surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2104 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL 
    SELECT 
        '3.15' AS section,
        'HS05' AS code,
        'Billo-intestinal diversion' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2105 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month 
    UNION ALL
    SELECT 
        '3.15' AS section,
        'HS06' AS code,
        'Other hepatobiliary surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2106 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.16 Colorectal Surgery
    SELECT 
        '3.16' AS section,
        'CR01' AS code,
        'Colectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2201 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.16' AS section,
        'CR02' AS code,
        'Rectal Cancer Surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2202 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.16' AS section,
        'CR03' AS code,
        'Colostomy surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2203 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.16' AS section,
        'CR04' AS code,
        'Appendicectomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2204 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.16' AS section,
        'CR05' AS code,
        'Other colorectal surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2205 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.17 Hernia Surgery
    SELECT 
        '3.17' AS section,
        'HE01' AS code,
        'Hernia Repair' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2301 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.18 Oral & Maxillofacial Surgery
    SELECT 
        '3.18' AS section,
        'OM01' AS code,
        'Mandible surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2401 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.18' AS section,
        'OM02' AS code,
        'Salivary gland surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2402 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.18' AS section,
        'OM03' AS code,
        'Neck dissection' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2403 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.18' AS section,
        'OM04' AS code,
        'Internal fixation for facial trauma' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2404 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.18' AS section,
        'OM05' AS code,
        'Dental surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2405 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.18' AS section,
        'OM06' AS code,
        'Other oral & maxillofacial surgery' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2406 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    -- 3.19 Other surgical procedures
    SELECT 
        '3.19' AS section,
        'OT01' AS code,
        'Debridement' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2501 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.19' AS section,
        'OT02' AS code,
        'Incision and drainage of abscesses' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2502 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.19' AS section,
        'OT03' AS code,
        'Circumcision' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2503 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.19' AS section,
        'OT04' AS code,
        'Other laparotomy' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2504 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
    UNION ALL
    SELECT 
        '3.19' AS section,
        'OT05' AS code,
        'Other surgical procedures not listed' AS procedure,
        year,
        month,
        SUM(CASE WHEN major_theater_id = 2505 THEN procedure_count ELSE 0 END) AS procedure_count
    FROM surgical_data
    GROUP BY year, month
) AS final_result
ORDER BY section, code, year, month;

-- Create indexes for better performance
CREATE INDEX idx_hmis108_surgical_procedures_section ON reporting."108_surgical_procedures"(section);
CREATE INDEX idx_hmis108_surgical_procedures_code ON reporting."108_surgical_procedures"(code);
CREATE INDEX idx_hmis108_surgical_procedures_year_month ON reporting."108_surgical_procedures"(year, month);
CREATE INDEX idx_hmis108_surgical_procedures_section_code ON reporting."108_surgical_procedures"(section, code);
CREATE INDEX idx_hmis108_surgical_procedures_year_month_section ON reporting."108_surgical_procedures"(year, month, section);