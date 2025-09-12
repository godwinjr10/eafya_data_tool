import dotenv from "dotenv";

dotenv.config();

const DEFAULTS = {
  REPORT_SCRIPTS_DIR:
    process.platform === "win32"
      ? process.cwd() + "\\..\\eafya_report_scripts"
      : "/home/artson_admin/eafya_report_scripts",
  DATA_TOOL_DIR:
    process.platform === "win32"
      ? process.cwd()
      : "/home/artson_admin/eafya_data_tool",
  DATA_INTEGRATION_DIR:
    process.platform === "win32"
      ? process.cwd() + "\\..\\data-integration"
      : "/home/artson_admin/data-integration",
  FRONTEND_DIR:
    process.platform === "win32"
      ? process.cwd() + "\\frontend"
      : "/home/artson_admin/eafya_data_tool/frontend",
  BACKEND_DIR:
    process.platform === "win32"
      ? process.cwd() + "\\backend"
      : "/home/artson_admin/eafya_data_tool/backend",
  BACKEND_SERVICE_NAME:
    process.platform === "win32" ? "eafya-dwh" : "eafya-dwh.service",
  KITCHEN_JOB_FILE:
    process.platform === "win32"
      ? process.cwd() + "\\..\\eafya_report_scripts\\eafya_dwh\\Main.eAFYA.kjb"
      : "/home/artson_admin/eafya_report_scripts/eafya_dwh/Main.eAFYA.kjb",
};

const resolveEnv = (key) => process.env[key] || DEFAULTS[key];

const upgradeRoutes = (app) => {
  app.post("/api/upgrade", async (req, res) => {
    const isLinux = process.platform !== "win32";
    const dryRun = Boolean(req.body?.dryRun);

    // Allow Windows for development/testing, but warn
    if (!isLinux) {
      console.log(
        "⚠️  Running upgrade on Windows - this is for development/testing only"
      );
    }

    const {
      REPORT_SCRIPTS_DIR,
      DATA_TOOL_DIR,
      DATA_INTEGRATION_DIR,
      FRONTEND_DIR,
      BACKEND_DIR,
      BACKEND_SERVICE_NAME,
      KITCHEN_JOB_FILE,
    } = Object.keys(DEFAULTS).reduce((acc, k) => {
      acc[k] = resolveEnv(k);
      return acc;
    }, {});

    try {
      const { exec } = await import("child_process");
      const { promisify } = await import("util");
      const execAsync = promisify(exec);

      const logs = [];
      const run = async (cmd, options = {}) => {
        logs.push(`$ ${cmd}`);
        if (dryRun) return { stdout: "(dry-run)", stderr: "" };
        const result = await execAsync(cmd, options);
        if (result.stdout) logs.push(result.stdout.trim());
        if (result.stderr) logs.push(result.stderr.trim());
        return result;
      };

      // 1) Go to eafya_report_scripts and pull develop (skip if directory doesn't exist)
      try {
        if (isLinux) {
          await run(
            `cd ${REPORT_SCRIPTS_DIR} && sudo git fetch origin && sudo git checkout develop && sudo git pull origin develop`
          );
        } else {
          await run(
            `cd ${REPORT_SCRIPTS_DIR} && git fetch origin && git checkout develop && git pull origin develop`
          );
        }
      } catch (error) {
        await run(
          `echo "Skipping report scripts update - directory not found or not a git repository"`
        );
      }

      // 2) Go to eafya_data_tool and pull master
      if (isLinux) {
        await run(
          `cd ${DATA_TOOL_DIR} && sudo git fetch origin && sudo git checkout master && sudo git pull origin master`
        );
      } else {
        await run(
          `cd ${DATA_TOOL_DIR} && git fetch origin && git checkout master && git pull origin master`
        );
      }

      // 3) Run backend setup scripts (in backend/scripts)
      try {
        await run(`cd ${BACKEND_DIR}/scripts && node addtables.js`);
        await run(`cd ${BACKEND_DIR}/scripts && node uploads.js`);
        await run(`cd ${BACKEND_DIR}/scripts && node setupData.js`);
      } catch (error) {
        await run(`echo "Some setup scripts failed - continuing with upgrade"`);
      }

      // 4) Run the Pentaho job (skip on Windows if not available)
      if (isLinux) {
        await run(
          `cd ${DATA_INTEGRATION_DIR} && ./kitchen.sh -file=${KITCHEN_JOB_FILE}`
        );
      } else {
        await run(
          `echo "Skipping Pentaho ETL on Windows development environment"`
        );
      }

      // 5) Frontend deploy
      if (isLinux) {
        await run(`cd ${FRONTEND_DIR} && sudo yarn deploy`);
      } else {
        await run(`cd ${FRONTEND_DIR} && yarn build`);
      }

      // 6) Restart backend service
      if (isLinux) {
        await run(`sudo systemctl stop ${BACKEND_SERVICE_NAME}`);
        await run(`sudo systemctl start ${BACKEND_SERVICE_NAME}`);
      } else {
        await run(
          `echo "Skipping service restart on Windows - manual restart required"`
        );
      }

      // 7) Ensure cron/log dir (Linux only)
      if (isLinux) {
        await run(
          `sudo mkdir -p /var/log/eafya && sudo chown root:root /var/log/eafya`
        );
      }

      // 8) Post-refresh materialization and IDs
      try {
        await run(`cd ${BACKEND_DIR}/scripts && node materialized.js`);
        await run(`cd ${BACKEND_DIR}/scripts && node addIds.js`);
      } catch (error) {
        await run(
          `echo "Some post-refresh scripts failed - continuing with upgrade"`
        );
      }

      res.json({
        message: "Upgrade sequence completed",
        dryRun,
        logs,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: "Upgrade failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });
};

export default upgradeRoutes;
