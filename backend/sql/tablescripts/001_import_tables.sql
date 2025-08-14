CREATE TABLE  IF NOT EXISTS  import.eafya_patients
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
)
;

CREATE TABLE IF NOT EXISTS  import.eafya_clinic
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
);

CREATE TABLE IF NOT EXISTS  import.eafya_patient_disease
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, classification VARCHAR(11)
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, disease_id BIGINT
, encounter_id BIGINT
, is_surveilled BOOLEAN
, last_updated TIMESTAMP
, annulled_at TIMESTAMP
, annulled_by_id BIGINT
);

CREATE TABLE import.eafya_lab_test
(
  id BIGINT
, version BIGINT
, allow_multiple_orders BOOLEAN
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
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
, absolute_maximum NUMERIC(21, 2)
, absolute_minimum NUMERIC(21, 2)
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
, processing_time NUMERIC(21, 2)
)
;

CREATE TABLE IF NOT EXISTS  import.eafya_lab_test_category
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, system_defined BOOLEAN
, order_sequence INTEGER
);

CREATE TABLE IF NOT EXISTS  import.eafya_inventory_audit
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, decrement NUMERIC(21, 2)
, description TEXT
, "increment" NUMERIC(21, 2)
, last_updated TIMESTAMP
, "level" NUMERIC(21, 2)
, reference VARCHAR(255)
, short_description VARCHAR(255)
, store_inventory_id BIGINT
);

CREATE TABLE IF NOT EXISTS  import.eafya_store_inventory
(
  id BIGINT
, version BIGINT
, date_created TIMESTAMP
, is_active BOOLEAN
, last_updated TIMESTAMP
, product_id BIGINT
, replenishment_level NUMERIC(21, 2)
, store_id BIGINT
, unit_in_stock NUMERIC(21, 2)
);

CREATE TABLE IF NOT EXISTS  import.eafya_store
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, cogs_account_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, parent_id BIGINT
, stock_control_account_id BIGINT
, adjustment_control_ledger_id BIGINT
);

CREATE TABLE IF NOT EXISTS  import.eafya_product
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
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
, sku VARCHAR(255)
, unit_selling_price NUMERIC(21, 2)
, vat_class_id BIGINT
, product_bill_category_id BIGINT
);

CREATE TABLE IF NOT EXISTS  import.eafya_inventory_unit
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
, quantity NUMERIC(21, 2)
, unit_id BIGINT
);

CREATE TABLE IF NOT EXISTS  import.eafya_product_pharmacology
(
  pharmacology_id BIGINT
, product_id BIGINT
);

CREATE TABLE IF NOT EXISTS  import.eafya_pharmacology
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, dosage VARCHAR(255)
, drug_name VARCHAR(255)
, duration VARCHAR(255)
, frequency VARCHAR(255)
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, prescription_category_id BIGINT
, route VARCHAR(17)
, system_defined BOOLEAN
, is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS  import.eafya_inventory_batch_level
(
  id BIGINT
, version BIGINT
, batch_number VARCHAR(255)
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, expiry_date TIMESTAMP
, last_updated TIMESTAMP
, product_id BIGINT
, store_id BIGINT
, store_receipt_item_id BIGINT
, unit_in_stock NUMERIC(21, 2)
, unit_selling_price NUMERIC(21, 2)
, voucher_line_id BIGINT
);



CREATE TABLE IF NOT EXISTS  import.eafya_lab_test
(
  id BIGINT
, version BIGINT
, allow_multiple_orders BOOLEAN
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
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
, absolute_maximum NUMERIC(21, 2)
, absolute_minimum NUMERIC(21, 2)
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
, processing_time NUMERIC(21, 2)
, code VARCHAR(255)
, code_name VARCHAR(255)
, code_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS  import.eafya_lab_test_category
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, system_defined BOOLEAN
, order_sequence INTEGER
);

CREATE TABLE IF NOT EXISTS import.eafya_lab_test_sample_type
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, code VARCHAR(255)
, code_name VARCHAR(255)
, code_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS  import.eafya_patients
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

