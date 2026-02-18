import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const tabs = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'plan', icon: '🗺️', label: 'Plan' },
  { id: 'live', icon: '📍', label: 'Live' },
  { id: 'memories', icon: '📸', label: 'Memories' },
  { id: 'crew', icon: '👥', label: 'Crew' },
  { id: 'awards', icon: '🏆', label: 'Awards' },
  { id: 'games', icon: '🎮', label: 'Games' },
];

const TabBar = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div style={styles.tabBar}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab.id ? styles.tabButtonActive : {}),
          }}
        >
          <span style={styles.tabIcon}>{tab.icon}</span>
          <span style={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const styles = {
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 8px 28px',
    background: 'linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.95) 20%, #0D0D0D 100%)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    color: '#6E7681',
    cursor: 'pointer',
    borderRadius: '12px',
  },
  tabButtonActive: { color: '#C9A962', background: 'rgba(201,169,98,0.1)' },
  tabIcon: { fontSize: '22px' },
  tabLabel: { fontSize: '10px', fontWeight: '500', letterSpacing: '0.5px' },
};

export default TabBar;
