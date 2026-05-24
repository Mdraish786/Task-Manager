import React, { useState } from 'react';
import './TaskCard.css';

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const [statusLoading, setStatusLoading] = useState(false);

  const handleStatusChange = async (e) => {
    setStatusLoading(true);
    try {
      await onUpdate(task.id, { status: e.target.value });
    } finally {
      setStatusLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = date < now && task.status !== 'done';
    return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue };
  };

  const dueDate = formatDate(task.dueDate);
  const statusClass = task.status === 'in-progress' ? 'inprogress' : task.status;

  return (
    <div className={`task-card fade-in ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`badge badge-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
          {task.category && task.category !== 'general' && (
            <span className="badge badge-category">{task.category}</span>
          )}
        </div>
        <div className="task-actions">
          <button className="task-action-btn" onClick={() => onEdit(task)} title="Edit">
            ✎
          </button>
          <button className="task-action-btn task-action-delete" onClick={() => onDelete(task.id)} title="Delete">
            ✕
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-card-footer">
        <select
          className={`status-select status-${statusClass}`}
          value={task.status}
          onChange={handleStatusChange}
          disabled={statusLoading}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {dueDate && (
          <span className={`due-date ${dueDate.isOverdue ? 'overdue' : ''}`}>
            {dueDate.isOverdue ? '⚠ ' : '◷ '}{dueDate.text}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
