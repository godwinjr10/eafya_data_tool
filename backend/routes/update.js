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
        // Ensure we have fresh remote refs
        await execAsync("git fetch origin --prune");

        // Determine branch and upstream tracking ref
        const { stdout: currentBranch } = await execAsync(
          "git branch --show-current"
        );
        const branchName = currentBranch.trim() || "master";

        let upstreamRef = `origin/${branchName}`;
        try {
          const { stdout: upstream } = await execAsync(
            "git rev-parse --abbrev-ref --symbolic-full-name @{u}"
          );
          upstreamRef = upstream.trim();
        } catch {}

        const [currentHash, remoteHash, lastCommit] = await Promise.all([
          execAsync("git rev-parse HEAD"),
          execAsync(`git rev-parse ${upstreamRef}`),
          execAsync("git log -1 --format=%cd --date=iso"),
        ]);

        const currentFull = currentHash.stdout.trim();
        const remoteFull = remoteHash.stdout.trim();

        gitInfo = {
          currentCommit: currentFull.substring(0, 7),
          remoteCommit: remoteFull.substring(0, 7),
          lastCommitDate: lastCommit.stdout.trim(),
          hasUpdates: currentFull !== remoteFull,
          currentBranch: branchName,
          upstream: upstreamRef,
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

      // Get current branch name for update
      const { stdout: currentBranch } = await execAsync(
        "git branch --show-current"
      );
      const branchName = currentBranch.trim();

      // Check if there are new commits
      const { stdout: remoteHash } = await execAsync(
        `git rev-parse origin/${branchName}`
      );
      console.log("📋 Remote commit:", remoteHash.trim());

      // Always run materialized views setup even if no code changes
      console.log("🔧 Creating/updating materialized views...");
      try {
        const { stdout: mvOutput, stderr: mvError } = await execAsync(
          "node scripts/materialized.js materialized"
        );
        console.log("✅ Materialized views setup output:", mvOutput);
        if (mvError) console.log("Materialized views warnings:", mvError);
        console.log("✅ Materialized views created/updated successfully");
      } catch (mvError) {
        console.error("❌ Materialized views setup failed:", mvError.message);
        console.error("Full error:", mvError);
      }

      if (currentHash.trim() === remoteHash.trim()) {
        return res.json({
          message: "Already up to date, but materialized views updated",
          currentVersion: currentHash.trim().substring(0, 7),
          timestamp: new Date().toISOString(),
        });
      }

      // Pull latest changes
      console.log("⬇️ Pulling latest changes...");
      await execAsync(`git pull origin ${branchName}`);

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
      setTimeout(async () => {
        console.log("🔄 Restarting server...");
        console.log("💡 Server will restart automatically...");

        try {
          // Import and use the restart script
          const restartServer = (await import("../scripts/restart-server.js"))
            .default;
          restartServer();
        } catch (error) {
          console.log("❌ Auto-restart failed, manual restart required");
          console.log("💡 Please restart manually with: npm start");
          process.exit(0);
        }
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
