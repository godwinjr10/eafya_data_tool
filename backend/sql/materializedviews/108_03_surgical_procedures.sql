CREATE MATERIALIZED VIEW reporting.108_surgical_procedures AS
-- 3.1 Obstetrics
SELECT 
    '3.1' AS section,
    'SP01' AS code,
    'Caesarean sections' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (503, 504)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.1' AS section,
    'SP02' AS code,
    'Obstetric fistula repair (RVF, VVF, RVVF)' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (503, 504)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.1' AS section,
    'SP03' AS code,
    'Evacuations (incomplete abortion)' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (503, 504)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.1' AS section,
    'SP04' AS code,
    'Other Obstetric Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (503, 504)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.2 Gynaecology
SELECT 
    '3.2' AS section,
    'GN01' AS code,
    'Laparotomy for ovarian surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (503)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.2' AS section,
    'GN02' AS code,
    'Abdominal hysterectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (602)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.2' AS section,
    'GN03' AS code,
    'Vaginal hysterectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (603)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.2' AS section,
    'GN04' AS code,
    'Myomectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (604)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.2' AS section,
    'GN05' AS code,
    'Laparotomy for ectopic pregnancy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (605)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.2' AS section,
    'GN06' AS code,
    'Other gynaecological surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (606)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.3 Plastic Surgery
SELECT 
    '3.3' AS section,
    'PR01' AS code,
    'Skin grafting' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (701)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.3' AS section,
    'PR02' AS code,
    'Release of contractures (burns)' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (702)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.3' AS section,
    'PR03' AS code,
    'Cleft lip and palate surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (703)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.3' AS section,
    'PR04' AS code,
    'Other plastic surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (704)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.4 Cardiothoracic Surgery
SELECT 
    '3.4' AS section,
    'CS01' AS code,
    'Thoracotomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (801)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.4' AS section,
    'CS02' AS code,
    'Coronary artery bypass graft' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (802)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.4' AS section,
    'CS03' AS code,
    'Heart valve surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (803)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.4' AS section,
    'CS04' AS code,
    'Atrio/ventricular septal defect surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (804)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.4' AS section,
    'CS05' AS code,
    'Other cardiothoracic surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (805)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.5 Vascular Surgery
SELECT 
    '3.5' AS section,
    'VS01' AS code,
    'Varicose vein - ligation & stripping' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (901)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.5' AS section,
    'VS02' AS code,
    'Repair of abdominal aortic aneurysm' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (902)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.5' AS section,
    'VS03' AS code,
    'Other vascular surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (903)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.6 Paediatric Surgery
SELECT 
    '3.6' AS section,
    'PS01' AS code,
    'Laparotomy for intussusception' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1101)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.6' AS section,
    'PS02' AS code,
    'Neonatal laparotomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1102)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.6' AS section,
    'PS03' AS code,
    'Neonatal colostomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1103)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.6' AS section,
    'PS04' AS code,
    'Pull through' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1104)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.6' AS section,
    'PS05' AS code,
    'Ramstedt''s pyloromyotomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1105)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.6' AS section,
    'PS06' AS code,
    'Gastroschisis repair' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1106)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.6' AS section,
    'PS07' AS code,
    'Other paediatric surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1107)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.7 Ocular Surgery
SELECT 
    '3.7' AS section,
    'OC01' AS code,
    'Cataract Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1301)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.7' AS section,
    'OC02' AS code,
    'Glaucoma Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1302)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.7' AS section,
    'OC03' AS code,
    'Orbital Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1303)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.7' AS section,
    'OC04' AS code,
    'Ophthalmic laser Interventions' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1304)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.7' AS section,
    'OC05' AS code,
    'Surgery for penetrating eye injury' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1305)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.7' AS section,
    'OC06' AS code,
    'Trachoma Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1306)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.7' AS section,
    'OC07' AS code,
    'Other ocular surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1307)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.8 Trauma & Orthopaedic Surgery
SELECT 
    '3.8' AS section,
    'OR01' AS code,
    'Internal fixation' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1401)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.8' AS section,
    'OR02' AS code,
    'External fixation' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1402)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.8' AS section,
    'OR03' AS code,
    'Arthoplasty' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1403)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.8' AS section,
    'OR04' AS code,
    'Amputation' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1404)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.8' AS section,
    'OR05' AS code,
    'Spinal surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1405)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.8' AS section,
    'OR06' AS code,
    'Arthroscopy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1406)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.8' AS section,
    'OR07' AS code,
    'Other trauma & orthopaedic surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1407)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.9 Endocrine Surgery
SELECT 
    '3.9' AS section,
    'ES01' AS code,
    'Thyroidectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1501)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.9' AS section,
    'ES02' AS code,
    'Adrenalectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1502)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.9' AS section,
    'ES03' AS code,
    'Other endocrine surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1503)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.10 Neuro surgery
SELECT 
    '3.10' AS section,
    'NS01' AS code,
    'Brain surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1601)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.10' AS section,
    'NS02' AS code,
    'Burr hole' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1602)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.10' AS section,
    'NS03' AS code,
    'Craniotomy/craniectomy for trauma' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1603)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.10' AS section,
    'NS04' AS code,
    'ETV/CPC (Endoscopic 3rd Ventriculostomy/cauterisation) choroid plexus' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1604)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.10' AS section,
    'NS05' AS code,
    'Spinabifida surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1605)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.10' AS section,
    'NS06' AS code,
    'VP shunt' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1606)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.10' AS section,
    'NS07' AS code,
    'Other neurosurgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1607)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.11 ENT Surgery
