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

## 🚀 TASKS ON THE FACILITY SERVER: DEPLOYING TO FACILITY SERVER

### Step 1. Log into the hospital server and create the reportingdb database using putty.

```
sudo -i -u postgres psql
CREATE ROLE dwh_user WITH LOGIN PASSWORD 'secure_password';
CREATE DATABASE reportingdb WITH OWNER dwh_user;
GRANT ALL PRIVILEGES ON DATABASE reportingdb TO dwh_user;
\q
```

### 2. Download the pentaho data integration tool from github onto your local PC using the AnyDesk PC
```
https://github.com/ambientelivre/legacy-pentaho-ce
```

2. Copy the downloaded pentaho folder from your local PC to the Facility Server
```
scp C:/Users/LENOVO/Downloads/pdi-ce-9.4.0.0-343.zip artson_admin@192.100.100.18:/home/artson_admin/
```

3. on the Server unzip the folder
```
sudo apt update
sudo apt install unzip -y
unzip pdi-ce-9.4.0.0-343.zip -d pdi-ce
```

4. Move the extracted folder from pdi-ce to this folder /home/artson_admin/
```
mv /home/artson_admin/pdi-ce/data-integration /home/artson_admin/
```
### 3. Verify Java Installation and Install Java if not on the server

```
java -version
sudo apt-get update
sudo apt-get install openjdk-8-jre-headless
java -version
```

### Step 4. Setup and Create .kettle Environment Variables

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

### Step 5. Setup shared.xml File for shared database connections

1. Edit the shared.xml file with details below
```
sudo nano ~/.kettle/shared.xml
```

2. Copy and Paste the following details into the shared.xml file
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

## 🚀 Deployment Guide React Frontend Data Mining Tool

### Step 1. Installl the Nginx web server
```
sudo apt-get install nginx
sudo systemctl enable nginx
```

### Step 2. Configure nginx reserve proxy by copying the details

create the application folder for the frontend source code
```
sudo mkdir -p /var/www/eafya_data_tool/html
sudo chown -R $USER:$USER /var/www/eafya_data_tool
```

Edit the nginx configuration file
```
sudo nano /etc/nginx/sites-enabled/default
```

Paste the following configuration file in the opened nano file after deleting the current content there;
```
server {
    listen 80;
    listen [::]:80;

    root /var/www/eafya_data_tool/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
            try_files $uri /index.html;
        }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
		    proxy_set_header Upgrade $http_upgrade;
		    proxy_set_header Connection 'upgrade';
		    roxy_set_header Host $host;
		    proxy_cache_bypass $http_upgrade;
    }
}

```
Reload the nginx file

```
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3. Install Node.js 18 and above

```
sudo curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

### Step 4. Install Yarn

```
sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
yarn -v
```

### Step 5. Clone the master branch from Github onto the Facility Server.
cd /home/artson_admin/
```
sudo git clone https://FrankMwesigwa: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@github.com/FrankMwesigwa/eafya_data_tool.git
```
### Step 6. create the frontend .env file

1. cd /home/artson_admin/eafya_data_tool/frontend
2. Change the REACT_APP_API_URL_PROD to the IP of the Facility

```
REACT_APP_API_URL_DEV=http://localhost:5000/api
REACT_APP_API_URL_PROD=http://192.168.1.20/api
NODE_ENV=production
```

### Step 7. Install the eafya_data_tool application packages
Make sure you are in the data tool path eg  cd /home/artson_admin/eafya_data_tool/frontend

```
sudo yarn install
```

### Step 8. Run the data tool UI application 
Make sure you are in the data tool path eg  cd /home/artson_admin/eafya_data_tool/frontend

```
sudo yarn deploy
```

### Step 9. Go to the web browser to test and confirm that you can access the data tool UI from the browser
Replace facilityIP with the actual facility IP of the Hospital

```
http://<facilityIP>
```

## 🚀 Deployment Guide Backend API Service

### Step 1. Go to the Backend folder as below

```
cd /home/artson_admin/eafya_data_tool/backend
```

### Step 2. Configure the Database Connection details in .env file are for the Facility Database
```bash
cd /home/artson_admin/eafya_data_tool/backend
sudo nano .env
```

Update `.env` with database and API settings:

```env
DB_USER=xxx
DB_HOST=localhost
DB_NAME=xxx
DB_PASSWORD=xxx
DB_PORT=5432
PORT=5000
NODE_ENV=development
JWT_SECRET=12345WQWTYUGBVNcders
SQL_DIR=./sql/materializedviews
```
### Step 3. Install the data tool backend source code Dependencies

Navigate to the backend folder and install the backend dependencies
```
cd /home/artson_admin/eafya_data_tool/backend
sudo yarn install
```

### Step 4. Create a Systemd Service for data tool backend API

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

### 5. Run the following scripts to create the tables and upload the csvs

```bash
cd /home/artson_admin/eafya_data_tool/backend/scripts
node addtables.js
node uploads.js
node setupData.js
node addIds.js
node views.js
```

### Step 6. Run Pentaho ETL Jobs

```bash
cd /home/artson_admin/data-integration
./kitchen.sh -file=/home/artson_admin/eafya_data_tool/eafya_dwh/Main.eAFYA.kjb
```

### Step 7. Configure Facility Settings

- Add facility name and DHIS2 code in settings.
- Walk the team through the mapping process for validation.


### Step 8.  Schedule Daily Cron Job (2 AM)

Set up cron job to run Pentaho ETL daily at 2:00 AM

```bash
sudo crontab -e
```

```cron
# Daily at 02:00 — Pentaho ETL
0 2 * * * /home/artson_admin/data-integration/kitchen.sh -file=/home/artson_admin/eafya_data_tool/eafya_dwh/Main.eAFYA.kjb
```


