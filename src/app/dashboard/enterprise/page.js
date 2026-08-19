'use client';

import React from 'react';
import Logo from '@/components/Logo';

export default function EnterpriseDashboard() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo size={40} />
            <h1 className="t-heading-1">Enterprise Portal</h1>
          </div>
          <button className="btn btn-ghost">Log out</button>
        </header>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px' }}>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Active Seats</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>142</div>
            <div className="t-caption" style={{ color: 'var(--amber)' }}>/ 150 provisioned</div>
          </div>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px' }}>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Avg Completion Rate</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>89%</div>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>+4% this week</div>
          </div>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px' }}>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Top Category</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Technology</div>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>64 readers</div>
          </div>
        </div>
        
        <h2 className="t-heading-2" style={{ marginBottom: '24px' }}>Team Members</h2>
        <div style={{ background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '16px 24px', color: 'var(--white-50)', fontWeight: 'normal' }}>Name</th>
                <th style={{ padding: '16px 24px', color: 'var(--white-50)', fontWeight: 'normal' }}>Email</th>
                <th style={{ padding: '16px 24px', color: 'var(--white-50)', fontWeight: 'normal' }}>Streak</th>
                <th style={{ padding: '16px 24px', color: 'var(--white-50)', fontWeight: 'normal' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {['Alice Johnson', 'Bob Smith', 'Charlie Davis'].map((name, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '16px 24px' }}>{name}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--white-70)' }}>{name.split(' ')[0].toLowerCase()}@company.com</td>
                  <td style={{ padding: '16px 24px' }}>🔥 {Math.floor(Math.random() * 20) + 1}</td>
                  <td style={{ padding: '16px 24px' }}><button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Revoke</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
