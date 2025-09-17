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

  // Materialized Views endpoint
  app.post("/api/materialized-views", async (req, res) => {
    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      console.log("🔧 Starting materialized views setup...");

      // Set response headers for Server-Sent Events
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      });

      // Send initial progress
      res.write(
        `data: ${JSON.stringify({
          status: "starting",
          message: "Initializing materialized views setup...",
          progress: 0,
        })}\n\n`
      );

      try {
        // Just run the working materialized.js script directly
        const { spawn } = await import("child_process");
        const child = spawn(
          "node",
          ["scripts/materialized.js", "materialized"],
          {
            cwd: process.cwd(),
            stdio: ["pipe", "pipe", "pipe"],
          }
        );

        let output = "";
        let progress = 0;
        let totalFiles = 0;
        let processedFiles = 0;

        child.stdout.on("data", (data) => {
          const lines = data.toString().split("\n");
          for (const line of lines) {
            if (line.includes("Found") && line.includes("files")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message: line.trim(),
                  progress: 10,
                })}\n\n`
              );
            } else if (line.includes("Dropping existing")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message: line.trim(),
                  progress: 20,
                })}\n\n`
              );
            } else if (line.includes("Creating regular views")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message: "⚡ Creating regular views (fast)...",
                  progress: 30,
                })}\n\n`
              );
            } else if (line.includes("Creating materialized views")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message:
                    "⚡ Creating materialized views (this takes time)...",
                  progress: 60,
                })}\n\n`
              );
            } else if (line.includes("Executing:")) {
              const fileName = line.split("Executing:")[1]?.trim() || "";
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message: `Processing ${fileName}...`,
                  progress: Math.min(progress + 2, 90),
                })}\n\n`
              );
              progress = Math.min(progress + 2, 90);
            } else if (line.includes("executed successfully")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "success",
                  message: `✅ ${line.trim()}`,
                  progress: Math.min(progress + 1, 95),
                })}\n\n`
              );
            } else if (line.includes("setup completed")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message: line.trim(),
                  progress: 95,
                })}\n\n`
              );
            } else if (line.includes("ALL VIEWS CREATED")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "progress",
                  message: line.trim(),
                  progress: 100,
                })}\n\n`
              );
            } else if (line.includes("Time taken:")) {
              res.write(
                `data: ${JSON.stringify({
                  status: "success",
                  message: `⏱️ ${line.trim()}`,
                  progress: 100,
                })}\n\n`
              );
            }
          }
        });

        child.stderr.on("data", (data) => {
          res.write(
            `data: ${JSON.stringify({
              status: "warning",
              message: data.toString().trim(),
            })}\n\n`
          );
        });

        child.on("close", (code) => {
          if (code === 0) {
            res.write(
              `data: ${JSON.stringify({
                status: "completed",
                message:
                  "✅ All views (materialized + regular) created successfully!",
                progress: 100,
              })}\n\n`
            );
          } else {
            res.write(
              `data: ${JSON.stringify({
                status: "error",
                message: `❌ Views setup failed with code ${code}`,
                progress: 100,
              })}\n\n`
            );
          }
          res.end();
        });

        child.on("error", (error) => {
          res.write(
            `data: ${JSON.stringify({
              status: "error",
              message: `❌ Failed to start materialized views script: ${error.message}`,
            })}\n\n`
          );
          res.end();
        });
      } catch (mvError) {
        res.write(
          `data: ${JSON.stringify({
            status: "error",
            message: `❌ Materialized views setup failed: ${mvError.message}`,
          })}\n\n`
        );
        res.end();
      }
    } catch (error) {
      console.error("❌ Materialized views endpoint failed:", error);
      res.status(500).json({
        error: "Materialized views setup failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      });
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
