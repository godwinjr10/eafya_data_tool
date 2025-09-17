markdown
# React Frontend Data Mining Tool Deployment Guide

![ETL Pipeline](https://img.shields.io/badge/process-ETL-blue)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)
![Pentaho](https://img.shields.io/badge/tool-Pentaho%20DI-orange)

This documentation contains the React Fronted Data Minning Tool Deployment Steps for the eAfYA Reporting Module.

## 🚀 Deployment Guide React Frontend Data Mining Tool

### Step 1. Login into Facility Server
Login into the eafya Sever at the facility using putty. Provide the username and password

### Step 2. Installl the Nginx web server
```
sudo apt-get install nginx
sudo systemctl enable nginx
```

### Step 3. Configure nginx reserve proxy by copying the details

create the application folder for the frontend source code
```
sudo mkdir -p /var/www/eafya_data_tool/html
sudo chown -R $USER:$USER /var/www/eafya_data_tool
```

Edit the nginx configuration file
```
sudo nano /etc/nginx/sites-enabled/default
```

Paste the following configuration file in the opened nano file;
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
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
    }
}

```
Reload the nginx file

```
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4. Install Node.js 18 and above

```
sudo curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

### Step 5. Install Yarn

```
sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
yarn -v
```

### Step 6. ### Step 1. Clone the master branch from Github onto the Facility Server.
cd /home/artson_admin/
```
sudo git clone https://FrankMwesigwa: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@github.com/FrankMwesigwa/eafya_data_tool.git
```
### Step 7. create the frontend .env file

1. cd /home/artson_admin/eafya_data_tool
2. Change the REACT_APP_API_URL_PROD to the IP of the Facility

```
REACT_APP_API_URL_DEV=http://localhost:5000/api
REACT_APP_API_URL_PROD=http://192.168.1.20/api
NODE_ENV=development
```

### Step 8. Install the eafya_data_tool application packages
Make sure you are in the data tool path eg  cd /home/artson_admin/eafya_data_tool

```
sudo yarn install
```

### Step 9. Run the data tool UI application 
Make sure you are in the data tool path eg  cd /home/artson_admin/eafya_data_tool

```
sudo yarn deploy
```

### Step 8. Go to the web browser to test and confirm that you can access the data tool UI from the browser
Replace facilityIP with the actual facility IP of the Hospital

```
http://<facilityIP>
```

### Step 9. Add the Facility Name and dhis2 code in the data tool
This step should only be done once the backend has been deployed and started as well

```
http://<facilityIP>/facility
```






