# EAFYA Data Tool - Update System

This document explains how to use the automated update system for the EAFYA Data Tool.

## Features

- ✅ **Manual Update Button**: Click to check and install updates
- ✅ **Automatic Update Checking**: Checks for updates every 30 minutes
- ✅ **Scheduled Nightly Updates**: Automatic updates at 2:00 AM daily
- ✅ **Version Tracking**: Backend API to check current version
- ✅ **Backup System**: Creates backups before updates
- ✅ **Deployment Scripts**: Automated frontend and backend deployment
- ✅ **Update Notifications**: Toast notifications when updates are available

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd backend && npm install
```

### 2. Manual Updates

```bash
# Check for updates
npm run update:check

# Update everything
npm run update

# Update only backend
npm run update:backend

# Update only frontend
npm run update:frontend

# Verify deployment
npm run update:verify
```

### 3. Setup Scheduled Updates

```powershell
# Run as Administrator
powershell -ExecutionPolicy Bypass -File scripts/setup-scheduled-updates.ps1
```

## Components

### Frontend Components

1. **UpdateButton.jsx** - Manual update button with modal
2. **UpdateNotification.jsx** - Toast notification for available updates
3. **useAutoUpdate.js** - Custom hook for automatic update checking

### Backend API

- `GET /api/version` - Get current version information
- `POST /api/update` - Trigger update process

### Scripts

- `update-system.ps1` - Windows PowerShell update script
- `update-system.sh` - Linux/macOS bash update script
- `scheduled-update.js` - Node.js scheduled update service
- `setup-scheduled-updates.ps1` - Windows Task Scheduler setup

## Configuration

### Update Schedule

The system checks for updates every 30 minutes and can be configured in `frontend/src/App.js`:

```javascript
const { updateAvailable, isChecking, triggerUpdate, dismissUpdate } =
  useAutoUpdate(30 * 60 * 1000); // 30 minutes
```

### Nightly Updates

Scheduled updates run daily at 2:00 AM UTC. To change this, edit `scripts/scheduled-update.js`:

```javascript
const UPDATE_TIME = "0 2 * * *"; // 2:00 AM daily (cron format)
```

### Deployment Paths

Update the deployment paths in the scripts:

**PowerShell (scripts/update-system.ps1):**

```powershell
$DeploymentDir = "/var/www/eafya_data_tool/html"
$ServerIP = "209.38.246.149"
```

**Bash (scripts/update-system.sh):**

```bash
DEPLOYMENT_DIR="/var/www/eafya_data_tool/html"
SERVER_IP="209.38.246.149"
```

## Usage Examples

### Manual Update Process

1. **Check for Updates**:

   ```bash
   npm run update:check
   ```

2. **Update Everything**:

   ```bash
   npm run update
   ```

3. **Update Specific Components**:
   ```bash
   npm run update:backend
   npm run update:frontend
   ```

### Frontend Integration

Add the update button to any component:

```jsx
import UpdateButton from "./components/UpdateButton";

function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
      <UpdateButton />
    </div>
  );
}
```

### Backend Integration

The backend automatically provides version information at `/api/version`:

```json
{
  "version": "1.0.0",
  "name": "eafya-hmis-backend",
  "lastUpdated": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

## Troubleshooting

### Common Issues

1. **Permission Errors**:

   - Run PowerShell as Administrator
   - Check file permissions

2. **Git Issues**:

   - Ensure you're in a git repository
   - Check if there are uncommitted changes

3. **Deployment Failures**:

   - Verify server connectivity
   - Check deployment paths
   - Ensure backup space is available

4. **Update Notifications Not Showing**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check network connectivity

### Logs

- **PowerShell Scripts**: Output to console
- **Node.js Scripts**: Output to console with timestamps
- **Windows Task Scheduler**: Check Event Viewer

### Manual Recovery

If automatic updates fail:

1. **Restore from Backup**:

   ```bash
   # Find backup directory
   ls /var/backups/eafya_data_tool/

   # Restore from backup
   sudo cp -r /var/backups/eafya_data_tool/backup_YYYYMMDD_HHMMSS/* /var/www/eafya_data_tool/html/
   ```

2. **Manual Git Update**:

   ```bash
   git fetch origin
   git pull origin main
   ```

3. **Manual Deployment**:
   ```bash
   cd frontend && npm run build
   npm run deploy
   ```

## Security Considerations

- Update scripts run with elevated privileges
- Backups are created before each update
- Git repository should be properly secured
- API endpoints should be protected in production

## Customization

### Adding Custom Update Logic

Edit `scripts/update-system.ps1` or `scripts/update-system.sh` to add custom update steps:

```powershell
# Custom update step
function Invoke-CustomUpdate {
    Write-Log "Running custom update logic..."
    # Your custom code here
}
```

### Custom Version Checking

Modify `frontend/src/hooks/useAutoUpdate.js` to implement custom version comparison:

```javascript
// Custom version comparison logic
const hasUpdates = compareVersions(storedVersion, currentVersion);
```

## Support

For issues or questions about the update system:

1. Check the logs for error messages
2. Verify all dependencies are installed
3. Ensure proper permissions are set
4. Check network connectivity for remote deployments

## Version History

- **v1.0.0** - Initial update system implementation
  - Manual update button
  - Automatic update checking
  - Scheduled nightly updates
  - Backup system
  - Deployment scripts
