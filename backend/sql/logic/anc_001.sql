WITH ranked_visits AS (
  SELECT 
    patient_id,
    birth_date,
    gender,
    encounter_id,
    clinic,
    patient_visit_id,
    date_created,
    ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY date_created) AS visit_number
  FROM reporting.patient_antenatal
)
SELECT 
  patient_id,
  birth_date,
  gender,
  encounter_id,
  clinic,
  patient_visit_id,
  date_created,
  CASE visit_number
    WHEN 1 THEN 'ANC 1'
    WHEN 2 THEN 'ANC 2'
    WHEN 3 THEN 'ANC 3'
    WHEN 4 THEN 'ANC 4'
  END AS anc_label
FROM ranked_visits
WHERE visit_number <= 4
  AND patient_id IN (
    SELECT patient_id
    FROM ranked_visits
    WHERE visit_number IN (1, 2, 3, 4)
    GROUP BY patient_id
    HAVING COUNT(*) = 4
)
ORDER BY patient_id, visit_number;