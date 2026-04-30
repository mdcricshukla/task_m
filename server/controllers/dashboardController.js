const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let projectQuery = {};
    
    // If not admin, only show projects user is member of
    if (!isAdmin) {
      projectQuery = {
        $or: [
          { owner: userId },
          { members: userId }
        ]
      };
    }

    // Get all projects user has access to
    const projects = await Project.find(projectQuery).select('_id');
    const projectIds = projects.map(p => p._id);

    // Get task counts by status
    const statusCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get task counts by priority
    const priorityCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Get tasks assigned to current user
    const myTaskCount = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: 'completed' }
    });

    // Get total project count
    const projectCount = projects.length;

    // Format status counts
    const stats = {
      totalProjects: projectCount,
      totalTasks: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      completed: 0,
      low: 0,
      medium: 0,
      high: 0,
      myTasks: myTaskCount
    };

    statusCounts.forEach(item => {
      stats.totalTasks += item.count;
      switch (item._id) {
        case 'todo':
          stats.todo = item.count;
          break;
        case 'in_progress':
          stats.inProgress = item.count;
          break;
        case 'review':
          stats.review = item.count;
          break;
        case 'completed':
          stats.completed = item.count;
          break;
      }
    });

    priorityCounts.forEach(item => {
      switch (item._id) {
        case 'low':
          stats.low = item.count;
          break;
        case 'medium':
          stats.medium = item.count;
          break;
        case 'high':
          stats.high = item.count;
          break;
      }
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue tasks
// @route   GET /api/dashboard/overdue
// @access  Private
exports.getOverdueTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let projectQuery = {};

    // If not admin, only show projects user is member of
    if (!isAdmin) {
      projectQuery = {
        $or: [
          { owner: userId },
          { members: userId }
        ]
      };
    }

    const projects = await Project.find(projectQuery).select('_id');
    const projectIds = projects.map(p => p._id);

    const now = new Date();

    // Get overdue tasks (not completed and past due date)
    const overdueTasks = await Task.find({
      project: { $in: projectIds },
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    })
      .populate('project', 'name')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: overdueTasks.length,
      data: overdueTasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my tasks
// @route   GET /api/dashboard/my-tasks
// @access  Private
exports.getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({
      assignedTo: userId,
      status: { $ne: 'completed' }
    })
      .populate('project', 'name')
      .populate('createdBy', 'username email')
      .sort({ dueDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/recent
// @access  Private
exports.getRecentActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let projectQuery = {};

    if (!isAdmin) {
      projectQuery = {
        $or: [
          { owner: userId },
          { members: userId }
        ]
      };
    }

    const projects = await Project.find(projectQuery).select('_id');
    const projectIds = projects.map(p => p._id);

    // Get recently updated tasks
    const recentTasks = await Task.find({
      project: { $in: projectIds }
    })
      .populate('project', 'name')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ updatedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: recentTasks.length,
      data: recentTasks
    });
  } catch (error) {
    next(error);
  }
};
