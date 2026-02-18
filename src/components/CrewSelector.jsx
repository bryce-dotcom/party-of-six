import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const CrewSelector = () => {
  const { currentCrew, setShowCrewSwitcher } = useApp();

  return (
    <button
      style={styles.crewSelector}
      onClick={() => setShowCrewSwitcher(true)}
    >
      <span style={styles.crewSelectorIcon}>{currentCrew.icon}</span>
      <span style={styles.crewSelectorName}>{currentCrew.name}</span>
      <span style={styles.crewSelectorDot}>•</span>
      <span style={styles.crewSelectorEst}>{currentCrew.established}</span>
      <span style={styles.crewSelectorArrow}>▾</span>
    </button>
  );
};

const styles = {
  crewSelector: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(201,169,98,0.08)',
    border: '1px solid rgba(201,169,98,0.2)',
    borderRadius: '20px',
    color: '#C9A962',
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  crewSelectorIcon: { fontSize: '14px' },
  crewSelectorName: { fontWeight: '500', letterSpacing: '0.5px' },
  crewSelectorDot: { color: '#6E7681', fontSize: '8px' },
  crewSelectorEst: { color: '#6E7681', fontSize: '10px', fontWeight: '400' },
  crewSelectorArrow: { color: '#6E7681', fontSize: '10px', marginLeft: '4px' },
};

export default CrewSelector;
