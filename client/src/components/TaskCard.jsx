const TaskCard = ({ task, onClick }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <div className="task-card" onClick={onClick}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-footer">
        <div className="task-meta">
          <span className={`badge badge-${task.status}`}>
            {task.status.replace('_', ' ')}
          </span>
          <span className={`badge badge-${task.priority}`}>
            {task.priority}
          </span>
        </div>
        {task.dueDate && (
          <span className={isOverdue() ? 'text-error' : ''}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
