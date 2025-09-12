#!/bin/bash

# EAFYA Data Tool - Automated Update Script
# This script handles both frontend and backend updates

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DEPLOYMENT_DIR="/var/www/eafya_data_tool/html"
SERVER_IP="209.38.246.149"
BACKUP_DIR="/var/backups/eafya_data_tool"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to create backup
create_backup() {
    log "Creating backup of current deployment..."
    
    if [ -d "$DEPLOYMENT_DIR" ]; then
        sudo mkdir -p "$BACKUP_DIR"
        sudo cp -r "$DEPLOYMENT_DIR" "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S)"
        success "Backup created successfully"
    else
        warning "No existing deployment found, skipping backup"
    fi
}

# Function to update backend
update_backend() {
    log "Updating backend..."
    
    cd "$BACKEND_DIR"
    
    # Install/update dependencies
    log "Installing backend dependencies..."
    npm install --production
    
    # Restart backend service (assuming you're using PM2 or similar)
    if command -v pm2 &> /dev/null; then
        log "Restarting backend with PM2..."
        pm2 restart eafya-backend || pm2 start server.js --name eafya-backend
    else
        log "PM2 not found, please restart backend manually"
    fi
    
    success "Backend updated successfully"
}

# Function to update frontend
update_frontend() {
    log "Updating frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Install/update dependencies
    log "Installing frontend dependencies..."
    npm install
    
    # Build frontend
    log "Building frontend..."
    npm run build
    
    # Deploy to server
    log "Deploying frontend to server..."
    if [ -n "$SERVER_IP" ]; then
        # Remote deployment
        scp -r ./build/* root@$SERVER_IP:$DEPLOYMENT_DIR/
    else
        # Local deployment
        sudo cp -r ./build/* $DEPLOYMENT_DIR/
    fi
    
    success "Frontend updated successfully"
}

# Function to check for updates
check_for_updates() {
    log "Checking for updates..."
    
    cd "$PROJECT_ROOT"
    
    # Check if there are any changes in the repository
    if git status --porcelain | grep -q .; then
        warning "There are uncommitted changes. Please commit or stash them first."
        return 1
    fi
    
    # Pull latest changes
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        success "No updates available"
        return 1
    else
        success "Updates available, pulling latest changes..."
        git pull origin main
        return 0
    fi
}

# Function to run database migrations
run_migrations() {
    log "Running database migrations..."
    
    cd "$BACKEND_DIR"
    
    # Run any database setup scripts
    if [ -f "scripts/addtables.js" ]; then
        node scripts/addtables.js
    fi
    
    success "Database migrations completed"
}

# Function to verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if backend is responding
    if curl -f http://localhost:5000/api/version > /dev/null 2>&1; then
        success "Backend is responding"
    else
        error "Backend is not responding"
        return 1
    fi
    
    # Check if frontend files exist
    if [ -f "$DEPLOYMENT_DIR/index.html" ]; then
        success "Frontend files deployed successfully"
    else
        error "Frontend deployment failed"
        return 1
    fi
}

# Main update function
main() {
    log "Starting EAFYA Data Tool update process..."
    
    # Check for updates
    if ! check_for_updates; then
        log "No updates available, exiting..."
        exit 0
    fi
    
    # Create backup
    create_backup
    
    # Update backend
    update_backend
    
    # Update frontend
    update_frontend
    
    # Run migrations
    run_migrations
    
    # Verify deployment
    if verify_deployment; then
        success "Update completed successfully!"
        log "Application is now running the latest version"
    else
        error "Update verification failed!"
        log "Please check the logs and fix any issues"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    "check")
        check_for_updates
        ;;
    "backend")
        update_backend
        ;;
    "frontend")
        update_frontend
        ;;
    "verify")
        verify_deployment
        ;;
    *)
        main
        ;;
esac