SELECT 
    '3.11' AS section,
    'TS01' AS code,
    'Tracheostomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1701)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.11' AS section,
    'TS02' AS code,
    'Adenotonsillectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1702)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.11' AS section,
    'TS03' AS code,
    'Nasal surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1703)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.11' AS section,
    'TS04' AS code,
    'Laryngological surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1704)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.11' AS section,
    'TS05' AS code,
    'Otological surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1705)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.11' AS section,
    'TS06' AS code,
    'ENT endoscopic surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1706)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.11' AS section,
    'TS07' AS code,
    'Other ENT surgeries' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1707)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.12 Breast Surgery
SELECT 
    '3.12' AS section,
    'BS01' AS code,
    'Mastectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1801)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.12' AS section,
    'BS02' AS code,
    'Other breast surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1802)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.13 Urology
SELECT 
    '3.13' AS section,
    'UR01' AS code,
    'Prostatectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1901)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR02' AS code,
    'Renal surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1902)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR03' AS code,
    'Uretinal surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1903)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR04' AS code,
    'Testicular Surgery (Orchidopex, ochidectomy,BSO)' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1904)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR05' AS code,
    'Urine diversion (SPC, Nephrostomy)' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1905)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR06' AS code,
    'Kidney transplant' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1906)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR07' AS code,
    'Hydrocelectomy(LF)' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1907)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.13' AS section,
    'UR08' AS code,
    'Other urological surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (1908)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.14 Upper GI Surgery
SELECT 
    '3.14' AS section,
    'UG01' AS code,
    'Gastric Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2001)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.14' AS section,
    'UG02' AS code,
    'Ileostomy surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2002)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.14' AS section,
    'UG03' AS code,
    'Laparoscopic Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2003)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.14' AS section,
    'UG04' AS code,
    'Other upper GI surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2004)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.15 Hepatobiliary Surgery
SELECT 
    '3.15' AS section,
    'HS01' AS code,
    'Cholecystectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2101)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.15' AS section,
    'HS02' AS code,
    'Liver surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2102)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.15' AS section,
    'HS03' AS code,
    'Pancreatic surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2103)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.15' AS section,
    'HS04' AS code,
    'Splenic surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2104)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.15' AS section,
    'HS05' AS code,
    'Billo-intestinal diversion' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2105)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.15' AS section,
    'HS06' AS code,
    'Other hepatobiliary surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2106)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.16 Colorectal Surgery
SELECT 
    '3.16' AS section,
    'CR01' AS code,
    'Colectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2201)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.16' AS section,
    'CR02' AS code,
    'Rectal Cancer Surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2202)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.16' AS section,
    'CR03' AS code,
    'Colostomy surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2203)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.16' AS section,
    'CR04' AS code,
    'Appendicectomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2204)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.16' AS section,
    'CR05' AS code,
    'Other colorectal surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2205)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.17 Hernia Surgery
SELECT 
    '3.17' AS section,
    'HE01' AS code,
    'Hernia Repair' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2301)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.18 Oral & Maxillofacial Surgery
SELECT 
    '3.18' AS section,
    'OM01' AS code,
    'Mandible surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2401)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.18' AS section,
    'OM02' AS code,
    'Salivary gland surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2402)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.18' AS section,
    'OM03' AS code,
    'Neck dissection' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2403)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.18' AS section,
    'OM04' AS code,
    'Internal fixation for facial trauma' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2404)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.18' AS section,
    'OM05' AS code,
    'Dental surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2405)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.18' AS section,
    'OM06' AS code,
    'Other oral & maxillofacial surgery' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2406)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

-- 3.19 Other surgical procedures
SELECT 
    '3.19' AS section,
    'OT01' AS code,
    'Debridement' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2501)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.19' AS section,
    'OT02' AS code,
    'Incision and drainage of abscesses' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2502)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.19' AS section,
    'OT03' AS code,
    'Circumcision' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2503)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.19' AS section,
    'OT04' AS code,
    'Other laparotomy' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2504)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created)

UNION ALL

SELECT 
    '3.19' AS section,
    'OT05' AS code,
    'Other surgical procedures not listed' AS procedure,
    EXTRACT(YEAR FROM date_created) AS year,
    EXTRACT(MONTH FROM date_created) AS month,
    COALESCE(COUNT(*), 0) AS procedure_count
FROM 
    reporting.patient_major_theater
WHERE 
    major_theater_id IN (2505)
GROUP BY 
    EXTRACT(YEAR FROM date_created),
    EXTRACT(MONTH FROM date_created);

-- Create indexes for better performance
CREATE INDEX idx_hmis108_surgical_procedures_section ON reporting.hmis108_surgical_procedures_monthly(section);
CREATE INDEX idx_hmis108_surgical_procedures_code ON reporting.hmis108_surgical_procedures_monthly(code);
CREATE INDEX idx_hmis108_surgical_procedures_year_month ON reporting.hmis108_surgical_procedures_monthly(year, month);