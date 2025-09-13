import axios from "axios";
import { pool } from "../../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const dhis2Auth = {
  username: process.env.ACTIVE_UA1_DHIS2_USERNAME,
  password: process.env.ACTIVE_UA1_DHIS2_PASSWORD,
};

//const ORG_UNIT = 'h40pKp93Mtc'; nagguru
const ORG_UNIT = "h40pKp93Mtc";
const ATTRIBUTE_OPTION_COMBO = "Lf2Axb9E6B4";

const fetchStructuredDataQuery = (period) => `
WITH all_data AS (
    -- Antenatal Lab Tests (uses dhis2_data_element_id, no category option combo)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        'default' as optioncombo_name,
        'HllvX50cXC0' as categoryoptioncombo,
        SUM(COALESCE(c.count, 0)) AS value,
        'antenatal_lab' as section_type
FROM reporting."105_02_anc_lab" c
    JOIN reporting.dhis_eafya_mapping_labtests d ON d.eafya_labtest_id = 823 AND d.hmis_code = 'AN07'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    --WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name

    UNION ALL

    -- Antenatal Age Groups (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c."Below_15yrs", 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15_19yrs", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20_24yrs", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25_50yrs", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50+yrs", 0))
            ELSE 0
        END AS value,
        'antenatal_age' as section_type
    FROM (
        SELECT report_month, hmis_code, "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs" FROM reporting."105_02_anc_8"
        UNION ALL
        SELECT report_month, hmis_code, "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs" FROM reporting."105_02_anc_4"
        UNION ALL
        SELECT report_month, hmis_code, "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs" FROM reporting."105_02_anc_1"
        UNION ALL
        SELECT report_month, hmis_code, "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs" FROM reporting."105_02_anc_total"
    ) c
    JOIN reporting.dhis_eafya_mapping_antenatal d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Antenatal IPT Doses (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.below_15, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c.age_15_19, 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c.age_20_24, 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c.age_25_49, 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c.age_50_plus, 0))
            ELSE 0
        END AS value,
        'antenatal_ipt' as section_type
    FROM reporting."105_02_antenantal_6" c
    JOIN reporting.dhis_eafya_mapping_antenatal d ON d.hmis_code = 'AN06'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Antenatal Supplements and Other (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c."Below 15 Years", 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15 - 19 Years", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20 - 24 Years", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25 - 49 Years", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50+ Years", 0))
            ELSE 0
        END AS value,
        'antenatal_supplements' as section_type
    FROM (
        SELECT report_month, hmis_code, "Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years" FROM reporting."105_02_antenantal_8"
        UNION ALL
        SELECT report_month, hmis_code, "Below 15 Years", "15 - 19 Years", "20 - 24 Years", "25 - 49 Years", "50+ Years" FROM reporting."105_02_antenantal_9"
        UNION ALL
        SELECT report_month, hmis_code, below_15, age_15_19, age_20_24, age_25_49, age_50_plus FROM reporting."105_02_antenatal_10"
        UNION ALL
        SELECT report_month, hmis_code, below_15, age_15_19, age_20_24, age_25_49, age_50_plus FROM reporting."105_02_antenatal_12"
    ) c
    JOIN reporting.dhis_eafya_mapping_antenatal d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Child Health Vaccines (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'zh2zAaHyYQx' THEN SUM(COALESCE(c."0-5m Male", 0))
            WHEN 'wDiX34aiw6i' THEN SUM(COALESCE(c."0-5m Female", 0))
            WHEN 'V2OuNTRI6ua' THEN SUM(COALESCE(c."6-11m Male", 0))
            WHEN 'huBy3W5qiD2' THEN SUM(COALESCE(c."6-11m Female", 0))
            WHEN 'F1rms8f9I9a' THEN SUM(COALESCE(c."12-59m Male", 0))
            WHEN 'Crc5reUlspd' THEN SUM(COALESCE(c."12-59m Female", 0))
            WHEN 'c7gvocRdg0f' THEN SUM(COALESCE(c."5-14y Male", 0))
            WHEN 'u3CkZqMHfHP' THEN SUM(COALESCE(c."5-14y Female", 0))
            ELSE 0
        END AS value,
        'child_health' as section_type
    FROM reporting."105_02_child_health" c
    JOIN reporting.dhis_eafya_mapping_vaccines d ON d.eafya_vaccine_id = c.vaccine_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Child Immunization (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'zh2zAaHyYQx' THEN SUM(COALESCE(c."Under1y", 0))
            WHEN 'V2OuNTRI6ua' THEN SUM(COALESCE(c."1-4y", 0))
            WHEN 'F1rms8f9I9a' THEN SUM(COALESCE(c."5-14y", 0))
            ELSE 0
        END AS value,
        'child_immunization' as section_type
    FROM reporting."105_02_child_immunization" c
    JOIN reporting.dhis_eafya_mapping_vaccines d ON d.eafya_vaccine_id = c.vaccine_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Deliveries (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.below_15_years, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15-19_years", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20-24_years", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25-49_years", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50+_years", 0))
            ELSE 0
        END AS value,
        'maternity_deliveries' as section_type
    FROM reporting."105_02_maternity_deliveries" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Live Births (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        SUM(COALESCE(c.total_births, 0)) AS value,
        'maternity_livebirths' as section_type
    FROM reporting."105_02_maternity_livebirths" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Maternal Deaths (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.under_15_years, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15_to_19_years", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20_to_24_years", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25_to_49_years", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50_plus_years", 0))
            ELSE 0
        END AS value,
        'maternity_deaths' as section_type
    FROM reporting."105_02_maternity_maternal_deaths" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Other Indicators (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        SUM(COALESCE(c.total_mothers_preterm_labour, 0)) AS value,
        'maternity_preterm_labour' as section_type
    FROM reporting."105_02_maternity_mothers_preterm_labour" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Preterm Births (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        SUM(COALESCE(c.total_preterm_births_in_unit, 0)) AS value,
        'maternity_preterm_births' as section_type
    FROM reporting."105_02_maternity_preterm_births_in_unit" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Totals (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        SUM(COALESCE(c.value, 0)) AS value,
        'maternity_totals' as section_type
    FROM reporting."105_02_maternity_totals" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Maternity Uterotonics (uses data_element_id and name)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        SUM(COALESCE(c.oxytocin + c.misoprostol + c.carbetocin + c.ergometrine, 0)) AS value,
        'maternity_uterotonics' as section_type
    FROM reporting."105_02_maternity_uterotonics" c
    JOIN reporting.dhis_eafya_mapping_maternity_final d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.name, d.categoryoptioncombo_uid

    UNION ALL

    -- Postnatal Attendance (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.below_15yrs, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15_19yrs", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20_24yrs", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25_50yrs", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50+yrs", 0))
            ELSE 0
        END AS value,
        'postnatal_attendance' as section_type
    FROM reporting.postnatal_attendance c
    JOIN reporting.dhis_eafya_mapping_postnatal d ON d.hmis_code = 'PN01'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Postnatal Community Referral (uses data_element_id)
    SELECT 
        c.month as report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.below_15yrs, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15_19yrs", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20_24yrs", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25_50yrs", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50yrs+", 0))
            ELSE 0
        END AS value,
        'postnatal_referral' as section_type
    FROM reporting.postnatal_community_referal c
    JOIN reporting.dhis_eafya_mapping_postnatal d ON d.hmis_code = 'PN02'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.month = '${period}'
    GROUP BY c.month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Postnatal TB (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.below_15yrs, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c."15_19yrs", 0))
            WHEN 'c9JPAeQh49R' THEN SUM(COALESCE(c."20_24yrs", 0))
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25_50yrs", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50plus", 0))
            ELSE 0
        END AS value,
        'postnatal_tb' as section_type
    FROM reporting.postnatal_tb c
    JOIN reporting.dhis_eafya_mapping_postnatal d ON d.hmis_code = 'PN03'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Family Planning Contraceptives (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        SUM(COALESCE(c.total_dispensed, 0)) AS value,
        'family_planning_contraceptives' as section_type
    FROM reporting."105_family_planning_contraceptives" c
    JOIN reporting.dhis_eafya_mapping_familyplanning d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid
    

    UNION ALL

    -- Family Planning Theatre (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'QGprPUGJp4N' THEN SUM(COALESCE(c."25_49yrs", 0))
            WHEN 'sxBbkmHxnBP' THEN SUM(COALESCE(c."50plus_yrs", 0))
            ELSE 0
        END AS value,
        'family_planning_theatre' as section_type
    FROM reporting."105_family_planning_theatre" c
    JOIN reporting.dhis_eafya_mapping_familyplanning d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Family Planning Visits (uses data_element_id)
    SELECT 
        c.report_month,
        d.data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'ksBfihkwBeu' THEN SUM(COALESCE(c.under_15_new, 0))
            WHEN 'BhgBkEr8t85' THEN SUM(COALESCE(c."15_19_new", 0))
            WHEN 'HWLodA23UGt' THEN SUM(COALESCE(c."20_24_new", 0))
            WHEN 'CvQdPZAFY4k' THEN SUM(COALESCE(c."25_49_new", 0))
            WHEN 'z5ewc0K90Q8' THEN SUM(COALESCE(c."50_plus_new", 0))
            WHEN 'HTMSuJ2wUcx' THEN SUM(COALESCE(c.under_15_revisit, 0))
            WHEN 'YpZHGtTSv2K' THEN SUM(COALESCE(c."15_19_revisit", 0))
            WHEN 'BhfsRQm30RP' THEN SUM(COALESCE(c."20_24_revisit", 0))
            WHEN 'nAjAOWdxMh8' THEN SUM(COALESCE(c."25_49_revisit", 0))
            WHEN 'z5ewc0K90Q8' THEN SUM(COALESCE(c."50_plus_revisit", 0))
            ELSE 0
        END AS value,
        'family_planning_visits' as section_type
    FROM reporting."105_family_planning_visits" c
    JOIN reporting.dhis_eafya_mapping_familyplanning d ON d.hmis_code = c.hmis_code
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- HPV Vaccination (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'zh2zAaHyYQx' THEN SUM(COALESCE(c."10y Male", 0))
            WHEN 'wDiX34aiw6i' THEN SUM(COALESCE(c."10y Female", 0))
            WHEN 'V2OuNTRI6ua' THEN SUM(COALESCE(c."11y+ Male", 0))
            WHEN 'huBy3W5qiD2' THEN SUM(COALESCE(c."11y+ Female", 0))
            ELSE 0
        END AS value,
        'hpv_vaccination' as section_type
    FROM reporting."105_02_hpv_vaccination" c
    JOIN reporting.dhis_eafya_mapping_vaccines d ON d.eafya_vaccine_id = c.vaccine_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Tetanus Vaccination (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        d.categoryoptioncombo_name as optioncombo_name,
        d.categoryoptioncombo_uid as categoryoptioncombo,
        CASE d.categoryoptioncombo_uid
            WHEN 'JtoaNPpY2BF' THEN SUM(COALESCE(c.pregnant, 0))
            WHEN 'PwuKTzy4vLJ' THEN SUM(COALESCE(c.non_pregnant, 0))
            ELSE 0
        END AS value,
        'tetanus_vaccination' as section_type
    FROM reporting."105_02_tetanus_vaccination" c
    JOIN reporting.dhis_eafya_mapping_vaccines d ON d.eafya_vaccine_id = c.vaccine_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name, d.categoryoptioncombo_name, d.categoryoptioncombo_uid

    UNION ALL

    -- Commodities (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        'default' as optioncombo_name,
        'HllvX50cXC0' as categoryoptioncombo,
        SUM(COALESCE(c.qty_consumed, 0)) AS value,
        'commodities' as section_type
    FROM reporting."105_06_commodities" c
    JOIN reporting.dhis_eafya_mapping_commodities d ON d.eafya_product_id = c.product_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name
)
SELECT 
    report_month,
    data_element_id,
    dataelement_name,
    optioncombo_name,
    categoryoptioncombo,
    SUM(value) AS value
FROM all_data
WHERE value > 0
GROUP BY report_month, data_element_id, dataelement_name, optioncombo_name, categoryoptioncombo
ORDER BY report_month, data_element_id, optioncombo_name
`;

