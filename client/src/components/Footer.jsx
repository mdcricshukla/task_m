import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Task<span>Flow</span></h3>
            <p>
              Streamline your team's workflow with modern project and task management.
              Built for modern teams who want to get things done.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>
              <span className="contact-icon">📧</span> 
              support@taskflow.com
            </p>
            <p>
              <span className="contact-icon">📍</span> 
              Mumbai, Maharashtra, India
            </p>
            <p>
              <span className="contact-icon">📱</span> 
              +91 98765 43210
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
