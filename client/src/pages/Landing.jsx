import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero">
        <div className="container">
          <h1>
            Streamline Your <span>Team's Workflow</span>
          </h1>
          <p>
            TaskFlow helps teams organize projects, assign tasks, and track progress
            all in one place. Built for modern teams who want to get things
            done.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Everything You Need to Succeed</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Project Management</h3>
              <p>
                Create and manage multiple projects with ease. Keep all your
                team's work organized in one place.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Task Tracking</h3>
              <p>
                Track tasks from start to finish. Set priorities, due dates,
                and assign tasks to team members.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Team Collaboration</h3>
              <p>
                Invite team members, assign roles, and collaborate on
                projects in real-time.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Dashboard</h3>
              <p>
                Get insights into your team's performance with rich dashboards
                and overdue task notifications.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Role-Based Access</h3>
              <p>
                Control who can view, edit, or delete content with flexible
                role-based permissions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Modern</h3>
              <p>
                Built with modern technology for a fast, responsive
                experience across all devices.
              </p>
            </div>
          </div>
</div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;
