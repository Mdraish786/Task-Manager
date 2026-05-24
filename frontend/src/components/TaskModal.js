import React, { useState, useEffect } from 'react';
import './TaskModal.css';

const CATEGORIES = ['general', 'work', 'personal', 'health', 'learning', 'finance'];

const TaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    dueDate: '',
    status: 'todo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'general',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'todo'
      });
    }
  }, [task]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    setError('');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box fade-in">
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit task' : 'New task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label className="input-label">Title *</label>
            <input
              type="text"
              name="title"
              className="input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              className="input textarea"
              placeholder="Add details (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label className="input-label">Priority</label>
              <select name="priority" className="input" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Category</label>
              <select name="category" className="input" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label className="input-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="input"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            {task && (
              <div className="form-group">
                <label className="input-label">Status</label>
                <select name="status" className="input" value={form.status} onChange={handleChange}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Saving…' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
