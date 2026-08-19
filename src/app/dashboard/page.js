'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import { categories as categoriesData } from '@/data/categories';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [categoryEnabled, setCategoryEnabled] = useState(
    categoriesData.slice(0, 12).reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team' },
    { id: 'categories', label: 'Categories' },
    { id: 'billing', label: 'Billing' }
  ];

  const renderOverview = () => (
    <>
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>23/30</div>
          <div className={styles.kpiLabel}>Active Readers</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>87%</div>
          <div className={styles.kpiLabel}>Completion Rate</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>4.2★</div>
          <div className={styles.kpiLabel}>Avg Rating</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>15 days</div>
          <div className={styles.kpiLabel}>Top Streak</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Member</th>
                <th className={styles.tableHeader}>Topic</th>
                <th className={styles.tableHeader}>Date</th>
                <th className={styles.tableHeader}>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tableCell}>Alice L.</td>
                <td className={styles.tableCell}>Deep Work</td>
                <td className={styles.tableCell}>Today</td>
                <td className={styles.tableCell}>5★</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Bob M.</td>
                <td className={styles.tableCell}>Stoicism</td>
                <td className={styles.tableCell}>Today</td>
                <td className={styles.tableCell}>4★</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Charlie D.</td>
                <td className={styles.tableCell}>Habit Building</td>
                <td className={styles.tableCell}>Yesterday</td>
                <td className={styles.tableCell}>4★</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Dana P.</td>
                <td className={styles.tableCell}>Sleep Science</td>
                <td className={styles.tableCell}>Yesterday</td>
                <td className={styles.tableCell}>5★</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Eve R.</td>
                <td className={styles.tableCell}>Focus</td>
                <td className={styles.tableCell}>2 days ago</td>
                <td className={styles.tableCell}>3★</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '32px' }}>
          <h3 className={styles.sectionTitle}>Popular Categories</h3>
          <div className={styles.barChart}>
            <div className={styles.barRow}>
              <div className={styles.barLabel}>Productivity</div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className={styles.barRow}>
              <div className={styles.barLabel}>Philosophy</div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className={styles.barRow}>
              <div className={styles.barLabel}>Health</div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className={styles.barRow}>
              <div className={styles.barLabel}>Technology</div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className={styles.barRow}>
              <div className={styles.barLabel}>History</div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderTeam = () => (
    <>
      <h3 className={styles.sectionTitle}>Team Members</h3>
      <div className={styles.inviteForm}>
        <input type="email" className="input" placeholder="name@company.com" />
        <button className="btn btn-primary">Invite member</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Email</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Last Read</th>
            <th className={styles.tableHeader}>Streak</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tableCell}>Alice Lee</td>
            <td className={styles.tableCell}>alice@company.com</td>
            <td className={styles.tableCell}>Active</td>
            <td className={styles.tableCell}>Today</td>
            <td className={styles.tableCell}>15 days</td>
          </tr>
          <tr>
            <td className={styles.tableCell}>Bob Martin</td>
            <td className={styles.tableCell}>bob@company.com</td>
            <td className={styles.tableCell}>Active</td>
            <td className={styles.tableCell}>Today</td>
            <td className={styles.tableCell}>4 days</td>
          </tr>
          <tr>
            <td className={styles.tableCell}>Charlie Davis</td>
            <td className={styles.tableCell}>charlie@company.com</td>
            <td className={styles.tableCell}>Active</td>
            <td className={styles.tableCell}>Yesterday</td>
            <td className={styles.tableCell}>1 day</td>
          </tr>
          <tr>
            <td className={styles.tableCell}>Dana Park</td>
            <td className={styles.tableCell}>dana@company.com</td>
            <td className={styles.tableCell}>Invited</td>
            <td className={styles.tableCell}>-</td>
            <td className={styles.tableCell}>-</td>
          </tr>
          <tr>
            <td className={styles.tableCell}>Eve Ross</td>
            <td className={styles.tableCell}>eve@company.com</td>
            <td className={styles.tableCell}>Active</td>
            <td className={styles.tableCell}>2 days ago</td>
            <td className={styles.tableCell}>0 days</td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderCategories = () => {
    return (
      <>
        <h3 className={styles.sectionTitle}>These categories are available to your team</h3>
        <div className={styles.categoryGrid}>
          {categoriesData.slice(0, 12).map((cat) => (
            <div key={cat.name} className={styles.categoryCard}>
              <div className={styles.categoryInfo}>
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </div>
              <button 
                className={`${styles.toggle} ${categoryEnabled[cat.name] ? styles.toggleActive : ''}`}
                onClick={() => setCategoryEnabled(prev => ({ ...prev, [cat.name]: !prev[cat.name] }))}
                aria-label={`Toggle ${cat.name}`}
              >
                <div className={`${styles.toggleDot} ${categoryEnabled[cat.name] ? styles.toggleDotActive : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderBilling = () => (
    <>
      <h3 className={styles.sectionTitle}>Current Plan</h3>
      <div className={styles.billingCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '4px' }}>Growth Plan</h4>
            <p className="t-body">$4/seat × 30 seats = $120/month</p>
          </div>
          <button className="btn">Change plan</button>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--white-50)', fontSize: '0.875rem', marginBottom: '4px' }}>Payment Method</p>
            <p style={{ color: 'white' }}>•••• 4242</p>
          </div>
          <a href="#" style={{ color: 'var(--amber)', fontSize: '0.875rem', textDecoration: 'none' }}>Update</a>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Billing History</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Date</th>
            <th className={styles.tableHeader}>Amount</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tableCell}>Oct 1, 2026</td>
            <td className={styles.tableCell}>$120.00</td>
            <td className={styles.tableCell}>Paid</td>
            <td className={styles.tableCell} style={{ textAlign: 'right' }}>
              <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Download</a>
            </td>
          </tr>
          <tr>
            <td className={styles.tableCell}>Sep 1, 2026</td>
            <td className={styles.tableCell}>$120.00</td>
            <td className={styles.tableCell}>Paid</td>
            <td className={styles.tableCell} style={{ textAlign: 'right' }}>
              <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Download</a>
            </td>
          </tr>
          <tr>
            <td className={styles.tableCell}>Aug 1, 2026</td>
            <td className={styles.tableCell}>$120.00</td>
            <td className={styles.tableCell}>Paid</td>
            <td className={styles.tableCell} style={{ textAlign: 'right' }}>
              <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Download</a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );

  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Logo size={40} />
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.sidebarLink} ${activeTab === tab.id ? styles.sidebarLinkActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Mobile Tabs */}
        <div className={styles.mobileTabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.mobileTab} ${activeTab === tab.id ? styles.mobileTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '24px' }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'billing' && renderBilling()}
        </div>
      </main>
    </div>
  );
}
