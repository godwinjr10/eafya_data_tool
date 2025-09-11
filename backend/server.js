import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { testConnection, sequelize } from "./config/database.js";
import attendanceRoutes from "./routes/dhisreports/attendance.js";
import conditionRoutes from "./routes/dhisreports/conditions.js";
import commoditiesRoutes from "./routes/dhisreports/commodities.js";
import labTestRoutes from "./routes/dhisreports/labtests.js";
import FacilityRoutes from "./routes/facility.js";
import userRoutes from "./routes/users.js";
import antenatalRoutes from "./routes/dhisreports/antenatal.js";
import tetanusRoutes from "./routes/dhisreports/tetanus.js";
import immunizationRoutes from "./routes/dhisreports/immunization.js";
import downloadRoutes from "./routes/dhisreports/downloads.js";
import outpatientRoutes from "./routes/reports/outpatient.js";
import commoditiesReportRoutes from "./routes/reports/commodities.js";
import dashboardRoutes from "./routes/dhisreports/dashboard.js";
import dhisIntegration from "./routes/dhisintegration/dhisroutes.js";
import mappingRoutes from "./routes/mapping/hmis.js";
import datasetRoutes from "./routes/mapping/datasets.js";
import eafyaRoutes from "./routes/mapping/eafya.js";
import maternityRoutes from "./routes/dhisreports/maternity.js";
import postnatalRoutes from "./routes/dhisreports/postnatal.js";
import familyPlanningRoutes from "./routes/dhisreports/familyplanning.js";
import childHealthRoutes from "./routes/dhisreports/childHealth.js";
import tetanusVaccinationRoutes from "./routes/dhisreports/tetanusVaccination.js";
import childImmunizationRoutes from "./routes/dhisreports/childImmunization.js";
import eafyaDetailRoutes from "./routes/mapping/eafya-details.js";
import hmis108Routes from "./routes/dhisreports/108Routes.js";
import materializedViewIdsRoutes from "./routes/mapping/materializedViewIds.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

testConnection();

// Sync database models
const syncDatabase = async () => {
  try {
    await sequelize.sync({
      alter: false, // Disable automatic schema alterations
    });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

syncDatabase();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/labtests", labTestRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/facility", FacilityRoutes);
app.use("/api/conditions", conditionRoutes);
app.use("/api/commodities", commoditiesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/antenatal", antenatalRoutes);
app.use("/api/tetanus", tetanusRoutes);
app.use("/api/immunization", immunizationRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/outpatient", outpatientRoutes);
app.use("/api/commodities/report", commoditiesReportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dhis", dhisIntegration);
app.use("/api/mapping", mappingRoutes);
app.use("/api/eafya", eafyaRoutes);
app.use("/api/maternity", maternityRoutes);
app.use("/api/postnatal", postnatalRoutes);
app.use("/api/family-planning", familyPlanningRoutes);
app.use("/api/child-health", childHealthRoutes);
app.use("/api/tetanus-vaccination", tetanusVaccinationRoutes);
app.use("/api/child-immunization", childImmunizationRoutes);
app.use("/api/eafya-details", eafyaDetailRoutes);
app.use("/api/hmis108", hmis108Routes);
app.use("/api/materialized-view-ids", materializedViewIdsRoutes);

// Version and update endpoints
app.get("/api/version", async (req, res) => {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, "package.json"), "utf8")
    );

    // Get Git information
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    let gitInfo = {};
    try {
      const [currentHash, remoteHash, lastCommit] = await Promise.all([
        execAsync("git rev-parse HEAD"),
        execAsync("git rev-parse origin/main"),
        execAsync("git log -1 --format=%cd --date=iso"),
      ]);

      gitInfo = {
        currentCommit: currentHash.stdout.trim().substring(0, 7),
        remoteCommit: remoteHash.stdout.trim().substring(0, 7),
        lastCommitDate: lastCommit.stdout.trim(),
        hasUpdates: currentHash.stdout.trim() !== remoteHash.stdout.trim(),
      };
    } catch (gitError) {
      console.warn("Git information not available:", gitError.message);
      gitInfo = { error: "Git not available" };
    }

    res.json({
      version: packageJson.version,
      name: packageJson.name,
      lastUpdated: new Date().toISOString(),
      uptime: process.uptime(),
      git: gitInfo,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get version info" });
  }
});

app.post("/api/update", async (req, res) => {
  try {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    console.log("🚀 Starting real update process...");

    // Get current commit hash
    const { stdout: currentHash } = await execAsync("git rev-parse HEAD");
    console.log("📋 Current commit:", currentHash.trim());

    // Fetch latest changes from GitHub
    console.log("📥 Fetching latest changes from GitHub...");
    await execAsync("git fetch origin");

    // Check if there are new commits
    const { stdout: remoteHash } = await execAsync("git rev-parse origin/main");
    console.log("📋 Remote commit:", remoteHash.trim());

    if (currentHash.trim() === remoteHash.trim()) {
      return res.json({
        message: "Already up to date",
        currentVersion: currentHash.trim().substring(0, 7),
        timestamp: new Date().toISOString(),
      });
    }

    // Pull latest changes
    console.log("⬇️ Pulling latest changes...");
    await execAsync("git pull origin main");

    // Install backend dependencies
    console.log("📦 Installing backend dependencies...");
    await execAsync("npm install --production");

    // Build frontend
    console.log("🏗️ Building frontend...");
    await execAsync("cd ../frontend && npm install && npm run build");

    // Deploy frontend (using your existing deploy script)
    console.log("🚀 Deploying frontend...");
    await execAsync("cd ../frontend && npm run deploy");

    // Get new version info
    const { stdout: newHash } = await execAsync("git rev-parse HEAD");
    const { stdout: packageJson } = await execAsync("cat package.json");
    const packageInfo = JSON.parse(packageJson);

    console.log("✅ Update completed successfully!");

    res.json({
      message: "Update completed successfully",
      previousVersion: currentHash.trim().substring(0, 7),
      newVersion: newHash.trim().substring(0, 7),
      version: packageInfo.version,
      timestamp: new Date().toISOString(),
      restartRequired: true,
    });

    // Restart the server after a short delay
    setTimeout(() => {
      console.log("🔄 Restarting server...");
      console.log("💡 To restart manually, run: npm start");
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error("❌ Update failed:", error);
    res.status(500).json({
      error: "Update failed",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
