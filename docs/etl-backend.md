markdown
# Backend Node.js API Service Deployment Guide

![ETL Pipeline](https://img.shields.io/badge/process-ETL-blue)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)
![Pentaho](https://img.shields.io/badge/tool-Pentaho%20DI-orange)

This documentation contains the Nodejs Backend Development steps for the ETL (Extract, Transform, Load) pipeline Logic.

## 🚀 Deployment Guide Backend API Service

### Step 1. Server Access & Setup
Login into the eafya Sever at the facility using putty. Provide the username and password

### Step 2. Go to the Backend folder as below

```
cd /home/artson_admin/eafya_data_tool/backend
```

### Step 3. Configure the Database Connection details in .env file are for the Facility Database
1. Navigate to the backend application folder to verify the details of .env file

2. These should be the details for the reportingdb:

```
DB_USER=XXX
DB_HOST=XXX
DB_NAME=XXX
DB_PASSWORD=XXX
DB_PORT=XXX
PORT=5000
NODE_ENV=development
JWT_SECRET=12345WQWTYUGBVNcders
```
### Step 4. Install the data tool backend source code Dependencies

Navigate to the backend folder and install the backend dependencies
```
cd /home/artson_admin/eafya_data_tool/backend
sudo yarn install
```

### Step 5. Create a Systemd Service for data tool backend API

```
sudo nano /etc/systemd/system/eafya-dwh.service
```

Copy the following content in the opened nano file:
```
[Unit]
Description=eAFYA DWH Data Tool Service
After=network.target

[Service]
WorkingDirectory=/home/artson_admin/eafya_data_tool/backend
ExecStart=yarn server
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

Enable and start the service
```
sudo systemctl enable eafya-dwh.service
sudo systemctl daemon-reload
sudo systemctl start eafya-dwh.service
```

Check Service Status
```
sudo systemctl status eafya-dwh.service
```

### 6. 🏃 Test the APIs with Postman to confirm that the backend API is running
Replace facilityIP with the actual hospital facility IP

Get all datasets:
```
http://<facilityIP>/api/mappings/sections
```

Get all sections:
```
http://<facilityIP>/api/mappings/sections
```

### 7. Copy the following datasets json file into postman to add the datasets into the database

API endpoint to be used
```
http://<facilityIP>/api/datasets/bulk
```

json data to be copied into postman for creating the datasets
```
[
  {
    "dataset_id": "HMIS_105_01",
    "dataset_name": "HMIS 105:01 - OPD Monthly Report (Attendances, Referrals, Conditions)",
    "sections": [
      {"section_id": "1.1", "section_name": "Attendance and Referral"},
      {"section_id": "1.3.1", "section_name": "Epidemic Prone Diseases"},
      {"section_id": "1.3.2", "section_name": "Other Infectious / Communicable Diseases"},
      {"section_id": "1.3.3", "section_name": "Neonatal Diseases"},
      {"section_id": "1.3.4", "section_name": "Non-Communicable Diseases"},
      {"section_id": "1.3.5", "section_name": "Oral Diseases"},
      {"section_id": "1.3.6", "section_name": "ENT Conditions"},
      {"section_id": "1.3.7", "section_name": "Eye Conditions"},
      {"section_id": "1.3.8", "section_name": "Mental Health"},
      {"section_id": "1.3.9", "section_name": "Neurological Disorders"},
      {"section_id": "1.3.10", "section_name": "Chronic Respiratory"},
      {"section_id": "1.3.11", "section_name": "Cancers"},
      {"section_id": "1.3.12", "section_name": "Palliative"},
      {"section_id": "1.3.14", "section_name": "Disabilities"},
      {"section_id": "1.3.15", "section_name": "Cardiovascular Diseases"},
      {"section_id": "1.3.16", "section_name": "Renal Diseases"},
      {"section_id": "1.3.17", "section_name": "Liver Diseases"},
      {"section_id": "1.3.18", "section_name": "Endocrine Metabolic Disorders"},
      {"section_id": "1.3.19", "section_name": "Injuries"},
      {"section_id": "1.3.20", "section_name": "Minor Operations OPD"},
      {"section_id": "1.3.21", "section_name": "Neglected Tropical Diseases"},
      {"section_id": "1.3.22", "section_name": "Maternal Conditions"},
      {"section_id": "1.3.24", "section_name": "Deaths in OPD"},
      {"section_id": "1.3.25", "section_name": "Emergency Medical Services"},
      {"section_id": "1.3.26", "section_name": "TB Screening"},
      {"section_id": "1.3.27", "section_name": "Leprosy Services"},
      {"section_id": "1.3.28", "section_name": "Nutrition Services"},
      {"section_id": "1.3.29", "section_name": "Gender Based Violence Services"}
    ]
  },
  {
            "id": 2,
            "dataset_id": "HMIS_105_02",
            "dataset_name": "HMIS 105:02 - OPD Monthly Report (MCH, FP, EPI)",
            "sections": [
                {
                    "section_id": "2.1",
                    "section_name": "Antenatal"
                },
                {
                    "section_id": "2.2",
                    "section_name": "Maternity"
                },
                {
                    "section_id": "2.3",
                    "section_name": "Postnatal"
                },
                {
                    "section_id": "2.4.1",
                    "section_name": "Family Planning Client Visits"
                },
                {
                    "section_id": "2.4.2",
                    "section_name": "Contraceptives Dispensed"
                },
                {
                    "section_id": "2.6",
                    "section_name": "Child Health Services"
                },
                {
                    "section_id": "2.6.2",
                    "section_name": "Tetanus Vaccination"
                },
                {
                    "section_id": "2.6.3",
                    "section_name": "Child Immunization"
                },
                {
                    "section_id": "2.6.4",
                    "section_name": "Vaccine Availability"
                }
            ]
        },
  {
    "dataset_id": "HMIS_105_06",
    "dataset_name": "HMIS 105:06 - OPD Monthly Report (Essential Medicines)",
    "sections": [
      {"section_id": "6.1", "section_name": "Essential Medicines and Health Supplies"}
    ]
  },
    {
    "dataset_id": "HMIS_105_10",
    "dataset_name": "HMIS 105:10 - OPD Monthly Report (Laboratory)",
    "sections": [
      {"section_id": "10.1", "section_name": "Total Laboratory Client Visits"},
      {"section_id": "10.1.2", "section_name": "Specimen Collected"},
      {"section_id": "10.2.1", "section_name": "Laboratory Routine Tests"}
    ]
  }
]
```

### 8. create an admin user account using postman

API endpoint to be used
```
http://<facilityIP>/api/users/register
```

Json Body Payload
```
{
    "username": "admin",
    "password": "admin1234",
    "firstname": "Super",
    "lastname": "Admin",
    "role":"admin"
}
```



