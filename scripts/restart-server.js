const { spawn } = require("child_process");
const path = require("path");

// Configuration
const BACKEND_DIR = path.join(__dirname, "..", "backend");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

console.log("🔄 Restarting EAFYA Data Tool services...");

// Function to restart backend
function restartBackend() {
  console.log("🚀 Starting backend server...");

  const backendProcess = spawn("npm", ["start"], {
    cwd: BACKEND_DIR,
    stdio: "inherit",
    shell: true,
  });

  backendProcess.on("error", (error) => {
    console.error("❌ Backend startup error:", error);
  });

  backendProcess.on("exit", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  return backendProcess;
}

// Function to restart frontend (if needed)
function restartFrontend() {
  console.log("🌐 Frontend is already built and deployed");
  console.log(
    "💡 If you need to restart the frontend dev server, run: cd frontend && npm start"
  );
}

// Main restart function
function main() {
  try {
    // Restart backend
    const backendProcess = restartBackend();

    // Restart frontend (just log for now)
    restartFrontend();

    console.log("✅ Services restart initiated");
    console.log("📊 Backend should be available at: http://localhost:5000");
    console.log("🌐 Frontend should be available at: http://localhost:3000");

    // Keep the process running
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down services...");
      backendProcess.kill("SIGINT");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error restarting services:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { restartBackend, restartFrontend };
