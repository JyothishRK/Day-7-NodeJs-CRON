import express from "express";
import Task from "../models/task.js";
import { parse, isValid } from "date-fns";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const taskData = { ...req.body };

    // Parse the date string (assuming format "DD MMMM YYYY")
    const parsedDate = parse(taskData.dueDate, "dd MMMM yyyy", new Date());

    if (!isValid(parsedDate)) {
      return res.status(400).json({
        error: "Invalid Date Format",
        message: "Date should be in format: DD MMMM YYYY (e.g., 24 June 2003)",
      });
    }

    // Convert to ISO string
    taskData.dueDate = parsedDate.toISOString();

    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      return res.status(400).json({
        error: "Validation Error",
        details: errors,
      });
    }
    res.status(500).json({
      error: "Error creating task",
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  const allowedUpdates = ["title", "description", "status", "dueDate"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  
  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    // If dueDate is being updated, validate and parse it
    if (req.body.dueDate) {
      const parsedDate = parse(req.body.dueDate, "dd MMMM yyyy", new Date());
      if (!isValid(parsedDate)) {
        return res.status(400).json({
          error: "Invalid Date Format",
          message: "Date should be in format: DD MMMM YYYY (e.g., 24 June 2003)",
        });
      }
      req.body.dueDate = parsedDate.toISOString();
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      return res.status(400).json({
        error: "Validation Error",
        details: errors,
      });
    }
    res.status(500).json({ 
      error: "Error updating task",
      message: error.message 
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

export default router;
