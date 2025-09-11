-- =====================================================
-- HMIS 108: Referrals Report
-- Section 2: Referrals
-- =====================================================

CREATE MATERIALIZED VIEW reporting."108_04_referrals" AS

SELECT 
    TO_CHAR(encounter_date, 'YYYYMM') AS report_month,
    COUNT(CASE WHEN referral_type = 'OUTGOING' THEN 1 END) AS "Outgoing Referrals",
    COUNT(CASE WHEN referral_type = 'INCOMING' THEN 1 END) AS "Incoming Referrals",
    COUNT(CASE WHEN referral_type = 'SELF' THEN 1 END) AS "Self Referrals",
    COUNT(CASE WHEN referral_type = 'RUNAWAY' THEN 1 END) AS "Runaway Patients"
FROM reporting.patient_referrals
GROUP BY TO_CHAR(encounter_date, 'YYYYMM')
ORDER BY report_month DESC;
