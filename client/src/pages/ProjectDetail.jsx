import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import Footer from '../components/Footer';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectsAPI.getById(id),
        tasksAPI.getAll({ project: id }),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const taskData = {
        ...formData,
        project: id,
        dueDate: formData.dueDate || undefined,
        assignedTo: formData.assignedTo || undefined,
      };
      await tasksAPI.create(taskData);
      setShowTaskModal(false);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
      });
      fetchProjectDetail();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectsAPI.delete(id);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="empty-state">
            <h3>Project not found</h3>
            <Link to="/projects" className="btn btn-primary mt-2">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="container">
        <div className="project-header">
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="project-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowTaskModal(true)}
            >
              Add Task
            </button>
            {isAdmin() && (
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Project
              </button>
            )}
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks</h2>
          </div>

          {tasks.length > 0 ? (
            <div className="tasks-list">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No tasks yet</h3>
              <p>Create your first task for this project.</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => setShowTaskModal(true)}
              >
                Add Task
              </button>
            </div>
          )}
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Task</h2>
              <form onSubmit={handleTaskSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Task Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Project Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Delete Project</h2>
              <p>Are you sure you want to delete "{project.name}"?</p>
              <p className="text-secondary">
                This action cannot be undone. All tasks in this project will also
                be deleted.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteProject}>
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
