import cron from "node-cron";
import fs from "fs";
import { format } from "date-fns";
import path from "path";

export function notificationGeneration() {
  const notificationsDir = path.join(process.cwd(), "logs", "notifications");
  if (!fs.existsSync(notificationsDir)) {
    fs.mkdirSync(notificationsDir, { recursive: true });
  }

  cron.schedule("*/10 * * * *", () => {
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm-ss");
    const logContent = `
Notification sent at ${timestamp}
------------------------
`;

    // Create a new file for each log entry
    const fileName = `notification_${timestamp}.txt`;
    const filePath = path.join(notificationsDir, fileName);

    fs.writeFile(filePath, logContent, (err) => {
      if (err) {
        console.error("Error writing to notification file:", err);
        return;
      }
      console.log("New notification file created:", fileName);
    });
  });
}
