import { exec } from "child_process";
import { platform } from "os";

const restartServer = () => {
  console.log("🔄 Restarting server...");

  const isWindows = platform() === "win32";

  // Try different restart methods
  const restartCommands = [
    "pm2 restart all", // PM2 process manager
    "pm2 reload all", // PM2 reload
    "npx nodemon", // Nodemon
    "npm start", // Direct npm start
  ];

  let commandIndex = 0;

  const tryRestart = () => {
    if (commandIndex >= restartCommands.length) {
      console.log("❌ All restart methods failed");
      console.log("💡 Please restart manually with: npm start");
      process.exit(0);
      return;
    }

    const command = restartCommands[commandIndex];
    console.log(`🔄 Trying: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ ${command} failed: ${error.message}`);
        commandIndex++;
        setTimeout(tryRestart, 1000);
      } else {
        console.log(`✅ Server restarted successfully with: ${command}`);
        if (stdout) console.log(stdout);
        process.exit(0);
      }
    });
  };

  tryRestart();
};

export default restartServer;
