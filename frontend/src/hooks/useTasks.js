import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE } from '../context/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const res = await axios.post(`${API_BASE}/tasks`, taskData);
    setTasks(prev => [res.data, ...prev]);
    return res.data;
  };

  const updateTask = async (id, updates) => {
    const res = await axios.put(`${API_BASE}/tasks/${id}`, updates);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    return res.data;
  };

  const updateStatus = async (id, status) => {
    const res = await axios.patch(`${API_BASE}/tasks/${id}/status`, { status });
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    return res.data;
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_BASE}/tasks/${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, updateStatus, deleteTask };
};
