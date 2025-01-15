import cron from "node-cron";
import fs from "fs";
import { format } from "date-fns";
import path from "path";

export function reportGeneration() {
  // Create reports directory if it doesn't exist
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  cron.schedule("0 0 * * *", () => {
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm-ss");
    const randomMetrics = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 1000),
      requests: Math.floor(Math.random() * 500),
      users: Math.floor(Math.random() * 50)
    };

    const logContent = `
Today's Report
CPU Usage: ${randomMetrics.cpu}%
Memory Usage: ${randomMetrics.memory}MB
Active Requests: ${randomMetrics.requests}
Connected Users: ${randomMetrics.users}
------------------------
`;

    // Create a new file for each log entry
    const fileName = `Report_${timestamp}.txt`;
    const filePath = path.join(reportsDir, fileName);

    fs.writeFile(filePath, logContent, (err) => {
      if (err) {
        console.error("Error writing to report file:", err);
        return;
      }
      console.log("Daily report created:", fileName);
    });
  });
}
