

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_lab_test_category
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, system_defined BOOLEAN
, order_sequence INTEGER
)
;
CREATE TABLE IF NOT EXISTS dwh.dim_eafya_pharmacology
(
  id BIGINT
, date_created TIMESTAMP
, dosage VARCHAR(255)
, drug_name VARCHAR(255)
, duration VARCHAR(255)
, frequency VARCHAR(255)
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, prescription_category_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_store
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, parent_id BIGINT
, stock_control_account_id BIGINT
, adjustment_control_ledger_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_inventory_unit
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, quantity NUMERIC(25, 2)
, unit_id BIGINT
);

CREATE TABLE IF NOT EXISTS  dwh.dim_eafya_product
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, dispensing_unit_id BIGINT
, is_available BOOLEAN
, is_cost_fixed BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, product_id BIGINT
, product_category_id BIGINT
, product_type VARCHAR(10)
, purchase_cr_ledger_account_id BIGINT
, purchase_dr_ledger_account_id BIGINT
, qty_per_unit INTEGER
, receiving_unit_id BIGINT
, saleipcr_ledger_account_id BIGINT
, saleipdr_ledger_account_id BIGINT
, saleopcr_ledger_account_id BIGINT
, saleopdr_ledger_account_id BIGINT
, unit_selling_price NUMERIC(25, 2)
, vat_class_id BIGINT
, product_bill_category_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_lab_test_sample_type
(
  lab_test_sample_type_id BIGINT
, sample_type VARCHAR(255)
, sample_type_description TEXT
, date_created TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_visit
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, is_closed BOOLEAN
, last_updated TIMESTAMP
, patient_id VARCHAR(255)
, process VARCHAR(9)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_clinic_session
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, clinic_id BIGINT
, closed_at TIMESTAMP
, closed_by_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, health_education TEXT
, in_behalf_of_id BIGINT
, is_closed BOOLEAN
, last_updated TIMESTAMP
, patient_visit_id BIGINT
, visit_type_id BIGINT
)
;

CREATE TABLE IF NOT exists dwh.fact_eafya_family_planning
(
  sur_family_planning_id BIGINT
, sur_administered_id BIGINT
, patient_family_planning_id BIGINT
, encounter_id BIGINT
, created_by_id BIGINT
, administered_date TIMESTAMP
, family_planning_id BIGINT
, last_updated TIMESTAMP
, treatment_stage VARCHAR(7)
)
;

CREATE TABLE IF NOT exists dwh.fact_eafya_vaccine
(
  id BIGINT
, administered_by_id BIGINT
, administered_in_premise BOOLEAN
, administered_on TIMESTAMP
, clinic_session_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, vaccine_id BIGINT
)
;

CREATE TABLE IF NOT exists dwh.dim_eafya_clinic
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, default_visit_type_id BIGINT
, description TEXT
, is_active BOOLEAN
, is_default BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, vaccination_clinic BOOLEAN
, max_appointment INTEGER
, order_sequence INTEGER
)
;

