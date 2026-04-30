const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Validation rules
const taskValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Task title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('project')
    .notEmpty()
    .withMessage('Project is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

const statusValidation = [
  body('status')
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status')
];

const assignValidation = [
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID')
];

// Routes
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, taskValidation, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.put('/:id/status', protect, statusValidation, updateTaskStatus);
router.put('/:id/assign', protect, assignValidation, assignTask);

module.exports = router;
