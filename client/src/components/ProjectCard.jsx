import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const memberCount = project.members?.length || 0;
  const taskCount = project.tasks?.length || 0;

  return (
    <Link to={`/projects/${project._id}`} className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="project-meta">
        <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
        <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
      </div>
    </Link>
  );
};

export default ProjectCard;
