import cron from "node-cron";
import fs from "fs";
import { format } from "date-fns";
import path from "path";

export function notificationGeneration() {
  const logsDir = path.join(process.cwd(), "logs");
  const notificationLogPath = path.join(logsDir, "notification.log");

  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  cron.schedule("*/10 * * * *", () => {
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm-ss");
    const logContent = `\nNotification sent at ${timestamp}\n------------------------\n`;

    fs.appendFile(notificationLogPath, logContent, (err) => {
      if (err) {
        console.error("Error writing to notification log:", err);
        return;
      }
      console.log("Notification log updated at:", timestamp);
    });
  });
}
