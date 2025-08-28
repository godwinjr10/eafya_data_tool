CREATE TABLE IF NOT EXISTS reporting.patient_lab_test
(
  patient_id VARCHAR(255)
, gender VARCHAR(6)
, birth_date TIMESTAMP
, parent_id BIGINT
, lab_test_id BIGINT
, lab_test VARCHAR(255)
, maximum_range VARCHAR(255)
, minimum_range VARCHAR(255)
, "result" VARCHAR(255)
, status VARCHAR(255)
, date_created TIMESTAMP
, last_updated TIMESTAMP
, encounter_id BIGINT
, clinic_session_id BIGINT
, "name" VARCHAR(255)
, patient_visit_id BIGINT
, visit_type_name VARCHAR(255)
, created_by_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_family_planning
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, patient_visit_id BIGINT
, clinic_session_id BIGINT
, patient_visit_id_1 BIGINT
, visit_type_id BIGINT
, encounter_id BIGINT
, created_by_id BIGINT
, user_first_name VARCHAR(255)
, user_last_name VARCHAR(255)
, user_other_name VARCHAR(255)
, clinic_id BIGINT
, clinic_name VARCHAR(255)
, visit_type_name VARCHAR(255)
, fp_administered_date TIMESTAMP
, last_updated TIMESTAMP
, patient_family_planning_id BIGINT
, family_planning_category_id BIGINT
, fp_category_name VARCHAR(255)
, family_planning_id BIGINT
, family_planning_name VARCHAR(255)
, is_new_to_method BOOLEAN
, treatment_stage VARCHAR(7)
)
;

CREATE TABLE IF NOT EXISTS reporting.hmis_eafya_mapping
(
  hmis_code BIGINT
, hmis_name VARCHAR(255)
, eafya_disease_id BIGINT
, eafya_disease_name VARCHAR(255)
)
;


