'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('tot_admin_key');
    if (savedKey) {
      setApiKey(savedKey);
      verifyAndFetchTopics(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAndFetchTopics = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/topics', {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
        setIsAuthenticated(true);
        localStorage.setItem('tot_admin_key', key);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('tot_admin_key');
        setError('Invalid API Key');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (res.ok) {
        setTopics(topics.filter(t => t.id !== id));
      } else {
        alert('Failed to delete topic');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting topic');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading dashboard...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1>Master Dashboard</h1>
          <p>Please enter the TOT API Key to access the moderator dashboard.</p>
          <input 
            type="password" 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)}
            placeholder="API Key"
            className={styles.input}
          />
          <button onClick={() => verifyAndFetchTopics(apiKey)} className={styles.button}>
            Login
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Master Dashboard</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('tot_admin_key');
            setIsAuthenticated(false);
            setApiKey('');
          }} 
          className={styles.logoutButton}
        >
          Logout
        </button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Vibe</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>No topics found. Waiting for AI agent.</td></tr>
            ) : topics.map(topic => (
              <tr key={topic.id}>
                <td>{topic.title}</td>
                <td><span className={styles.badge}>{topic.categoryId}</span></td>
                <td><span className={styles.badge}>{topic.vibe}</span></td>
                <td>{topic.readTime} min</td>
                <td className={styles.actions}>
                  <button onClick={() => handleDelete(topic.id)} className={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
