import express from "express";

import tasksRouter from "./routers/tasks.js";
import connectDB from "./db/mongoose.js";
import { logGeneration, deleteOldLogs } from "./jobs/logs.js";

const app = express();

app.use(express.json());
app.use("/tasks", tasksRouter);

logGeneration();
deleteOldLogs();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, async () => {
  await connectDB();
  console.log("Server is running on port 3000");
});

