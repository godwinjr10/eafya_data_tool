### Deployment Guide for eafya_data_tool + Pentaho

Follow these steps to upgrade and deploy the backend, frontend, and Pentaho ETL components.

---

## Step 1. Delete the Old  Data Tool Folder on the Facility Server

```bash
cd /home/artson_admin
sudo rm -rf eafya_data_tool
```

## Step 2. Clone the Latest eafya_data_tool source code

```bash
cd /home/artson_admin
sudo git clone https://FrankMwesigwa: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@github.com/FrankMwesigwa/eafya_data_tool.git
```

## Step 3. Setup the .env environment variables for the Backend

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

## Step 4. Install Backend Dependencies

```bash
sudo yarn install
```

## Step 5. Stop and Restart the Backend Service

```bash
sudo systemctl stop eafya-dwh.service
sudo systemctl start eafya-dwh.service
sudo systemctl status eafya-dwh.service
```

## Step 6. Run the following scripts to create the tables and upload the csvs

```bash
cd /home/artson_admin/eafya_data_tool/backend/scripts
node allSetup.js
```
## Step 7. Install the Frontend Packages by running yarn install

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

## Step 8. Deploy Data Mining Tool Frontend by running yarn deploy

```bash
sudo yarn deploy
```

## Step 9. Run Pentaho ETL Jobs

```bash
cd /home/artson_admin/data-integration
./kitchen.sh -file=/home/artson_admin/eafya_data_tool/eafya_dwh/Main.eAFYA.kjb
```

### Step 10. Configure Facility Settings

- Add facility name and DHIS2 code in settings.
- Add the Dhis2 Username and Password


### Step 11.  Schedule Daily Cron Job (2 AM)

Set up cron job to run Pentaho ETL daily at 2:00 AM

```bash
sudo crontab -e
```

```cron
# Daily at 02:00 — Pentaho ETL
0 2 * * * /home/artson_admin/data-integration/kitchen.sh -file=/home/artson_admin/eafya_data_tool/eafya_dwh/Main.eAFYA.kjb
```


