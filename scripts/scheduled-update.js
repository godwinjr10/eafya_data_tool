const { exec } = require("child_process");
const cron = require("node-cron");
const path = require("path");

// Configuration
const UPDATE_TIME = "0 2 * * *"; // 2:00 AM daily
const PROJECT_ROOT = path.join(__dirname, "..");

// Logging function
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Function to run update script
function runUpdate() {
  return new Promise((resolve, reject) => {
    log("Starting scheduled update...");

    const isWindows = process.platform === "win32";
    const scriptPath = isWindows
      ? path.join(__dirname, "update-system.ps1")
      : path.join(__dirname, "update-system.sh");

    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `bash "${scriptPath}"`;

    exec(command, { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
      if (error) {
        log(`Update failed: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        log(`Update warnings: ${stderr}`);
      }

      log(`Update completed: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Function to check if update is needed
async function checkForUpdates() {
  return new Promise((resolve) => {
    exec("git fetch origin", { cwd: PROJECT_ROOT }, (error) => {
      if (error) {
        log(`Error fetching updates: ${error.message}`);
        resolve(false);
        return;
      }

      exec("git rev-parse HEAD", { cwd: PROJECT_ROOT }, (err1, localHash) => {
        if (err1) {
          log(`Error getting local hash: ${err1.message}`);
          resolve(false);
          return;
        }

        exec(
          "git rev-parse origin/main",
          { cwd: PROJECT_ROOT },
          (err2, remoteHash) => {
            if (err2) {
              log(`Error getting remote hash: ${err2.message}`);
              resolve(false);
              return;
            }

            const hasUpdates = localHash.trim() !== remoteHash.trim();
            log(
              `Update check: ${hasUpdates ? "Updates available" : "No updates"}`
            );
            resolve(hasUpdates);
          }
        );
      });
    });
  });
}

// Main scheduled update function
async function scheduledUpdate() {
  try {
    log("Running scheduled update check...");

    const hasUpdates = await checkForUpdates();

    if (hasUpdates) {
      log("Updates found, starting update process...");
      await runUpdate();
      log("Scheduled update completed successfully");
    } else {
      log("No updates available, skipping update");
    }
  } catch (error) {
    log(`Scheduled update failed: ${error.message}`);
  }
}

// Start the cron job
log(`Starting scheduled update service...`);
log(`Update schedule: ${UPDATE_TIME} (daily at 2:00 AM)`);

cron.schedule(UPDATE_TIME, scheduledUpdate, {
  scheduled: true,
  timezone: "UTC",
});

// Also run immediately if this is the first time
log("Running initial update check...");
scheduledUpdate();

// Keep the process running
process.on("SIGINT", () => {
  log("Scheduled update service stopped");
  process.exit(0);
});

log("Scheduled update service is running...");