CREATE TABLE IF NOT exists dwh.dim_eafya_disease
(
  id BIGINT
, "name" VARCHAR(255)
, simplified_name TEXT
, disease_block_id BIGINT
, five_character_icd_code VARCHAR(255)
, four_character_icd_code VARCHAR(255)
, is_active BOOLEAN
, is_node BOOLEAN
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_vaccine
(
  id BIGINT
, administered_by_id BIGINT
, administered_in_premise BOOLEAN
, administered_on TIMESTAMP
, clinic_session_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, vaccine_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_inventory_unit
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, quantity NUMERIC(25, 2)
, unit_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_product
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, dispensing_unit_id BIGINT
, is_available BOOLEAN
, is_cost_fixed BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, product_id BIGINT
, product_category_id BIGINT
, product_type VARCHAR(10)
, purchase_cr_ledger_account_id BIGINT
, purchase_dr_ledger_account_id BIGINT
, qty_per_unit INTEGER
, receiving_unit_id BIGINT
, saleipcr_ledger_account_id BIGINT
, saleipdr_ledger_account_id BIGINT
, saleopcr_ledger_account_id BIGINT
, saleopdr_ledger_account_id BIGINT
, unit_selling_price NUMERIC(25, 2)
, vat_class_id BIGINT
, product_bill_category_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS  dwh.dim_eafya_bed
(
  id BIGINT
, version BIGINT
, bed_type VARCHAR(6)
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_available BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, max_occupants INTEGER
, "name" VARCHAR(255)
, room_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS  dwh.dim_eafya_room
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, in_charge_id BIGINT
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, ward_id BIGINT
)
;


CREATE TABLE IF NOT EXISTS  dwh.fact_eafya_clinic_session
(
  id BIGINT
, clinic_id BIGINT
, closed_at TIMESTAMP
, closed_by_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, is_closed BOOLEAN
, last_updated TIMESTAMP
, patient_visit_id BIGINT
, visit_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS  dwh.fact_eafya_encounters
(
  id BIGINT
, clinic_session_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_notes TEXT
, illness_history TEXT
, last_updated TIMESTAMP
, origin VARCHAR(2)
)
;

CREATE TABLE IF NOT EXISTS  dwh.fact_eafya_admissions
(
  id BIGINT
, admission_date TIMESTAMP
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
, encounter_id BIGINT
, escorting_nurse_id BIGINT
, is_closed BOOLEAN
, last_updated TIMESTAMP
, medical_discharge_date TIMESTAMP
, patient_visit_id BIGINT
, receiving_nurse_id BIGINT
, released_by_id BIGINT
, is_admission_approved BOOLEAN
)
;

CREATE TABLE IF NOT EXISTS  dwh.fact_eafya_newborn
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

CREATE TABLE IF NOT EXISTS  dwh.fact_eafya_labour_monitor
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
)
;

CREATE TABLE IF NOT EXISTS  dwh.fact_eafya_patient_visit
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, is_closed BOOLEAN
, last_updated TIMESTAMP
, patient_id VARCHAR(255)
, process VARCHAR(9)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_prescription
(
  id BIGINT
, version BIGINT
, annulled_at TIMESTAMP
, annulled_by_id BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, dosage VARCHAR(255)
, duration VARCHAR(255)
, encounter_id BIGINT
, frequency VARCHAR(255)
, last_updated TIMESTAMP
, pharmacology_id BIGINT
, route VARCHAR(17)
, description TEXT
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_store_inventory
(
  id BIGINT
, date_created TIMESTAMP
, is_active BOOLEAN
, last_updated TIMESTAMP
, product_id BIGINT
, replenishment_level NUMERIC(25, 2)
, store_id BIGINT
, unit_in_stock NUMERIC(25, 2)
);

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_inventory_audit
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, decrement NUMERIC(25, 2)
, description TEXT
, "increment" NUMERIC(25, 2)
, last_updated TIMESTAMP
, "level" NUMERIC(25, 2)
, reference VARCHAR(255)
, short_description VARCHAR(255)
, store_inventory_id BIGINT
);

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_inventory_batch_level
(
  id BIGINT
, batch_number VARCHAR(255)
, created_by_id BIGINT
, date_created TIMESTAMP
, expiry_date TIMESTAMP
, last_updated TIMESTAMP
, product_id BIGINT
, store_id BIGINT
, store_receipt_item_id BIGINT
, unit_in_stock NUMERIC(25, 2)
, unit_selling_price NUMERIC(25, 2)
, voucher_line_id BIGINT
);

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_visit_type
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_imaging
(
  id BIGINT
, attended_by_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, imaging_id BIGINT
, last_updated TIMESTAMP
, performed_at TIMESTAMP
, "result" TEXT
, status VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_imaging
(
  id BIGINT
, allow_multiple_orders BOOLEAN
, created_by_id BIGINT
, date_created TIMESTAMP
, imaging_category_id BIGINT
, imaging_result_template_id BIGINT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_imaging_category
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_patients
(
  id VARCHAR(255)
, version BIGINT
, address VARCHAR(255)
, branch_id BIGINT
, city VARCHAR(255)
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, debtor_account_id VARCHAR(255)
, email VARCHAR(255)
, employee_account_id BIGINT
, last_updated TIMESTAMP
, partner_type VARCHAR(18)
, phone_number VARCHAR(255)
, postal_code VARCHAR(255)
);

CREATE TABLE  IF NOT EXISTS dwh.dim_eafya_blood_transfusion
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_active BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
);

CREATE TABLE  IF NOT EXISTS dwh.fact_eafya_patient_disease
(
  id BIGINT
, classification VARCHAR(11)
, created_by_id BIGINT
, date_created TIMESTAMP
, disease_id BIGINT
, encounter_id BIGINT
, is_surveilled BOOLEAN
, last_updated TIMESTAMP
)
;
CREATE TABLE  IF NOT EXISTS dwh.fact_eafya_vaccine
(
  id BIGINT
, administered_by_id BIGINT
, administered_in_premise BOOLEAN
, administered_on TIMESTAMP
, clinic_session_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, vaccine_id BIGINT
);

CREATE TABLE  IF NOT EXISTS dwh.fact_eafya_patient_lab_test
(
  id BIGINT
, created_by_id BIGINT
, encounter_id BIGINT
, is_default BOOLEAN
, lab_test_id BIGINT
, linked_test_id BIGINT
, parent_id BIGINT
, "result" VARCHAR(255)
, sample_collected_by_id BIGINT
, sample_collection_time TIMESTAMP
, sample_rejected_by_id BIGINT
, sample_rejection_note VARCHAR(255)
, sample_rejection_time TIMESTAMP
, status VARCHAR(255)
, technician_comment TEXT
, verified_at TIMESTAMP
, verified_by_id BIGINT
, visit_type VARCHAR(28)
, date_created TIMESTAMP
, last_updated TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_registered_patients
(
  id BIGINT
, birth_date TIMESTAMP
, date_created TIMESTAMP
, first_name VARCHAR(255)
, gender VARCHAR(6)
, id_no VARCHAR(255)
, last_name VARCHAR(255)
, last_updated TIMESTAMP
, marital_status VARCHAR(9)
, nationality_id BIGINT
, other_name VARCHAR(255)
, patient_id VARCHAR(255)
, village VARCHAR(255)
, category VARCHAR(9)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_moh_report
(
  id BIGINT
, version BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, order_seq BIGINT
, parent_id BIGINT
, moh_report_section_id BIGINT
, branch_id BIGINT
, company_id BIGINT
, moh_report_config_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_moh_report_section
(
  id BIGINT
, version BIGINT
, moh_report_config_id BIGINT
, "name" VARCHAR(255)
, section_type VARCHAR(255)
, branch_id BIGINT
, company_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_moh_report_item
(
  id BIGINT
, version BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, disease_id BIGINT
, last_updated TIMESTAMP
, major_theater_id BIGINT
, minor_theater_id BIGINT
, moh_report_group_id BIGINT
, product_id BIGINT
, branch_id BIGINT
, company_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_system_user
(
 id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, department_id BIGINT
, description TEXT
, email VARCHAR(255)
, employee_id BIGINT
, first_name VARCHAR(255)
, infinity_employee_number VARCHAR(255)
, is_active BOOLEAN
, last_name VARCHAR(255)
, last_updated TIMESTAMP
, other_name VARCHAR(255)
, "password" VARCHAR(255)
, phone_number VARCHAR(255)
, role_id BIGINT
, title VARCHAR(255)
, user_signature_id BIGINT
, is_locked BOOLEAN
, last_login_attempt TIMESTAMP
, login_attempts INTEGER
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_role
(
  id BIGINT
, created_by_id INTEGER
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS  dwh.dim_eafya_department
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, department_unit_id BIGINT
, description TEXT
, expense_ledger_account_id BIGINT
, include_income_and_expenditure BOOLEAN
, is_active BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_drug
(
  id BIGINT
, date_created TIMESTAMP
, dosage VARCHAR(255)
, duration VARCHAR(255)
, encounter_id BIGINT
, frequency VARCHAR(255)
, last_updated TIMESTAMP
, pharmacology_id BIGINT
, route VARCHAR(17)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_store_inventory
(
  id BIGINT
, date_created TIMESTAMP
, is_active BOOLEAN
, last_updated TIMESTAMP
, product_id BIGINT
, replenishment_level NUMERIC(25, 2)
, store_id BIGINT
, unit_in_stock NUMERIC(25, 2)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_inventory_audit
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, decrement NUMERIC(25, 2)
, description TEXT
, "increment" NUMERIC(25, 2)
, last_updated TIMESTAMP
, "level" NUMERIC(25, 2)
, reference VARCHAR(255)
, short_description VARCHAR(255)
, store_inventory_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_inventory_batch_level
(
  id BIGINT
, batch_number VARCHAR(255)
, created_by_id BIGINT
, date_created TIMESTAMP
, expiry_date TIMESTAMP
, last_updated TIMESTAMP
, product_id BIGINT
, store_id BIGINT
, store_receipt_item_id BIGINT
, unit_in_stock NUMERIC(25, 2)
, unit_selling_price NUMERIC(25, 2)
, voucher_line_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_newborn
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

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_lab_test
(
  id BIGINT
, created_by_id BIGINT
, encounter_id BIGINT
, is_default BOOLEAN
, lab_test_id BIGINT
, linked_test_id BIGINT
, parent_id BIGINT
, "result" VARCHAR(255)
, sample_collected_by_id BIGINT
, sample_collection_time TIMESTAMP
, sample_rejected_by_id BIGINT
, sample_rejection_note VARCHAR(255)
, sample_rejection_time TIMESTAMP
, status VARCHAR(255)
, technician_comment TEXT
, verified_at TIMESTAMP
, verified_by_id BIGINT
, visit_type VARCHAR(28)
, date_created TIMESTAMP
, last_updated TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_drug
(
  id BIGINT
, date_created TIMESTAMP
, dosage VARCHAR(255)
, duration VARCHAR(255)
, encounter_id BIGINT
, frequency VARCHAR(255)
, last_updated TIMESTAMP
, pharmacology_id BIGINT
, route VARCHAR(17)
)
;


CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_minor_theatre
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, last_updated TIMESTAMP
, minor_theater_id BIGINT
, treatment_duration VARCHAR(26)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_major_theatre
(
  id BIGINT
, administered_by_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, last_updated TIMESTAMP
, major_theater_id BIGINT
, major_theater_room_id BIGINT
, scheduled_date TIMESTAMP
, scheduled_time VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_patient_family_planning
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, family_planning_id BIGINT
, is_new_to_method BOOLEAN
, last_updated TIMESTAMP
, treatment_stage VARCHAR(7)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_administered_family_planning
(
  id BIGINT
, administered_at VARCHAR(255)
, administered_by_id BIGINT
, administered_on TIMESTAMP
, created_by_id BIGINT
, date_created TIMESTAMP
, family_planning_id BIGINT
, last_updated TIMESTAMP
, patient_family_planning_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_major_theatre
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, major_theater_category_id BIGINT
, major_theater_name VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_minor_theatre
(
  id BIGINT
, clinic_id BIGINT
, date_created TIMESTAMP
, minor_theater_category_id BIGINT
, minor_theater_name VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_major_theatre_category
(
  id BIGINT
, created_by_id BIGINT
, major_theater_category VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_minor_theatre_category
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, minor_theater_categroy VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_vaccine
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, is_children_vaccine BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_lab_tests_parent
(
  id BIGINT
, "name" VARCHAR(255)
, lab_test_category_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_ward
(
  id BIGINT
, description TEXT
, in_charge_id BIGINT
, is_active BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, ward_category_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_triage
(
  id BIGINT
, branch_id BIGINT
, clinic_session_id BIGINT
, "comment" TEXT
, created_by_id BIGINT
, date_created TIMESTAMP
, priority_level VARCHAR(24)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_vitals_monitor
(
  id BIGINT
, admission_id BIGINT
, comments TEXT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, patient_id VARCHAR(255)
, patient_labour_monitor_id BIGINT
, post_op_checklist_id BIGINT
, taken_at TIMESTAMP
, triage_id BIGINT
, "value" VARCHAR(255)
, vital_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_vital_type
(
  id BIGINT
, caption VARCHAR(255)
, created_by_id BIGINT
, date_created TIMESTAMP
, vitals_value_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_triage_type
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_major_theatre_room
(
  id BIGINT
, date_created TIMESTAMP
, major_theater_room VARCHAR(255)
)
;



CREATE TABLE IF NOT EXISTS dwh.etl_run_log (
  id SERIAL PRIMARY KEY,
  last_run_date TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_lab_test
(
  id BIGINT
, allow_multiple_orders BOOLEAN
, created_by_id BIGINT
, date_created TIMESTAMP
, is_active BOOLEAN
, is_default BOOLEAN
, is_ordered_independently BOOLEAN
, is_system_defined BOOLEAN
, lab_test_category_id BIGINT
, lab_test_result_template_id BIGINT
, last_updated TIMESTAMP
, maximum_range VARCHAR(255)
, minimum_range VARCHAR(255)
, "name" VARCHAR(255)
, order_sequence INTEGER
, parent_id BIGINT
, sample_type VARCHAR(255)
, test_result_type_id BIGINT
, absolute_maximum NUMERIC(25, 2)
, absolute_minimum NUMERIC(25, 2)
, auto_calculation_formulae VARCHAR(255)
, auto_calculation_formulae_suppress VARCHAR(255)
, chart_result BOOLEAN
, fractional_limit VARCHAR(255)
, interfacing_db_conn VARCHAR(255)
, interfacing_result_manipulator VARCHAR(255)
, interfacing_test_code VARCHAR(255)
, is_urgent BOOLEAN
, lab_test_header_footer_template_id BIGINT
, lab_test_worksheet_id BIGINT
, processing_hour_type VARCHAR(255)
, processing_time NUMERIC(25, 2)
)
;

CREATE TABLE IF NOT EXISTS dwh.fact_eafya_deceased_patient
(
  id BIGINT
, admission_id BIGINT
, date_created TIMESTAMP
, patient_id VARCHAR(255)
, patient_visit_id BIGINT
, place_of_death VARCHAR(255)
, time_of_death TIMESTAMP
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_family_planning
(
  last_created TIMESTAMP
, id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, family_planning_category_id BIGINT
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS dwh.dim_eafya_family_planning_category
(
  id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;
