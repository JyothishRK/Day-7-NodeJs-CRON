import express from "express";

import tasksRouter from "./routers/tasks.js";
import connectDB from "./db/mongoose.js";

const app = express();

app.use(express.json());
app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, async () => {
  await connectDB();
  console.log("Server is running on port 3000");
});

