WITH c_agg AS (
    SELECT 
        h.hmis_code,
        c.report_month,
        SUM(COALESCE(c."0-28d Male",0))   AS m_0_28d_male,
        SUM(COALESCE(c."0-28d Female",0)) AS m_0_28d_female,
        SUM(COALESCE(c."29d-4y Male",0))  AS m_29d_4y_male,
        SUM(COALESCE(c."29d-4y Female",0))AS m_29d_4y_female,
        SUM(COALESCE(c."5-9y Male",0))    AS m_5_9y_male,
        SUM(COALESCE(c."5-9y Female",0))  AS m_5_9y_female,
        SUM(COALESCE(c."10-19y Male",0))  AS m_10_19y_male,
        SUM(COALESCE(c."10-19y Female",0))AS m_10_19y_female,
        SUM(COALESCE(c."20y+ Male",0))    AS m_20y_plus_male,
        SUM(COALESCE(c."20y+ Female",0))  AS m_20y_plus_female
    FROM reporting."105_01_conditions" c
    LEFT JOIN reporting.hmis_eafya_conditions_mapping h 
           ON h.disease_id = c.disease_id
    WHERE c.report_month = '202501'
    GROUP BY h.hmis_code, c.report_month
)
SELECT 
    c_agg.report_month,
    m.section_id,
    m.section_name,
    m.hmis_code,
    m.hmis_name,
    m.dataelement,
    d.categoryoptioncombo, 
    COALESCE(
        CASE d.categoryoptioncombo
            WHEN 'zh2zAaHyYQx' THEN c_agg.m_0_28d_male
            WHEN 'wDiX34aiw6i' THEN c_agg.m_0_28d_female
            WHEN 'V2OuNTRI6ua' THEN c_agg.m_29d_4y_male
            WHEN 'huBy3W5qiD2' THEN c_agg.m_29d_4y_female
            WHEN 'F1rms8f9I9a' THEN c_agg.m_5_9y_male
            WHEN 'Crc5reUlspd' THEN c_agg.m_5_9y_female
            WHEN 'c7gvocRdg0f' THEN c_agg.m_10_19y_male
            WHEN 'u3CkZqMHfHP' THEN c_agg.m_10_19y_female
            WHEN 'dCKzhhINakS' THEN c_agg.m_20y_plus_male
            WHEN 'XVHTeecEOM3' THEN c_agg.m_20y_plus_female
        END,
    0) AS value
FROM reporting.dataelements_conditions m
LEFT JOIN c_agg ON c_agg.hmis_code = m.hmis_code
LEFT JOIN reporting.dhis2_dataelements_1051 d ON d.dataelement = m.dataelement
WHERE m.section_id = '1.3.3'
ORDER BY string_to_array(m.section_id, '.')::int[], m.hmis_code;