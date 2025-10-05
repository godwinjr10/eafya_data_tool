select 
s.section_id,
--s.hmis_id,
s.hmis_code,
m.hmis_code, 
s.hmis_name,
m.hmis_name, 
c.report_month,
m.section_id, 
m.section_name, 
    --m.dataelement, 
    --m.dataset_id, 
    --m.dataset_code, 
    --m.dataset_name,
--c.disease_id,
--c.disease,
SUM(COALESCE(c."0-28d Male", 0))   AS "0_28d_male",
SUM(COALESCE(c."0-28d Female", 0)) AS "0_28d_female",
SUM(COALESCE(c."29d-4y Male", 0))  AS "29d_4y_male",
SUM(COALESCE(c."29d-4y Female", 0))AS "29d_4y_female",
SUM(COALESCE(c."5-9y Male", 0))    AS "5_9y_male",
SUM(COALESCE(c."5-9y Female", 0))  AS "5_9y_female",
SUM(COALESCE(c."10-19y Male", 0))  AS "10_19y_male",
SUM(COALESCE(c."10-19y Female", 0))AS "10_19y_female",
SUM(COALESCE(c."20y+ Male", 0))    AS "20y_plus_male",
SUM(COALESCE(c."20y+ Female", 0))  AS "20y_plus_female",
string_to_array(s.section_id, '.')::int[] AS sort_key
from reporting."105_01_conditions" c
left outer join reporting.mapped_hmis_conditions s on s.eafya_id = c.disease_id 
left outer join reporting.dataelements_conditions m on m.hmis_code = s.hmis_code 
where c.report_month = '202501'
group by s.section_id, s.hmis_code, s.hmis_name, c.report_month, sort_key, m.hmis_code, m.hmis_name, m.section_id, m.section_name
order by s.section_id

/* Conditions Mapping */
SELECT 
    p."name" AS section_name,    
    LEFT(n."name", 4) AS hmis_code,  
    substring(n."name" FROM 7) AS hmis_name,           
    m.disease_id,
    d.five_character_icd_code,
    d.four_character_icd_code,
    d.name AS disease_name,
    d.simplified_name
FROM public.moh_report_group n
LEFT JOIN public.moh_report_group p ON n.parent_id = p.id
LEFT JOIN public.moh_report_item m ON m.moh_report_group_id = n.id
INNER JOIN public.disease d ON d.id = m.disease_id 
WHERE n.parent_id <> 0
  AND p."name" <> 'Epidemic Prone Disease'
ORDER BY n.parent_id;

/*** Mapped & Unmapped Conditions ***/
select 
m.section_id, 
m.section_name,
m.hmis_code,
m.hmis_name,
h.hmis_code, 
h.hmis_name,
h.disease_id,
h.disease_name 
from reporting.dataelements_conditions m
left join reporting.eafya_mappings_hmis h on h.hmis_code = m.hmis_code
ORDER BY string_to_array(m.section_id, '.')::int[], m.hmis_code

/** Final Conditions 105 Report **/
WITH c_agg AS (
    SELECT 
        h.hmis_code,
        c.report_month,
        SUM(COALESCE(c."0-28d Male",0))   AS "0_28d_male",
        SUM(COALESCE(c."0-28d Female",0)) AS "0_28d_female",
        SUM(COALESCE(c."29d-4y Male",0))  AS "29d_4y_male",
        SUM(COALESCE(c."29d-4y Female",0))AS "29d_4y_female",
        SUM(COALESCE(c."5-9y Male",0))    AS "5_9y_male",
        SUM(COALESCE(c."5-9y Female",0))  AS "5_9y_female",
        SUM(COALESCE(c."10-19y Male",0))  AS "10_19y_male",
        SUM(COALESCE(c."10-19y Female",0))AS "10_19y_female",
        SUM(COALESCE(c."20y+ Male",0))    AS "20y_plus_male",
        SUM(COALESCE(c."20y+ Female",0))  AS "20y_plus_female"
    FROM reporting."105_01_conditions" c
    LEFT JOIN reporting.hmis_eafya_conditions_mapping h ON h.disease_id = c.disease_id
    WHERE c.report_month = '202501'
    GROUP BY h.hmis_code, c.report_month
)
SELECT 
    c_agg.report_month,
    m.section_id,
    m.section_name,
    m.hmis_code,
    m.hmis_name,
    COALESCE(c_agg."0_28d_male",0)      AS "0_28d_male",
    COALESCE(c_agg."0_28d_female",0)    AS "0_28d_female",
    COALESCE(c_agg."29d_4y_male",0)     AS "29d_4y_male",
    COALESCE(c_agg."29d_4y_female",0)   AS "29d_4y_female",
    COALESCE(c_agg."5_9y_male",0)       AS "5_9y_male",
    COALESCE(c_agg."5_9y_female",0)     AS "5_9y_female",
    COALESCE(c_agg."10_19y_male",0)     AS "10_19y_male",
    COALESCE(c_agg."10_19y_female",0)   AS "10_19y_female",
    COALESCE(c_agg."20y_plus_male",0)   AS "20y_plus_male",
    COALESCE(c_agg."20y_plus_female",0) AS "20y_plus_female"
FROM reporting.dataelements_conditions m
LEFT JOIN c_agg ON c_agg.hmis_code = m.hmis_code
WHERE m.section_id = '1.3.1'
ORDER BY string_to_array(m.section_id, '.')::int[], m.hmis_code;

/** Table creation ***/
ALTER TABLE reporting.hmis_eafya_conditions_mapping
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;

-- 2️Make it the primary key
ALTER TABLE reporting.hmis_eafya_conditions_mapping
    ADD PRIMARY KEY (id);

-- Reset the sequence to next value after current max(id)
SELECT setval(
  pg_get_serial_sequence('reporting.hmis_eafya_conditions_mapping','id'),
  COALESCE((SELECT MAX(id) FROM reporting.hmis_eafya_conditions_mapping), 0) + 1,
  false
);