CREATE TABLE IF NOT EXISTS reporting.patient_major_theater
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, major_theatre_name VARCHAR(255)
, category VARCHAR(255)
, room VARCHAR(255)
, date_created TIMESTAMP
, scheduled_date TIMESTAMP
, scheduled_time VARCHAR(255)
, last_updated TIMESTAMP
, patient_major_theatre_id BIGINT
, major_theater_id BIGINT
, major_theater_room_id BIGINT
, encounter_id BIGINT
, clinic_session_id BIGINT
, clinic_id BIGINT
, patient_visit_id BIGINT
, visit_type_id BIGINT
, administered_by_id BIGINT
, created_by_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_admissions
(
  admission_date TIMESTAMP
, admission_ward_id BIGINT
, admitting_doctor_id BIGINT
, assigned_doctor_id BIGINT
, brought_in_by_id BIGINT
, comments TEXT
, created_by_id BIGINT
, date_created TIMESTAMP
, discharge_care_plan TEXT
, discharge_date TIMESTAMP
, discharge_encounter_id BIGINT
, discharging_doctor_id BIGINT
, admission_encounter_id BIGINT
, escorting_nurse_id BIGINT
, is_closed BOOLEAN
, last_updated TIMESTAMP
, medical_discharge_date TIMESTAMP
, receiving_nurse_id BIGINT
, released_by_id BIGINT
, is_admission_approved BOOLEAN
, patient_visit_id BIGINT
, encounter_id BIGINT
, admission_ward_name VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS reporting.drugs_stock_level
(
  product_id BIGINT
, store_name VARCHAR(255)
, product_name VARCHAR(255)
, unit VARCHAR(255)
, quantity_consumed NUMERIC(27, 2)
, "level" NUMERIC(27, 2)
, unit_in_stock NUMERIC(27, 2)
, date_created TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS reporting.newborn
(
  id BIGINT
, baby_head_circumference DOUBLE PRECISION
, baby_height DOUBLE PRECISION
, baby_status VARCHAR(255)
, baby_weight DOUBLE PRECISION
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, first_apgar_score INTEGER
, last_updated TIMESTAMP
, patient_admission_id BIGINT
, patient_labour_monitor_id BIGINT
, resuscitation BOOLEAN
, second_apgar_score INTEGER
, abdomen_condition VARCHAR(255)
, anus_condition VARCHAR(255)
, assesed_by_id BIGINT
, assesed_on TIMESTAMP
, back_condition VARCHAR(255)
, chest_condition VARCHAR(255)
, ears_condition VARCHAR(255)
, eyes_condition VARCHAR(255)
, first_name VARCHAR(255)
, gender VARCHAR(255)
, general_condition VARCHAR(255)
, genitalia_condition VARCHAR(255)
, head_condition VARCHAR(255)
, hip_joints_condition VARCHAR(255)
, last_name VARCHAR(255)
, lower_limbs_condition VARCHAR(255)
, mouth_condition VARCHAR(255)
, neck_condition VARCHAR(255)
, newborn_complication VARCHAR(255)
, newborn_pmtct VARCHAR(255)
, nose_condition VARCHAR(255)
, other_name VARCHAR(255)
, reflexes_condition VARCHAR(255)
, third_apgar_score INTEGER
, upper_limbs_condition VARCHAR(255)
, baby_gender VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_labour_monitor
(
  id BIGINT
, bba BOOLEAN
, blood_loss_volume DOUBLE PRECISION
, blood_pressure VARCHAR(255)
, branch_id BIGINT
, cord_normal BOOLEAN
, created_by_id BIGINT
, date_created TIMESTAMP
, delivered_by_id BIGINT
, delivery_comments VARCHAR(255)
, delivery_mode VARCHAR(255)
, delivery_time TIMESTAMP
, drugs_given VARCHAR(255)
, episiotomy BOOLEAN
, first_stage_duration DOUBLE PRECISION
, gravidity VARCHAR(255)
, hours_since_rupture DOUBLE PRECISION
, induced_labour BOOLEAN
, induction_drug_route VARCHAR(255)
, induction_drugs VARCHAR(255)
, last_updated TIMESTAMP
, membranes_complete BOOLEAN
, mother_status VARCHAR(255)
, parity VARCHAR(255)
, patient_admission_id BIGINT
, perineal_tear BOOLEAN
, placenta_complete BOOLEAN
, placental_weight DOUBLE PRECISION
, pulse INTEGER
, repair BOOLEAN
, respiratory_rate INTEGER
, ruptured_membranes BOOLEAN
, second_stage_duration DOUBLE PRECISION
, temperature DOUBLE PRECISION
, vaginal_exams_count INTEGER
, edd TIMESTAMP
, lmp TIMESTAMP
, obstetric_care VARCHAR(255)
, obstetric_complication VARCHAR(255)
, pregnancy_history TEXT
);

CREATE TABLE IF NOT EXISTS reporting.patient_minor_theater
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, minor_theatre_name VARCHAR(255)
, category VARCHAR(255)
, date_created TIMESTAMP
, last_updated TIMESTAMP
, treatment_duration VARCHAR(26)
, patient_minor_theatre_id BIGINT
, minor_theater_id BIGINT
, encounter_id BIGINT
, created_by_id BIGINT
, clinic_session_id BIGINT
, clinic_id BIGINT
, patient_visit_id BIGINT
, visit_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_imaging
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, imaging_name VARCHAR(255)
, category VARCHAR(255)
, "result" TEXT
, status VARCHAR(255)
, date_created TIMESTAMP
, last_updated TIMESTAMP
, patient_imaging_id BIGINT
, imaging_id BIGINT
, created_by_id BIGINT
, clinic_session_id BIGINT
, clinic_id BIGINT
, patient_visit_id BIGINT
, visit_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_antenatal
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, encounter_id BIGINT
, clinic VARCHAR(255)
, patient_visit_id BIGINT
, date_created TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS reporting.encounters
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, encounter_id BIGINT
, clinic_session_id BIGINT
, clinic_id BIGINT
, "name" VARCHAR(255)
, patient_visit_id BIGINT
, visit_type_id BIGINT
, visit_type_name VARCHAR(255)
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, first_name VARCHAR(255)
, last_name VARCHAR(255)
, nationality_id BIGINT
, category VARCHAR(9)
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_prescription
(
  encounter_id BIGINT
, encounter_id_1 BIGINT
, patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, clinic_session_id BIGINT
, "name" VARCHAR(255)
, visit_type_name VARCHAR(255)
, drug_name VARCHAR(255)
, date_created TIMESTAMP
, created_by_id BIGINT
, dosage VARCHAR(255)
, duration VARCHAR(255)
, frequency VARCHAR(255)
, pharmacology_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting.triage
(
  id BIGINT
, clinic_session_id BIGINT
, triage_date_created TIMESTAMP
, first_name VARCHAR(255)
, last_name VARCHAR(255)
, role_name VARCHAR(255)
, department_name VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_vaccines
(
  id BIGINT
, patient_number VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, date_created TIMESTAMP
, patient_visit_id BIGINT
, clinic_name VARCHAR(255)
, vaccine_id BIGINT
, vaccine_name VARCHAR(255)
, is_children_vaccine BOOLEAN
)
;

CREATE TABLE IF NOT EXISTS reporting.commodities
(
  store_id BIGINT
, store_name VARCHAR(255)
, product_id BIGINT
, product_name VARCHAR(255)
, product_type VARCHAR(10)
, "increment" NUMERIC(27, 2)
, decrement NUMERIC(27, 2)
, "level" NUMERIC(27, 2)
, created_by_id BIGINT
, first_name VARCHAR(255)
, last_name VARCHAR(255)
, "role" VARCHAR(255)
, date_created TIMESTAMP
, last_updated TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS reporting.inventory_batch
(
  batch_number VARCHAR(255)
, product_id BIGINT
, product_name VARCHAR(255)
, store_id BIGINT
, store_name VARCHAR(255)
, unit_in_stock NUMERIC(27, 2)
, date_created TIMESTAMP
, last_updated TIMESTAMP
, expiry_date TIMESTAMP
, created_by_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_diagnosis
(
  patient_id VARCHAR(255)
, encounter_id BIGINT
, patient_visit_id BIGINT
, birth_date TIMESTAMP
, gender VARCHAR(6)
, clinic_session_id BIGINT
, clinic VARCHAR(255)
, visit_type_name VARCHAR(255)
, disease_id BIGINT
, disease_name VARCHAR(255)
, disease_block_id BIGINT
, five_character_icd_code VARCHAR(255)
, four_character_icd_code VARCHAR(255)
, classification VARCHAR(11)
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS reporting.maternity
(
  id BIGINT
, birth_date TIMESTAMP
, gender VARCHAR(6)
, patient_id VARCHAR(255)
, patient_admission_id BIGINT
, admission_ward_id BIGINT
, encounter_id BIGINT
, patient_visit_id BIGINT
, admission_date TIMESTAMP
, ward_name VARCHAR(255)
, induced_labour BOOLEAN
, delivery_mode VARCHAR(255)
, delivery_comments VARCHAR(255)
, induction_drugs VARCHAR(255)
, drugs_given VARCHAR(255)
, mother_status VARCHAR(255)
, baby_status VARCHAR(255)
, baby_weight DOUBLE PRECISION
, resuscitation BOOLEAN
, baby_gender VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_postnatal
(
  patient_id VARCHAR(255)
, birth_date TIMESTAMP
, gender VARCHAR(6)
, encounter_id BIGINT
, date_created TIMESTAMP
, admission_date TIMESTAMP
, admission_ward_id BIGINT
, ward_name VARCHAR(255)
, discharge_date TIMESTAMP
, discharge_encounter_id BIGINT
, patient_visit_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS reporting."108_inpatient"
(
  encounter_id BIGINT
, patient_id VARCHAR(255)
, diagnosis VARCHAR(255)
, gender VARCHAR(6)
, birth_date TIMESTAMP
, admission_date TIMESTAMP
, time_of_death TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS reporting.eafya_mappings
(
  id BIGSERIAL PRIMARY KEY
, hmis_dataelement_code VARCHAR(255) NOT NULL
, hmis_dataelement_name VARCHAR(500) NOT NULL
, dataelement_id VARCHAR(255)
, dataset_code VARCHAR(50) NOT NULL
, section_id VARCHAR(50)
, eafya_item_id BIGINT NOT NULL
, eafya_item_name VARCHAR(500) NOT NULL
, created_at TIMESTAMP DEFAULT NOW()
, updated_at TIMESTAMP DEFAULT NOW()
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_bed_admissions
(
  id BIGINT
, birth_date TIMESTAMP
, gender VARCHAR(6)
, patient_id VARCHAR(255)
, patient_admission_id BIGINT
, admission_ward_id BIGINT
, encounter_id BIGINT
, patient_visit_id BIGINT
, admission_date TIMESTAMP
, medical_discharge_date TIMESTAMP
, ward_name VARCHAR(255)
, room_name VARCHAR(255)
, bed_id BIGINT
, bed_type VARCHAR(6)
, bed_name VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS reporting.patient_days
(
  id BIGINT
, birth_date TIMESTAMP
, gender VARCHAR(6)
, patient_id VARCHAR(255)
, patient_admission_id BIGINT
, admission_ward_id BIGINT
, encounter_id BIGINT
, patient_visit_id BIGINT
, admission_date TIMESTAMP
, medical_discharge_date TIMESTAMP
, ward_name VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS reporting.census_death
(
  id BIGINT
, birth_date TIMESTAMP
, gender VARCHAR(6)
, patient_id VARCHAR(255)
, patient_admission_id BIGINT
, admission_ward_id BIGINT
, encounter_id BIGINT
, patient_visit_id BIGINT
, ward_name VARCHAR(255)
, admission_date TIMESTAMP
, medical_discharge_date TIMESTAMP
, place_of_death VARCHAR(255)
, time_of_death TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS reporting."108_maternal_neonatal"
(
  encounter_id BIGINT
, patient_id VARCHAR(255)
, diagnosis VARCHAR(255)
, gender VARCHAR(6)
, birth_date TIMESTAMP
, admission_date TIMESTAMP
, delivery_mode VARCHAR(255)
, mother_blood_pressure VARCHAR(255)
, mother_blood_loss_volume DOUBLE PRECISION
, death_date TIMESTAMP
, baby_weight DOUBLE PRECISION
, baby_status VARCHAR(255)
, baby_gender VARCHAR(255)
, newborn_date TIMESTAMP
)
;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_eafya_mappings_dataelement ON reporting.eafya_mappings(hmis_dataelement_code);
CREATE INDEX IF NOT EXISTS idx_eafya_mappings_dataset ON reporting.eafya_mappings(dataset_code);
CREATE INDEX IF NOT EXISTS idx_eafya_mappings_item ON reporting.eafya_mappings(eafya_item_id);
