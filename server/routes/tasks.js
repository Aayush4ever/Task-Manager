// AI-generated, reviewed and modified
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks - return all tasks (with optional filter by status)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status === 'active') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('GET /tasks error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: Failed to retrieve tasks',
    });
  }
});

// GET /api/tasks/:id - return a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error: Failed to retrieve task',
    });
  }
});

// POST /api/tasks - create a new task
router.post('/', async (req, res) => {
  try {
    const { title, priority } = req.body;

    // Input validation: title is required and must not be empty/whitespace
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: Task title is required and cannot be empty',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      priority: priority || 'medium',
      completed: false,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${messages.join(', ')}`,
      });
    }
    console.error('POST /tasks error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: Failed to create task',
    });
  }
});

// PATCH /api/tasks/:id - update a task (toggle complete, edit title/priority)
router.patch('/:id', async (req, res) => {
  try {
    const { title, priority, completed } = req.body;
    const updateData = {};

    // Only include fields that were actually sent in the request
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error: Title cannot be empty',
        });
      }
      updateData.title = title.trim();
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error: Priority must be low, medium, or high',
        });
      }
      updateData.priority = priority;
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${messages.join(', ')}`,
      });
    }
    console.error('PATCH /tasks/:id error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: Failed to update task',
    });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format',
      });
    }
    console.error('DELETE /tasks/:id error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: Failed to delete task',
    });
  }
});

module.exports = router;
