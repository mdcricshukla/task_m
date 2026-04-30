const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStats,
  getOverdueTasks,
  getMyTasks,
  getRecentActivity
} = require('../controllers/dashboardController');

// Routes
router.get('/stats', protect, getStats);
router.get('/overdue', protect, getOverdueTasks);
router.get('/my-tasks', protect, getMyTasks);
router.get('/recent', protect, getRecentActivity);

module.exports = router;