export async function fetchStructuredData(period) {
  const { rows } = await pool.query(fetchStructuredDataQuery(period));
  return rows;
}

export async function pushToDHIS2(dataset, period) {
  try {
    const rows = await fetchStructuredData(period);
    if (!rows || rows.length === 0) {
      throw new Error("No data found to push to DHIS2");
    }

    // Format data for DHIS2
    const dataValues = [];
    for (const row of rows) {
      dataValues.push({
        dataElement: row.data_element_id,
        value: parseInt(row.value) || 0,
        categoryOptionCombo: row.categoryoptioncombo,
      });
    }

    // Ensure DHIS2 base URL is properly formatted
    const baseUrl = process.env.ACTIVE_DHIS2_URL?.trim();
    if (!baseUrl) {
      throw new Error("ACTIVE_DHIS2_URL is not configured");
    }

    // Construct the full URL, ensuring no double slashes
    const apiUrl = `${baseUrl.replace(/\/+$/, "")}/dataValueSets`;

    const dataValueSet = {
      dataSet: dataset,
      // period: period,
      period: "202507",
      orgUnit: ORG_UNIT,
      attributeOptionCombo: ATTRIBUTE_OPTION_COMBO,
      dataValues: dataValues,
    };

    // Log the final payload for verification
    console.log("Final DHIS2 payload:", JSON.stringify(dataValueSet, null, 2));
    console.log("Posting to DHIS2 URL:", apiUrl);

    try {
      const response = await axios.post(apiUrl, dataValueSet, {
        auth: dhis2Auth,
        headers: { "Content-Type": "application/json" },
      });

      console.log(`✅ Posted data for period ${period}:`, response.data.status);
      return {
        status: "success",
        summary: {
          total: rows.length,
          successful: rows.length,
          failed: 0,
        },
        successDetails: [
          {
            period: period,
            orgUnit: ORG_UNIT,
            status: response.data.status,
          },
        ],
        failureDetails: [],
      };
    } catch (err) {
      // Enhanced error logging
      console.error("❌ DHIS2 API Error Details:");
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        console.error("Data:", err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
      }

      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message;

      // console.error(`❌ Failed to post data for period ${REPORTING_PERIOD}:`, errorMessage);

      return {
        status: "error",
        summary: {
          total: rows.length,
          successful: 0,
          failed: rows.length,
        },
        successDetails: [],
        failureDetails: [
          {
            period: period,
            orgUnit: ORG_UNIT,
            error: errorMessage,
          },
        ],
      };
    }
  } catch (error) {
    console.error("❌ DHIS2 Push Failed:", error.message);
    throw error;
  }
}
