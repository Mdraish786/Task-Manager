import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './Dashboard.css';

const FILTERS = ['all', 'todo', 'in-progress', 'done'];
const SORTS = ['newest', 'oldest', 'priority', 'due-date'];
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleSave = async (formData) => {
    if (editingTask) {
      await updateTask(editingTask.id, formData);
    } else {
      await createTask(formData);
    }
  };

  const handleEdit = (task) => { setEditingTask(task); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id);
    }
  };

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const filtered = useMemo(() => {
    let result = [...tasks];
    if (filter !== 'all') result = result.filter(t => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'priority') return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (sort === 'due-date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return result;
  }, [tasks, filter, search, sort]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">✦</span>
          <span className="sidebar-logo-text">TaskFlow</span>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>

        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: 'var(--orange)' }}>{stats.inProgress}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: 'var(--green)' }}>{stats.done}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {stats.total > 0 && (
          <div className="progress-section">
            <div className="progress-label">
              <span>Completion</span>
              <span>{Math.round((stats.done / stats.total) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(stats.done / stats.total) * 100}%` }} />
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`nav-item ${filter === f ? 'nav-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              <span className="nav-icon">
                {f === 'all' ? '◈' : f === 'todo' ? '○' : f === 'in-progress' ? '◑' : '●'}
              </span>
              <span>{f === 'all' ? 'All Tasks' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}</span>
              <span className="nav-count">
                {f === 'all' ? stats.total : f === 'todo' ? stats.todo : f === 'in-progress' ? stats.inProgress : stats.done}
              </span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          ↩ Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <h1 className="main-title">
              {filter === 'all' ? 'All Tasks' : filter === 'todo' ? 'To Do' : filter === 'in-progress' ? 'In Progress' : 'Done'}
            </h1>
            <p className="main-subtitle">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            + New Task
          </button>
        </header>

        <div className="toolbar">
          <input
            type="text"
            className="input search-input"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">By priority</option>
            <option value="due-date">By due date</option>
          </select>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading tasks…</span>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <h3>{search ? 'No tasks match your search' : 'No tasks yet'}</h3>
            <p>{search ? 'Try a different search term' : 'Create your first task to get started'}</p>
            {!search && (
              <button className="btn btn-primary" onClick={openCreate}>+ Create task</button>
            )}
          </div>
        )}

        <div className="task-grid">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(id, updates) => updateTask(id, updates)}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
