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
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
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

  useEffect(() => {
    const savedKey = localStorage.getItem('tot_admin_key');
    if (savedKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiKey(savedKey);
      verifyAndFetchTopics(savedKey);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      ...selectedTopic,
      bodyText: Array.isArray(selectedTopic.body) ? selectedTopic.body.join('\n\n') : selectedTopic.body
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedBody = editForm.bodyText.split('\n\n').filter(p => p.trim() !== '');
      
      const payload = {
        title: editForm.title,
        categoryId: editForm.categoryId,
        readTime: editForm.readTime,
        vibe: editForm.vibe,
        closingFact: editForm.closingFact,
        body: updatedBody
      };

      const res = await fetch(`/api/topics/${selectedTopic.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        verifyAndFetchTopics(apiKey);
        setSelectedTopic(null);
        setIsEditing(false);
      } else {
        alert('Failed to save topic');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving topic');
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopic(topic);
                    }} 
                    className={styles.editButton}
                    style={{ background: 'transparent', color: '#4caf50', border: '1px solid #4caf50' }}
                  >
                    View
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(topic.id);
                  }} className={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTopic && (
        <div className={styles.modalOverlay} onClick={() => {
          setSelectedTopic(null);
          setIsEditing(false);
        }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{isEditing ? 'Edit Topic' : selectedTopic.title}</h2>
                {!isEditing && (
                  <p style={{ color: '#aaa', marginTop: '0.5rem' }}>
                    <span className={styles.badge} style={{ marginRight: '0.5rem' }}>{selectedTopic.categoryId}</span>
                    <span className={styles.badge} style={{ marginRight: '0.5rem' }}>{selectedTopic.vibe}</span>
                    <span>{selectedTopic.readTime} min read</span>
                  </p>
                )}
              </div>
              <div className={styles.modalActions}>
                {isEditing ? (
                  <button className={styles.saveButton} onClick={handleSaveEdit}>Save Changes</button>
                ) : (
                  <button className={styles.editButton} onClick={handleEditClick}>Edit</button>
                )}
                <button className={styles.closeButton} onClick={() => {
                  setSelectedTopic(null);
                  setIsEditing(false);
                }}>
                  &times;
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>Category ID</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={editForm.categoryId} 
                      onChange={e => setEditForm({...editForm, categoryId: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>Vibe</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={editForm.vibe} 
                      onChange={e => setEditForm({...editForm, vibe: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>Read Time (min)</label>
                    <input 
                      type="number" 
                      className={styles.input} 
                      value={editForm.readTime} 
                      onChange={e => setEditForm({...editForm, readTime: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Body Paragraphs (Separated by double newlines)</label>
                  <textarea 
                    className={styles.textarea} 
                    value={editForm.bodyText} 
                    onChange={e => setEditForm({...editForm, bodyText: e.target.value})}
                    rows={12}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Closing Fact</label>
                  <textarea 
                    className={styles.textarea} 
                    style={{ minHeight: '60px' }}
                    value={editForm.closingFact} 
                    onChange={e => setEditForm({...editForm, closingFact: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.previewBody}>
                {Array.isArray(selectedTopic.body) ? selectedTopic.body.map((p, i) => (
                  <p key={i}>{p}</p>
                )) : <p>{selectedTopic.body}</p>}
                
                {selectedTopic.closingFact && (
                  <div className={styles.previewFact}>
                    <strong>Did you know?</strong> {selectedTopic.closingFact}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
