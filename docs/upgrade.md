### Deployment Guide for eafya_data_tool + Pentaho

Follow these steps to upgrade and deploy the backend, frontend, and Pentaho ETL components.

---

## 1) Pull the Latest eafya_report_scripts Folder with the Lastest Pentaho Changes

```bash
cd /home/artson_admin/eafya_report_scripts
git remote set-url origin https://FrankMwesigwa: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@github.com/FrankMwesigwa/eafya_report_scripts.git
sudo git pull origin develop
```

## 2) Remove Old Tool Data Tool Folder Installation

```bash
cd /home/artson_admin
sudo rm -rf eafya_data_tool
```

## 3) Clone the Latest eafya_data_tool

```bash
sudo git clone https://FrankMwesigwa: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@github.com/FrankMwesigwa/eafya_data_tool.git
```

## 4) Configure Backend

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

## 5) Install Backend Dependencies

```bash
sudo yarn install
```

## 6) Stop and Restart the Backend Services

```bash
sudo systemctl stop eafya-dwh.service
sudo systemctl start eafya-dwh.service
sudo systemctl status eafya-dwh.service
```

## 6) Create the Reporting Database Tables and Schemas By Running the addtables script

```bash
cd /home/artson_admin/eafya_data_tool/backend/scripts
node addtables.js
node uploads.js
node setupData.js
node addIds.js
```
## 7) Install the Frontend Packages by running yarn install

```bash
cd /home/artson_admin/eafya_data_tool/frontend
yarn install
```

Create `.env`: For thr Frontend 
sudo nano .env

```env
REACT_APP_API_URL_DEV=http://localhost:5000/api
REACT_APP_API_URL_PROD=http://192.168.1.20/api
NODE_ENV=production
```

## 8) Deploy Data Mining Tool Frontend by running yarn deploy

```bash
sudo yarn deploy
```

## 9) Run Pentaho ETL Jobs

```bash
cd /home/artson_admin/data-integration
./kitchen.sh -file=/home/artson_admin/eafya_report_scripts/eafya_dwh/Main.eAFYA.kjb
```

## 10) Create Materialized Views

```bash
cd /home/artson_admin/eafya_data_tool/backend/scripts
node materialized.js
```

## 11) Configure Facility Settings

- Add facility name and DHIS2 code in settings.
- Walk the team through the mapping process for validation.

## 12) Final Steps

- Log into the Data Tool via the frontend.
- Perform initial smoke testing (login, mappings, sample queries).


## 13) Schedule Daily Cron Job (2 AM)

Set up cron job to run Pentaho ETL daily at 2:00 AM

create the log directory first so logs are captured:

```bash
sudo mkdir -p /var/log/eafya && sudo chown root:root /var/log/eafya
```

```bash
sudo crontab -e
```

Add the following lines.

```cron
# Daily at 02:00 — Pentaho ETL
0 2 * * * cd /home/artson_admin/data-integration && ./kitchen.sh -file=/home/artson_admin/eafya_report_scripts/eafya_dwh/Main.eAFYA.kjb >> /var/log/eafya/etl.log 2>&1

# Monthly on the 1st at 05:00 — Refresh materialized views
0 5 1 * * node /home/artson_admin/eafya_data_tool/backend/scripts/materialized.js >> /var/log/eafya/materialized.log 2>&1
```


