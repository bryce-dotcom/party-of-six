import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const CrewSwitcher = () => {
  const { crewsData, activeCrew, setActiveCrew, setShowCrewSwitcher } = useApp();

  return (
    <div style={shared.modalOverlay} onClick={() => setShowCrewSwitcher(false)}>
      <div style={shared.modal} onClick={e => e.stopPropagation()}>
        <h2 style={shared.modalTitle}>Switch Crew</h2>
        <div style={styles.crewList}>
          {Object.values(crewsData).map(crew => (
            <button
              key={crew.id}
              style={{
                ...styles.crewOption,
                ...(activeCrew === crew.id ? styles.crewOptionActive : {}),
                borderColor: crew.color,
              }}
              onClick={() => {
                setActiveCrew(crew.id);
                setShowCrewSwitcher(false);
              }}
            >
              <span style={styles.crewOptionIcon}>{crew.icon}</span>
              <div style={styles.crewOptionInfo}>
                <span style={styles.crewOptionName}>{crew.name}</span>
                <span style={styles.crewOptionTagline}>{crew.tagline}</span>
                <span style={styles.crewOptionStats}>
                  {crew.stats.totalTrips} trips • {crew.members.length} members
                </span>
              </div>
              <span style={styles.crewOptionEstablished}>{crew.established}</span>
            </button>
          ))}
        </div>
        <button style={styles.addCrewButton}>
          <span>+</span> Create New Crew
        </button>
        <button style={shared.closeButton} onClick={() => setShowCrewSwitcher(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  crewList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  crewOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '2px solid transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  crewOptionActive: { background: 'rgba(201,169,98,0.1)' },
  crewOptionIcon: { fontSize: '32px' },
  crewOptionInfo: { flex: 1 },
  crewOptionName: { display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '2px' },
  crewOptionTagline: { display: 'block', fontSize: '11px', color: '#8B949E', marginBottom: '4px' },
  crewOptionStats: { display: 'block', fontSize: '10px', color: '#6E7681' },
  crewOptionEstablished: { fontSize: '10px', color: '#C9A962', alignSelf: 'flex-start' },
  addCrewButton: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '1px dashed rgba(201,169,98,0.3)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default CrewSwitcher;
