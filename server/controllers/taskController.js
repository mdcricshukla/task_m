const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { project, status, assignedTo } = req.query;
    const query = {};

    // Filter by project if provided
    if (project) {
      // Verify user has access to project
      const proj = await Project.findById(project);
      if (!proj) {
        return res.status(404).json({ message: 'Project not found' });
      }
      query.project = project;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by assigned user
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // If regular member, only show tasks from projects they're in
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({
        $or: [
          { owner: req.user.id },
          { members: req.user.id }
        ]
      }).select('_id');

      const projectIds = userProjects.map(p => p._id);
      query.project = { $in: projectIds };
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name owner members')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const isMember = project.members.some(m => m.toString() === req.user.id);
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

    // Verify user has access to project
    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = proj.members.some(m => m.toString() === req.user.id);
    const isOwner = proj.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdBy: req.user.id
    });

    await task.populate('project', 'name');
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access
    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.toString() === req.user.id);
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isCreator = task.createdBy.toString() === req.user.id;

    // Allow update if admin, owner, member, or creator
    if (!isOwner && !isMember && !isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status, priority, dueDate },
      { new: true, runValidators: true }
    )
      .populate('project', 'name')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access (admin, project owner, or task creator)
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isOwner && !isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['todo', 'in_progress', 'review', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access
    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.toString() === req.user.id);
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isOwner && !isMember && !isAdmin && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    await task.populate('project', 'name');
    await task.populate('assignedTo', 'username email');

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign task to user
// @route   PUT /api/tasks/:id/assign
// @access  Private (Admin/Project Owner)
exports.assignTask = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is project owner or admin
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to assign tasks' });
    }

    // Verify user exists if provided
    if (userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      task.assignedTo = userId;
    } else {
      task.assignedTo = null;
    }

    await task.save();

    await task.populate('project', 'name');
    await task.populate('assignedTo', 'username email');

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
