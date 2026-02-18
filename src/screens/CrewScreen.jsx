import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const CrewScreen = () => {
  const { currentCrew } = useApp();

  return (
    <div style={shared.screen}>
      <div style={styles.crewHeader}>
        <h1 style={styles.crewTitle}>{currentCrew.name}</h1>
        <button style={styles.inviteButton}>+ Invite</button>
      </div>

      {currentCrew.homeBase && (
        <div style={{padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <span style={{fontSize: '12px'}}>📍</span>
          <span style={{fontSize: '12px', color: '#8B949E'}}>Home base:</span>
          <span style={{fontSize: '12px', color: '#C9A962', fontWeight: '600'}}>{currentCrew.homeBase}</span>
        </div>
      )}

      <div style={styles.crewGrid}>
        {currentCrew.members.map(member => (
          <div key={member.id} style={styles.memberCard}>
            <div style={styles.memberAvatar}>{member.avatar}</div>
            <h3 style={styles.memberName}>{member.name}</h3>
            <p style={styles.memberRole}>{member.role}</p>
            {member.city && (
              <p style={{fontSize: '10px', color: '#6E7681', margin: '2px 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'}}>
                <span>📍</span> {member.city}
              </p>
            )}
            <div style={styles.memberAwards}>
              {member.awards.slice(0, 4).map((award, idx) => (
                <span key={idx}>{award}</span>
              ))}
            </div>
            <div style={styles.memberStats}>
              <div style={styles.memberStat}>
                <span style={styles.memberStatNum}>{member.tripsAttended}</span>
                <span style={styles.memberStatLabel}>trips</span>
              </div>
              {member.binki > 0 && (
                <div style={styles.memberBinki}>👶 x{member.binki}</div>
              )}
            </div>
            <p style={styles.memberBirthday}>🎂 {member.birthday}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  crewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' },
  crewTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  inviteButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '12px',
    cursor: 'pointer',
  },
  crewGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  memberCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
    textAlign: 'center',
  },
  memberAvatar: { fontSize: '36px', marginBottom: '8px' },
  memberName: { fontSize: '15px', fontWeight: '500', margin: '0 0 2px' },
  memberRole: { fontSize: '11px', color: '#6E7681', margin: '0 0 10px' },
  memberAwards: { display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '10px', fontSize: '16px' },
  memberStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  memberStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  memberStatNum: { fontSize: '16px', fontWeight: '600' },
  memberStatLabel: { fontSize: '9px', color: '#6E7681' },
  memberBinki: { padding: '3px 6px', background: 'rgba(181,101,101,0.2)', borderRadius: '6px', fontSize: '11px' },
  memberBirthday: { fontSize: '11px', color: '#6E7681', margin: 0 },
};

export default CrewScreen;
