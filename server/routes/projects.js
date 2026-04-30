const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getUsers
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');

// Validation rules
const projectValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Project name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const memberValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
];

// Routes
router.get('/users', protect, getUsers);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, projectValidation, createProject);
router.put('/:id', protect, projectValidation, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/members', protect, memberValidation, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;
