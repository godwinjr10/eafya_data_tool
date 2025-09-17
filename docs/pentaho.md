markdown
# eAFYA ETL Reporting Pipeline (Facility Server Edition)

![ETL Pipeline](https://img.shields.io/badge/process-ETL-blue)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)
![Pentaho](https://img.shields.io/badge/tool-Pentaho%20DI-orange)

This repository contains the ETL (Extract, Transform, Load) pipeline for the eAFYA healthcare reporting system. The pipeline extracts data from facility databases, transforms it according to reporting requirements, and loads it into a dedicated data warehouse for analytics and reporting.

📊 Database Schema Overview
The data warehouse follows this schema structure:

import - Raw imported data
stage - Cleaned and standardized data
dwh - Dimensional model for analytics
reporting - Pre-aggregated report tables

## 📋 Prerequisites

Before deployment, ensure your server meets these requirements:

- Ubuntu Server (20.04 LTS or newer recommended)
- PostgreSQL 16 (with remote connections enabled)
- Pentaho Data Integration (PDI) 9.x
- Git
- Unzip utility
- 8GB+ RAM (16GB recommended for production)
- 100GB+ free disk space

## 🚀 TASKS ON LOCAL PC BEFORE DEPLOYING TO THE SERVER

### Step 1. Pull the latest develop branch from Github onto your local pc.
```
git checkout develop
git pull origin develop
```
### Step 2. Create the Facility git branch on your local pc.
This is the branch that you will be using to make edits for the facility and this should affect only the facility branch

```
git checkout -b <facilityname>
```

Confirm that you are in the facility branch. if you are in the Facility Branch, you can start working
```
git branch
```

### Step 3. Log into the hospital server and create the reportingdb database using putty.

```
sudo -i -u postgres psql
CREATE ROLE dwh_user WITH LOGIN PASSWORD 'secure_password';
CREATE DATABASE reportingdb WITH OWNER dwh_user;
GRANT ALL PRIVILEGES ON DATABASE reportingdb TO dwh_user;
\q
```

### Step 4. Log into the reportingdb using dbeaver
Create the follwing schemas using dbweaver in the reportingdb

```
import
stage
dwh
reporting
```
Run the Table Creation Scripts to create the tables for the different schemas in the reporting database created

```
001_import_tables.sql
002_stage_tables.sql
003_dwh_tables.sql
004_reporting_tables.sql
```

### Step 5. Edit the kettle properties in spoon on your local pc accordingly; 
Edit the kettle properties on for your pentaho local PC

```
EAFYA_ are the facility db details 
dwh_ are the reportingdb details.
```

### Step 6. Log into the facility database using dbeaver to get IDs listed below

1. These are the queries to get the IDs for changing in pentaho
```
select id, name from public.ward 
select id, name from public.clinic
select id, name from public.store
```

2. Change the Following IDs in Pentaho To Match the Facility IDs

```
1. Change the ward id for maternity to match the facility ID in pentaho reporting job => reporting_maternity.ktr
```
```
2. Change the clinic id for antenatal to match the antenatal clinic ID in pentaho reporting job => patient_antenatal.ktr
```
```
3. Change the store id to match the facility ID for commodities in pentaho reporting job => reporting_commodities.ktr
```
```
4. Change the ward id for postnatal to match the facility ID in pentaho reporting job => reporting_postnatal.ktr
```

3. Change the Following IDs in dbweaver materializedviews 
```
1. Change the IDs in the child_health materialized view to match the facility vaccines id
```
```
2. change the ID for hpv to the facility ID for hpv_vaccination materializedview
```
```
3. change the IDs for tetanus to the facility ID to match the tetanus vaccine IDs in the materializedview
```

4. Change the following Ids in the data tool backend routes to match the Ids
```
1. Change the IDs for tetanus in the data_tool_backend ; routes => tetanus.js
```

### 7. 🏃 Run the main eAFYA ETL Job on your local PC to confirm that the pipeline runs successfuly without errors


## 🚀 TASKS ON THE FACILITY SERVER: DEPLOYING TO FACILITY SERVER

### 1. Upload the mapping Excel Sheets into the reportingdb:
Log into the facility server using FilaZilla

### 2. Transfer the pentaho data integration folder from your PC to the Facility Server
```
1. Log into the facility server using FilaZilla

2. Copy Pentaho from yo local PC to the facility server. Copy the data integration folder from yo pc to the facility server under the home directory eg. => /home/artson_admin

3. https://github.com/ambientelivre/legacy-pentaho-ce

4. copy the file from the local pc to the server
scp C:/Users/Frank/Downloads/pdi-ce-9.4.0.0-343.zip artson_admin@192.168.1.50:/home/artson_admin/

5. unzip the file
sudo apt update
sudo apt install unzip -y
unzip pdi-ce-9.4.0.0-343.zip -d pdi-ce-9.4.0.0-343
```
### 3. Verify Java Installation and Install Java if not on the server

```
java -version
sudo apt-get update
sudo apt-get install openjdk-8-jre-headless
java -version
```

### 4. Transfer the eafya_reports_scripts ETL folder from your PC to the Facility Server
```
1. Log into the facility server using FilaZilla

2. Copy the eafya_reports_scripts ETL folder from your PC to the facility server under the home directory eg. => /home/artson_admin
```

### Step 5. Setup and Create .kettle Environment Variables

1. Create .kettle Directory on the Facility Server
```
sudo mkdir -p ~/.kettle
```

2. Add database configuration properties to .kettle.properties File
```
sudo nano ~/.kettle/kettle.properties
```

3. Kettle Properties for the reporting database
```
dwh_host=XXXX
dwh_port=XXXX
dwh_db=XXXX
dwh_user=dXXXX
dwh_password=sXXXX
```

4. Kettle Properties for the eAFYA facility database
```
EAFYA_DB_HOST=XXXX
EAFYA_DB_PORT=XXXX
EAFYA_DB_NAME=XXXX
EAFYA_DB_USER=XXXX
EAFYA_DB_PASSWORD=XXXX
```

### Step 6. Setup shared.xml File for shared database connections

1. Edit the shared.xml file with details below
```
sudo nano ~/.kettle/shared.xml
```

3. Copy and Paste the following details into the shared.xml file
```
<?xml version="1.0" encoding="UTF-8"?>
<sharedobjects>
  <connection>
    <name>dwh_conn</name>
    <server>${dwh_host}</server>
    <type>POSTGRESQL</type>
    <access>Native</access>
    <database>${dwh_db}</database>
    <port>${dwh_port}</port>
    <username>${dwh_user}</username>
    <password>${dwh_password}</password>
    <servername/>
    <data_tablespace/>
    <index_tablespace/>
    <attributes>
      <attribute><code>FORCE_IDENTIFIERS_TO_LOWERCASE</code><attribute>N</attribute></attribute>
      <attribute><code>FORCE_IDENTIFIERS_TO_UPPERCASE</code><attribute>N</attribute></attribute>
      <attribute><code>IS_CLUSTERED</code><attribute>N</attribute></attribute>
      <attribute><code>PORT_NUMBER</code><attribute>${dwh_port}</attribute></attribute>
      <attribute><code>PRESERVE_RESERVED_WORD_CASE</code><attribute>Y</attribute></attribute>
      <attribute><code>QUOTE_ALL_FIELDS</code><attribute>N</attribute></attribute>
      <attribute><code>SUPPORTS_BOOLEAN_DATA_TYPE</code><attribute>Y</attribute></attribute>
      <attribute><code>SUPPORTS_TIMESTAMP_DATA_TYPE</code><attribute>Y</attribute></attribute>
      <attribute><code>USE_POOLING</code><attribute>N</attribute></attribute>
    </attributes>
  </connection>
  <connection>
    <name>local_conn</name>
    <server>${EAFYA_DB_HOST}</server>
    <type>POSTGRESQL</type>
    <access>Native</access>
    <database>${EAFYA_DB_NAME}</database>
    <port>${EAFYA_DB_PORT}</port>
    <username>${EAFYA_DB_USER}</username>
    <password>${EAFYA_DB_PASSWORD}</password>
    <servername/>
    <data_tablespace/>
    <index_tablespace/>
    <attributes>
      <attribute><code>FORCE_IDENTIFIERS_TO_LOWERCASE</code><attribute>N</attribute></attribute>
      <attribute><code>FORCE_IDENTIFIERS_TO_UPPERCASE</code><attribute>N</attribute></attribute>
      <attribute><code>IS_CLUSTERED</code><attribute>N</attribute></attribute>
      <attribute><code>PORT_NUMBER</code><attribute>${EAFYA_DB_PORT}</attribute></attribute>
      <attribute><code>PRESERVE_RESERVED_WORD_CASE</code><attribute>Y</attribute></attribute>
      <attribute><code>QUOTE_ALL_FIELDS</code><attribute>N</attribute></attribute>
      <attribute><code>SUPPORTS_BOOLEAN_DATA_TYPE</code><attribute>Y</attribute></attribute>
      <attribute><code>SUPPORTS_TIMESTAMP_DATA_TYPE</code><attribute>Y</attribute></attribute>
      <attribute><code>USE_POOLING</code><attribute>N</attribute></attribute>
    </attributes>
  </connection>
</sharedobjects>
```

### 7.  Delete all the tables in the reportingdb that were created by running pentaho locally
This is to test that the pentaho Job on the Facility Server runs successfully.
"Make sure that this delete all script is run in the reportingdb and not the facility db"

Execute the main job:
```
deleteAllTables.sql
```

### 8. 🏃 Run the main eAFYA ETL Job

Execute the main job:
```
cd /home/artson_admin/data-integration
./kitchen.sh -file=/home/artson_admin/eafya_report_scripts/eafya_dwh/Main.eAFYA.kjb
```

## 🚀 TASKS ON ANALYTICS

### 1. Upload the mapping Excel Sheets into the reportingdb using dbweaver

These are located in the uploads folder
```
1. dhis_eafya_mapping_commodities
2. dhis_eafya_mapping_conditions
3. dhis_eafya_mapping_labtests
4. dhis_eafya_mapping_antenatal
5. dhis_eafya_mapping_maternity
6. dhis_eafya_mapping_vaccines
7. dhis_eafya_mapping_postnatal
8. dhis_eafya_mapping_familyplanning
```

### 2. Copy all the Materialized views in the database and execute them. 
*Note* to create the materialized views, the reporting tables must have been populated with data from running the ETL.

These are located in the sql/materializedview. Exceute all the views in that folder

### 3. Set up the react data tool
Setup Instrauctions are in the frontend Deployment Guide