CREATE TABLE IF NOT EXISTS  import.eafya_patients_bio
(
  id BIGINT
, version BIGINT
, birth_date TIMESTAMP
, date_created TIMESTAMP
, first_name VARCHAR(255)
, gender VARCHAR(6)
, geo_area_level5_id BIGINT
, id_no VARCHAR(255)
, last_name VARCHAR(255)
, last_updated TIMESTAMP
, marital_status VARCHAR(9)
, nationality_id BIGINT
, other_name VARCHAR(255)
, patient_id VARCHAR(255)
, patient_image_id BIGINT
, sub_location VARCHAR(255)
, village VARCHAR(255)
, ethnicity VARCHAR(5)
, category VARCHAR(9)
);



-----COMMODITY FACT & DIM IMPORT TABLES-------------------------------

CREATE TABLE IF NOT EXISTS  import.eafya_pharmacology
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, dosage VARCHAR(255)
, drug_name VARCHAR(255)
, duration VARCHAR(255)
, frequency VARCHAR(255)
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, prescription_category_id BIGINT
, route VARCHAR(17)
, system_defined BOOLEAN
, is_active BOOLEAN
);
CREATE TABLE IF NOT EXISTS  import.eafya_product
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
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
, sku VARCHAR(255)
, unit_selling_price NUMERIC(21, 2)
, vat_class_id BIGINT
, product_bill_category_id BIGINT
);
CREATE TABLE IF NOT EXISTS  import.eafya_product_pharmacology
(
  pharmacology_id BIGINT
, product_id BIGINT
);

CREATE TABLE IF NOT EXISTS  import.eafya_inventory_unit
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
, quantity NUMERIC(21, 2)
, unit_id BIGINT
);
CREATE TABLE IF NOT EXISTS  import.eafya_inventory_audit
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, decrement NUMERIC(21, 2)
, description TEXT
, "increment" NUMERIC(21, 2)
, last_updated TIMESTAMP
, "level" NUMERIC(21, 2)
, reference VARCHAR(255)
, short_description VARCHAR(255)
, store_inventory_id BIGINT
);

 CREATE TABLE IF NOT EXISTS  import.eafya_store
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, cogs_account_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, parent_id BIGINT
, stock_control_account_id BIGINT
, adjustment_control_ledger_id BIGINT
);
CREATE TABLE IF NOT EXISTS  import.eafya_store_inventory
(
  id BIGINT
, version BIGINT
, date_created TIMESTAMP
, is_active BOOLEAN
, last_updated TIMESTAMP
, product_id BIGINT
, replenishment_level NUMERIC(21, 2)
, store_id BIGINT
, unit_in_stock NUMERIC(21, 2)
);

