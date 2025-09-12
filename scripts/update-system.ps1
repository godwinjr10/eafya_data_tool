# EAFYA Data Tool - Automated Update Script (Windows PowerShell)
# This script handles both frontend and backend updates

param(
    [string]$Action = "update"
)

# Configuration
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"
$DeploymentDir = "/var/www/eafya_data_tool/html"
$ServerIP = "209.38.246.149"
$BackupDir = "/var/backups/eafya_data_tool"

# Logging functions
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        default { "Blue" }
    }
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

function Write-Error-Log {
    param([string]$Message)
    Write-Log $Message "ERROR"
}

function Write-Success-Log {
    param([string]$Message)
    Write-Log $Message "SUCCESS"
}

function Write-Warning-Log {
    param([string]$Message)
    Write-Log $Message "WARNING"
}

# Function to create backup
function New-Backup {
    Write-Log "Creating backup of current deployment..."
    
    if (Test-Path $DeploymentDir) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        $backupName = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Copy-Item -Path $DeploymentDir -Destination "$BackupDir/$backupName" -Recurse
        Write-Success-Log "Backup created successfully"
    } else {
        Write-Warning-Log "No existing deployment found, skipping backup"
    }
}

# Function to update backend
function Update-Backend {
    Write-Log "Updating backend..."
    
    Set-Location $BackendDir
    
    # Install/update dependencies
    Write-Log "Installing backend dependencies..."
    npm install --production
    
    # Restart backend service (assuming you're using PM2 or similar)
    if (Get-Command pm2 -ErrorAction SilentlyContinue) {
        Write-Log "Restarting backend with PM2..."
        pm2 restart eafya-backend
        if ($LASTEXITCODE -ne 0) {
            pm2 start server.js --name eafya-backend
        }
    } else {
        Write-Log "PM2 not found, please restart backend manually"
    }
    
    Write-Success-Log "Backend updated successfully"
}

# Function to update frontend
function Update-Frontend {
    Write-Log "Updating frontend..."
    
    Set-Location $FrontendDir
    
    # Install/update dependencies
    Write-Log "Installing frontend dependencies..."
    npm install
    
    # Build frontend
    Write-Log "Building frontend..."
    npm run build
    
    # Deploy to server
    Write-Log "Deploying frontend to server..."
    if ($ServerIP) {
        # Remote deployment
        scp -r ./build/* root@$ServerIP`:$DeploymentDir/
    } else {
        # Local deployment
        Copy-Item -Path "./build/*" -Destination $DeploymentDir -Recurse -Force
    }
    
    Write-Success-Log "Frontend updated successfully"
}

# Function to check for updates
function Test-ForUpdates {
    Write-Log "Checking for updates..."
    
    Set-Location $ProjectRoot
    
    # Check if there are any changes in the repository
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Warning-Log "There are uncommitted changes. Please commit or stash them first."
        return $false
    }
    
    # Pull latest changes
    git fetch origin
    $local = git rev-parse HEAD
    $remote = git rev-parse origin/main
    
    if ($local -eq $remote) {
        Write-Success-Log "No updates available"
        return $false
    } else {
        Write-Success-Log "Updates available, pulling latest changes..."
        git pull origin main
        return $true
    }
}

# Function to run database migrations
function Invoke-Migrations {
    Write-Log "Running database migrations..."
    
    Set-Location $BackendDir
    
    # Run any database setup scripts
    if (Test-Path "scripts/addtables.js") {
        node scripts/addtables.js
    }
    
    Write-Success-Log "Database migrations completed"
}

# Function to verify deployment
function Test-Deployment {
    Write-Log "Verifying deployment..."
    
    # Check if backend is responding
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/version" -UseBasicParsing
        Write-Success-Log "Backend is responding"
    } catch {
        Write-Error-Log "Backend is not responding"
        return $false
    }
    
    # Check if frontend files exist
    if (Test-Path (Join-Path $DeploymentDir "index.html")) {
        Write-Success-Log "Frontend files deployed successfully"
    } else {
        Write-Error-Log "Frontend deployment failed"
        return $false
    }
    
    return $true
}

# Main update function
function Start-Update {
    Write-Log "Starting EAFYA Data Tool update process..."
    
    # Check for updates
    if (-not (Test-ForUpdates)) {
        Write-Log "No updates available, exiting..."
        return
    }
    
    # Create backup
    New-Backup
    
    # Update backend
    Update-Backend
    
    # Update frontend
    Update-Frontend
    
    # Run migrations
    Invoke-Migrations
    
    # Verify deployment
    if (Test-Deployment) {
        Write-Success-Log "Update completed successfully!"
        Write-Log "Application is now running the latest version"
    } else {
        Write-Error-Log "Update verification failed!"
        Write-Log "Please check the logs and fix any issues"
        exit 1
    }
}

# Handle command line arguments
switch ($Action.ToLower()) {
    "check" { Test-ForUpdates }
    "backend" { Update-Backend }
    "frontend" { Update-Frontend }
    "verify" { Test-Deployment }
    default { Start-Update }
}
