import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero">
          <h1>About TaskFlow</h1>
          <p className="subtitle">Streamline your team's workflow with powerful task management</p>
        </section>

        <section className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              TaskFlow is designed to help teams collaborate more efficiently. We believe that 
              great task management should be simple, intuitive, and accessible to everyone. Our 
              platform enables project managers, team leads, and organizations to track progress, 
              assign tasks, and achieve their goals with ease.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Do</h2>
            <p>
              We provide a comprehensive task management solution that combines powerful features with 
              a clean, user-friendly interface. From creating projects and assigning tasks to tracking 
              progress and managing team members, TaskFlow has everything you need to keep your team organized 
              and productive.
            </p>
          </div>

          <div className="about-section">
            <h2>Key Features</h2>
            <ul className="features-list">
              <li>📊 Real-time dashboard with task statistics</li>
              <li>👥 Role-based access control (Admin & Member roles)</li>
              <li>📁 Project organization and management</li>
              <li>✅ Task status tracking (To Do, In Progress, Review, Completed)</li>
              <li>⚡ Priority levels (Low, Medium, High)</li>
              <li>📅 Due date tracking and overdue alerts</li>
              <li>🔒 Secure JWT authentication</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Technology Stack</h2>
            <p>
              Built with modern web technologies for optimal performance and reliability:
            </p>
            <ul className="features-list">
              <li>⚛️ React.js with Vite</li>
              <li>🟢 Node.js & Express</li>
              <li>🍃 MongoDB with Mongoose</li>
              <li>🔐 JWT Authentication</li>
              <li>🎨 Custom CSS with modern design</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Contact Us</h2>
            <p>
             Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="contact-info">
              <p>📧 <a href="mailto:support@taskflow.com">support@taskflow.com</a></p>
              <p>📍 Mumbai, Maharashtra, India</p>
              <p>📱 +91 98765 43210</p>
            </div>
          </div>

          <div className="about-cta">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of teams already using TaskFlow</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Create Free Account</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