CREATE TABLE IF NOT EXISTS import.eafya_patient_family_planning
(
  id BIGINT
, version BIGINT
, annulled_at TIMESTAMP
, annulled_by_id BIGINT
, branch_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, family_planning_id BIGINT
, is_new_to_method BOOLEAN
, last_updated TIMESTAMP
, treatment_stage VARCHAR(7)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_administered_family_planning
(
  id BIGINT
, version BIGINT
, administered_at VARCHAR(255)
, administered_by_id BIGINT
, administered_on TIMESTAMP
, branch_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, family_planning_id BIGINT
, last_updated TIMESTAMP
, patient_family_planning_id BIGINT
)
;


CREATE TABLE IF NOT EXISTS import.eafya_administered_vaccine
(
  id BIGINT
, version BIGINT
, administered_by_id BIGINT
, administered_in_premise BOOLEAN
, administered_on TIMESTAMP
, branch_id BIGINT
, clinic_session_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, vaccine_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_vaccine
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_children_vaccine BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_patient_major_theatre
(
  id BIGINT
, version BIGINT
, administered_by_id BIGINT
, approx_duration INTEGER
, attendant_comment TEXT
, branch_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, last_updated TIMESTAMP
, major_theater_id BIGINT
, major_theater_room_id BIGINT
, performed_at TIMESTAMP
, scheduled_date TIMESTAMP
, scheduled_time VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS import.eafya_patient_minor_theatre
(
  id BIGINT
, version BIGINT
, annulled_at TIMESTAMP
, annulled_by_id BIGINT
, branch_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, last_updated TIMESTAMP
, minor_theater_id BIGINT
, treatment_duration VARCHAR(26)
);

CREATE TABLE IF NOT EXISTS import.eafya_patient_imaging
(
  id BIGINT
, version BIGINT
, annulled_at TIMESTAMP
, annulled_by_id BIGINT
, attended_by_id BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, imaging_id BIGINT
, last_updated TIMESTAMP
, performed_at TIMESTAMP
, procedure_notes TEXT
, remarks TEXT
, "result" TEXT
, status VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS import.eafya_imaging
(
  id BIGINT
, version BIGINT
, allow_multiple_orders BOOLEAN
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, imaging_category_id BIGINT
, imaging_result_template_id BIGINT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, system_defined BOOLEAN
);
  

  
CREATE TABLE IF NOT EXISTS import.eafya_blood_transfussion
(
  last_update TIMESTAMP
, id BIGINT
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


CREATE TABLE IF NOT EXISTS  import.eafya_imaging_category
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, system_defined BOOLEAN
);

CREATE TABLE IF NOT EXISTS  import.eafya_patient_prescription
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

CREATE TABLE IF NOT EXISTS  import.eafya_patient_admissions
(
  id BIGINT
, version BIGINT
, admission_date TIMESTAMP
, admission_ward_id BIGINT
, admitting_doctor_id BIGINT
, assigned_doctor_id BIGINT
, branch_id BIGINT
, brought_in_by_id BIGINT
, comments TEXT
, company_id BIGINT
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

CREATE TABLE IF NOT EXISTS import.eafya_bed
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

CREATE TABLE IF NOT EXISTS import.eafya_room
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

CREATE TABLE IF NOT EXISTS import.eafya_newborn
(
  id BIGINT
, version BIGINT
, baby_head_circumference DOUBLE PRECISION
, baby_height DOUBLE PRECISION
, baby_status VARCHAR(255)
, baby_weight DOUBLE PRECISION
, branch_id BIGINT
, company_id BIGINT
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

CREATE TABLE IF NOT EXISTS import.eafya_labour_monitor
(
  id BIGINT
, version BIGINT
, bba BOOLEAN
, blood_loss_volume DOUBLE PRECISION
, blood_pressure VARCHAR(255)
, branch_id BIGINT
, company_id BIGINT
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

CREATE TABLE IF NOT EXISTS import.eafya_ward
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, in_charge_id BIGINT
, income_ledger_account_id BIGINT
, is_active BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, ward_category_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_patient_visit
(
  id BIGINT
, version BIGINT
, b_referring_facility_id BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, is_closed BOOLEAN
, last_updated TIMESTAMP
, medical_cover_line_id BIGINT
, patient_id VARCHAR(255)
, process VARCHAR(9)
, referring_facility VARCHAR(255)
, referring_physician VARCHAR(255)
, referring_physician_contact VARCHAR(255)
, service_package_id BIGINT
, waiver_case_id BIGINT
, b_referring_physician_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_clinic_session
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

CREATE TABLE IF NOT EXISTS import.eafya_encounters
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, clinic_session_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_notes TEXT
, illness_history TEXT
, last_updated TIMESTAMP
, origin VARCHAR(2)
, physical_exam TEXT
, treatment_instruction TEXT
, family_social_history TEXT
, past_surgical_history TEXT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_visit_type
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
)
;

CREATE TABLE IF NOT EXISTS import.eafya_family_planning
(
  last_created TIMESTAMP
, id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, family_planning_category_id BIGINT
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS import.eafya_patient_lab_test
(
  id BIGINT
, version BIGINT
, annulled_at TIMESTAMP
, annulled_by_id BIGINT
, attended_by_id BIGINT
, branch_id BIGINT
, clinical_note TEXT
, company_id BIGINT
, conclusion TEXT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, is_default BOOLEAN
, is_first_time_test BOOLEAN
, is_urgent BOOLEAN
, lab_test_id BIGINT
, last_updated TIMESTAMP
, linked_test_id BIGINT
, parent_id BIGINT
, performed_at TIMESTAMP
, posted_to_external_system BOOLEAN
, posting_attempts INTEGER
, posting_failure_message VARCHAR(255)
, procedure_notes TEXT
, requires_urgent_action BOOLEAN
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
, additional_processing_time NUMERIC(21, 2)
, annullment_location VARCHAR(255)
, annullment_reason TEXT
, ap_number VARCHAR(255)
, emailed_at TIMESTAMP
, is_leaf BOOLEAN
, outsourcing_facility_id BIGINT
, printed_at TIMESTAMP
, request_location VARCHAR(255)
, result_alteration_reason TEXT
, sample_collection_location VARCHAR(255)
, sample_rejection_location VARCHAR(255)
, test_unit VARCHAR(255)
, testing_location VARCHAR(255)
, maximum_range VARCHAR(255)
, minimum_range VARCHAR(255)
, report VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_disease
(
  id BIGINT
, version BIGINT
, disease_block_id BIGINT
, five_character_icd_code VARCHAR(255)
, four_character_icd_code VARCHAR(255)
, is_active BOOLEAN
, is_node BOOLEAN
, mortality_ref_list1 VARCHAR(255)
, mortality_ref_list2 VARCHAR(255)
, mortality_ref_list3 VARCHAR(255)
, mortality_ref_list4 VARCHAR(255)
, "name" VARCHAR(255)
, simplified_name TEXT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_triage
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, clinic_session_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, priority_level VARCHAR(24)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_system_user
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
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

CREATE TABLE IF NOT EXISTS import.eafya_role
(
   id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id INTEGER
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, system_defined BOOLEAN
)
;

CREATE TABLE IF NOT EXISTS import.eafya_department
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, department_unit_id BIGINT
, description TEXT
, expense_ledger_account_id BIGINT
, include_income_and_expenditure BOOLEAN
, is_active BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, org_code VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_major_theatre_category
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_minor_theatre_category
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_ward
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, in_charge_id BIGINT
, income_ledger_account_id BIGINT
, is_active BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, "name" VARCHAR(255)
, ward_category_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_family_planning_category
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
)
;

CREATE TABLE IF NOT EXISTS import.eafya_triage
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, clinic_session_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, last_updated TIMESTAMP
, priority_level VARCHAR(24)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_triage_type
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_vital_monitor
(
  id BIGINT
, version BIGINT
, admission_id BIGINT
, branch_id BIGINT
, comments TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, last_updated TIMESTAMP
, patient_id VARCHAR(255)
, patient_labour_monitor_id BIGINT
, post_op_checklist_id BIGINT
, taken_at TIMESTAMP
, triage_id BIGINT
, "value" VARCHAR(255)
, vital_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_vital_type
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, caption VARCHAR(255)
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, is_default BOOLEAN
, is_mandatory BOOLEAN
, is_system_defined BOOLEAN
, last_updated TIMESTAMP
, place_holder_hint VARCHAR(255)
, validation_error_message VARCHAR(255)
, validator_pattern VARCHAR(255)
, vitals_value_type_id BIGINT
)
;

CREATE TABLE IF NOT EXISTS import.eafya_major_theatre_room
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, "name" VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_patient_major_theatre
(
  id BIGINT
, version BIGINT
, administered_by_id BIGINT
, approx_duration INTEGER
, attendant_comment TEXT
, branch_id BIGINT
, "comment" TEXT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, encounter_id BIGINT
, last_updated TIMESTAMP
, major_theater_id BIGINT
, major_theater_room_id BIGINT
, performed_at TIMESTAMP
, scheduled_date TIMESTAMP
, scheduled_time VARCHAR(255)
)
;

CREATE TABLE IF NOT EXISTS import.eafya_minor_theatre
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, clinic_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, minor_theater_category_id BIGINT
, "name" VARCHAR(255)
, is_active BOOLEAN
)
;

CREATE TABLE IF NOT EXISTS import.eafya_major_theatre
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, major_theater_category_id BIGINT
, "name" VARCHAR(255)
, is_active BOOLEAN
)
;
CREATE TABLE IF NOT EXISTS import.eafya_minor_theatre
(
  id BIGINT
, version BIGINT
, branch_id BIGINT
, clinic_id BIGINT
, company_id BIGINT
, created_by_id BIGINT
, date_created TIMESTAMP
, description TEXT
, last_updated TIMESTAMP
, minor_theater_category_id BIGINT
, "name" VARCHAR(255)
)
;