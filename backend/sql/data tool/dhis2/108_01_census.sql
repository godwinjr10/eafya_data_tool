CREATE MATERIALIZED VIEW reporting.dhis2_census_information AS
SELECT 
    "Report Month",
    "Wards",
    'CI01' AS dataelement_code,
    "A Cl01. No. of beds" AS value
FROM reporting."108_01_census_information"
UNION ALL
SELECT 
    "Report Month",
    "Wards",
    'CI02' AS dataelement_code,
    "B Cl02. No. of admissions" AS value
FROM reporting."108_01_census_information"
UNION ALL
SELECT 
    "Report Month",
    "Wards",
    'CI03' AS dataelement_code,
    "C Cl03. No. of deaths" AS value
FROM reporting."108_01_census_information"
UNION ALL
SELECT 
    "Report Month",
    "Wards",
    'CI04' AS dataelement_code,
    "D Cl04. Patient days" AS value
FROM reporting."108_01_census_information"
UNION ALL
SELECT 
    "Report Month",
    "Wards",
    'CI05' AS dataelement_code,
    "E Cl05. Average length of stay (E=D/B)" AS value
FROM reporting."108_01_census_information"
UNION ALL
SELECT 
    "Report Month",
    "Wards",
    'CI06' AS dataelement_code,
    "F Cl06. Average occupancy (F=D/30 days)" AS value
FROM reporting."108_01_census_information"
UNION ALL
SELECT 
    "Report Month",
    "Wards",
    'CI07' AS dataelement_code,
    "G Cl07. Bed occupancy (F/A)x100" AS value
FROM reporting."108_01_census_information"
ORDER BY "Report Month", "Wards", dataelement_code;