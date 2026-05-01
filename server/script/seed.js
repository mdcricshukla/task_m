const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

dotenv.config();

const demoUsers = [
  {
    name: 'Demo Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Demo Member One',
    email: 'member1@example.com',
    password: 'member123',
    role: 'member',
  },
  {
    name: 'Demo Member Two',
    email: 'member2@example.com',
    password: 'member123',
    role: 'member',
  },
];

const demoProjects = [
  {
    title: 'Website Redesign',
    description: 'Update the company website pages and dashboard flow.',
  },
  {
    title: 'Mobile App Launch',
    description: 'Prepare launch tasks for the first mobile app release.',
  },
];

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function createOrUpdateUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return User.findOneAndUpdate(
    { email: userData.email },
    {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function createOrUpdateProject(projectData, admin, members) {
  return Project.findOneAndUpdate(
    { title: projectData.title, admin: admin._id },
    {
      title: projectData.title,
      description: projectData.description,
      admin: admin._id,
      members: members.map((member) => member._id),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function createOrUpdateTask(taskData) {
  return Task.findOneAndUpdate(
    {
      title: taskData.title,
      projectId: taskData.projectId,
    },
    taskData,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in server/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const [admin, memberOne, memberTwo] = await Promise.all(
    demoUsers.map(createOrUpdateUser)
  );

  const [websiteProject, mobileProject] = await Promise.all([
    createOrUpdateProject(demoProjects[0], admin, [memberOne, memberTwo]),
    createOrUpdateProject(demoProjects[1], admin, [memberOne]),
  ]);

  await Promise.all([
    createOrUpdateTask({
      title: 'Create dashboard cards',
      description: 'Build the task summary cards for the dashboard page.',
      dueDate: addDays(3),
      priority: 'high',
      status: 'in-progress',
      projectId: websiteProject._id,
      assignedTo: memberOne._id,
    }),
    createOrUpdateTask({
      title: 'Add project member UI',
      description: 'Connect the add member form with the backend project API.',
      dueDate: addDays(5),
      priority: 'medium',
      status: 'todo',
      projectId: websiteProject._id,
      assignedTo: memberTwo._id,
    }),
    createOrUpdateTask({
      title: 'Test login flow',
      description: 'Verify JWT login, signup, and protected routes.',
      dueDate: addDays(-1),
      priority: 'high',
      status: 'todo',
      projectId: mobileProject._id,
      assignedTo: memberOne._id,
    }),
    createOrUpdateTask({
      title: 'Prepare release checklist',
      description: 'Write down launch checks before the mobile app release.',
      dueDate: addDays(7),
      priority: 'low',
      status: 'done',
      projectId: mobileProject._id,
      assignedTo: admin._id,
    }),
  ]);

  console.log('Demo data added successfully.');
  console.log('Admin login: admin@example.com / admin123');
  console.log('Member login: member1@example.com / member123');
}

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error.message);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
