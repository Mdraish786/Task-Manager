const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// GET all tasks for user
router.get('/', (req, res) => {
  const userTasks = db.tasks.filter(t => t.userId === req.user.id);
  res.json(userTasks);
});

// GET single task
router.get('/:id', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id && t.userId === req.user.id);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json(task);
});

// POST create task
router.post('/', (req, res) => {
  const { title, description, priority, dueDate, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  const newTask = {
    id: uuidv4(),
    userId: req.user.id,
    title,
    description: description || '',
    priority: priority || 'medium', // low | medium | high
    status: 'todo', // todo | in-progress | done
    category: category || 'general',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task
router.put('/:id', (req, res) => {
  const taskIndex = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (taskIndex === -1) return res.status(404).json({ message: 'Task not found.' });

  const allowedFields = ['title', 'description', 'priority', 'status', 'category', 'dueDate'];
  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  db.tasks[taskIndex] = {
    ...db.tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  res.json(db.tasks[taskIndex]);
});

// PATCH update task status only
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be: todo, in-progress, or done.' });
  }

  const taskIndex = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (taskIndex === -1) return res.status(404).json({ message: 'Task not found.' });

  db.tasks[taskIndex].status = status;
  db.tasks[taskIndex].updatedAt = new Date().toISOString();

  res.json(db.tasks[taskIndex]);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const taskIndex = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (taskIndex === -1) return res.status(404).json({ message: 'Task not found.' });

  db.tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully.' });
});

module.exports = router;
