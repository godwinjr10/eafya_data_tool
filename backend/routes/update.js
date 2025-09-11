import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updateRoutes = (app) => {
  // Version endpoint
  app.get("/api/version", async (req, res) => {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(__dirname, "../package.json"), "utf8")
      );

      // Get Git information
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      let gitInfo = {};
      try {
        const [currentHash, remoteHash, lastCommit] = await Promise.all([
          execAsync("git rev-parse HEAD"),
          execAsync("git rev-parse origin/test_updates"),
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

  // Update endpoint
  app.post("/api/update", async (req, res) => {
    const { skipFrontendBuild = true } = req.body;
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
      const { stdout: remoteHash } = await execAsync(
        "git rev-parse origin/test_updates"
      );
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
      await execAsync("git pull origin test_updates");

      // Install backend dependencies
      console.log("📦 Installing backend dependencies...");
      await execAsync("npm install --production");

      // Fast update - backend only
      console.log("⏭️ Fast update mode - skipping frontend build");

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
};

export default updateRoutes;
