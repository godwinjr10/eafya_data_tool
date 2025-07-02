-- Create outpatient table
CREATE TABLE IF NOT EXISTS outpatient (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facility(id),
    visit_date DATE NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    diagnosis TEXT,
    treatment TEXT,
    referral_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on visit_date for better query performance
CREATE INDEX IF NOT EXISTS idx_outpatient_visit_date ON outpatient(visit_date);

-- Create index on facility_id for better join performance
CREATE INDEX IF NOT EXISTS idx_outpatient_facility_id ON outpatient(facility_id); 