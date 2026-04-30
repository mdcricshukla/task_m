import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, overdueRes, tasksRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getOverdue(),
        tasksAPI.getAll({ assignedTo: user?._id }),
      ]);

      setStats(statsRes.data);
      setOverdueTasks(overdueRes.data || []);
      setMyTasks(tasksRes.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  const getStatusCount = (status) => {
    return stats?.byStatus?.[status] || 0;
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome back, {user?.username}!</h1>

        <div className="stats-grid">
          <div className="stat-card todo">
            <h3>To Do</h3>
            <div className="value">{getStatusCount('todo')}</div>
          </div>
          <div className="stat-card in_progress">
            <h3>In Progress</h3>
            <div className="value">{getStatusCount('in_progress')}</div>
          </div>
          <div className="stat-card review">
            <h3>In Review</h3>
            <div className="value">{getStatusCount('review')}</div>
          </div>
          <div className="stat-card completed">
            <h3>Completed</h3>
            <div className="value">{getStatusCount('completed')}</div>
          </div>
        </div>

        <div className="d-flex justify-between align-center mb-2">
          <div className="dashboard-section" style={{ flex: 1, marginRight: 20, marginBottom: 0 }}>
            <h2>My Tasks</h2>
            {myTasks.length > 0 ? (
              <div className="tasks-list">
                {myTasks.slice(0, 5).map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No tasks assigned</h3>
                <p>You don't have any tasks yet.</p>
              </div>
            )}
            {myTasks.length > 5 && (
              <Link to="/projects" className="btn btn-ghost mt-2">
                View all tasks
              </Link>
            )}
          </div>

          <div className="dashboard-section" style={{ flex: 1, marginBottom: 0 }}>
            <h2>Overdue Tasks</h2>
            {overdueTasks.length > 0 ? (
              <div className="tasks-list">
                {overdueTasks.slice(0, 5).map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No overdue tasks</h3>
                <p>Great job! You're on track.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
