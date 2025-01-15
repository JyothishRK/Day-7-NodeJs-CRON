import cron from "node-cron";
import fs from "fs";
import { format } from "date-fns";
import path from "path";

export function logGeneration() {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  cron.schedule("* * * * *", () => {
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm-ss");
    const randomMetrics = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 1000),
      requests: Math.floor(Math.random() * 500),
      users: Math.floor(Math.random() * 50)
    };

    const logContent = `
[${timestamp}]
CPU Usage: ${randomMetrics.cpu}%
Memory Usage: ${randomMetrics.memory}MB
Active Requests: ${randomMetrics.requests}
Connected Users: ${randomMetrics.users}
------------------------
`;

    // Create a new file for each log entry
    const fileName = `log_${timestamp}.txt`;
    const filePath = path.join(logsDir, fileName);

    fs.writeFile(filePath, logContent, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
        return;
      }
      console.log("New log file created:", fileName);
    });
  });
}

export function deleteOldLogs() {
  const logsDir = path.join(process.cwd(), "logs");
  
  // Run every 10 minutes
  cron.schedule("10 * * * *", () => {
    fs.readdir(logsDir, (err, files) => {
      if (err) {
        console.error("Error reading logs directory:", err);
        return;
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error getting stats for file ${file}:`, err);
            return;
          }

          if (stats.mtime < oneHourAgo) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${file}:`, err);
                return;
              }
              console.log(`Deleted old log file: ${file}`);
            });
          }
        });
      });
    });
  });
}
