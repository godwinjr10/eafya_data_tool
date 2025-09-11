# Setup script for Windows Task Scheduler
# This script creates a scheduled task for automatic nightly updates

param(
    [string]$ProjectPath = "D:\wilton\projects\eafya_data_tool",
    [string]$TaskName = "EAFYA Data Tool - Nightly Updates"
)

Write-Host "Setting up scheduled updates for EAFYA Data Tool..." -ForegroundColor Green

# Check if running as administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script requires administrator privileges. Please run as administrator." -ForegroundColor Red
    exit 1
}

# Update the XML file with the correct project path
$xmlPath = Join-Path $PSScriptRoot "setup-scheduled-updates.xml"
$xmlContent = Get-Content $xmlPath -Raw
$xmlContent = $xmlContent -replace "D:\\wilton\\projects\\eafya_data_tool", $ProjectPath.Replace('\', '\\')
$xmlContent | Set-Content $xmlPath

try {
    # Import the scheduled task
    Write-Host "Creating scheduled task..." -ForegroundColor Yellow
    schtasks /create /tn $TaskName /xml $xmlPath /f
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Scheduled task created successfully!" -ForegroundColor Green
        Write-Host "Task Name: $TaskName" -ForegroundColor Cyan
        Write-Host "Schedule: Daily at 2:00 AM" -ForegroundColor Cyan
        Write-Host "Project Path: $ProjectPath" -ForegroundColor Cyan
        
        # Show task details
        Write-Host "`nTask Details:" -ForegroundColor Yellow
        schtasks /query /tn $TaskName /v /fo list
        
        Write-Host "`nTo manage this task:" -ForegroundColor Yellow
        Write-Host "  - View: schtasks /query /tn `"$TaskName`"" -ForegroundColor White
        Write-Host "  - Run now: schtasks /run /tn `"$TaskName`"" -ForegroundColor White
        Write-Host "  - Delete: schtasks /delete /tn `"$TaskName`" /f" -ForegroundColor White
    } else {
        Write-Host "Failed to create scheduled task. Please check the error messages above." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error creating scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nSetup completed successfully!" -ForegroundColor Green
