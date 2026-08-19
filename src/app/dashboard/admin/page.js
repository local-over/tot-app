'use client';

import React from 'react';
import Logo from '@/components/Logo';

export default function AdminDashboard() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo size={40} glow />
            <h1 className="t-heading-1">TOT Admin</h1>
          </div>
          <button className="btn btn-ghost">Log out</button>
        </header>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Total MRR (Dodo)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--amber)' }}>$4,210</div>
            <div className="t-caption" style={{ color: '#4CAF50' }}>+12% this month</div>
          </div>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px' }}>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Total Users</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>12,841</div>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>4,210 Paid • 8,631 Students</div>
          </div>
          <div style={{ padding: '24px', background: '#111', borderRadius: '12px' }}>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Topic Delivery</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>100%</div>
            <div className="t-caption" style={{ color: 'var(--white-50)' }}>Appwrite Sync OK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
