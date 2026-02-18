import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { awards, getAwardBorderColor } from '../data/awards.js';
import { shared } from '../styles/shared.js';

const AwardsScreen = () => {
  const { currentCrew, setSelectedAward, setShowAwardModal } = useApp();

  return (
    <div style={shared.screen}>
      <div style={styles.awardsHeader}>
        <h1 style={styles.awardsTitle}>Awards</h1>
      </div>

      <div style={styles.binkiSection}>
        <div style={styles.binkiHeader}>
          <span style={styles.binkiIcon}>👶</span>
          <h2 style={styles.binkiTitle}>Binki Leaderboard</h2>
        </div>
        <p style={styles.binkiDesc}>Who's lost their cool the most?</p>
        <div style={styles.binkiList}>
          {[...currentCrew.members].sort((a, b) => b.binki - a.binki).map((member, idx) => (
            <div key={member.id} style={styles.binkiRow}>
              <span style={styles.binkiRank}>#{idx + 1}</span>
              <span style={styles.binkiAvatar}>{member.avatar}</span>
              <span style={styles.binkiName}>{member.name}</span>
              <span style={styles.binkiCount}>
                {member.binki > 0 ? Array(Math.min(member.binki, 5)).fill('👶').join('') : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={shared.section}>
        <h2 style={shared.sectionTitle}>All Awards</h2>
        <div style={styles.awardsGrid}>
          {awards.slice(0, 18).map(award => (
            <button
              key={award.id}
              style={{
                ...styles.awardCard,
                borderColor: getAwardBorderColor(award.type),
              }}
              onClick={() => { setSelectedAward(award); setShowAwardModal(true); }}
            >
              <span style={styles.awardIconLarge}>{award.icon}</span>
              <span style={styles.awardName}>{award.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  awardsHeader: { textAlign: 'center', padding: '16px 0 24px' },
  awardsTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  binkiSection: {
    background: 'linear-gradient(135deg, rgba(181,101,101,0.1) 0%, rgba(181,101,101,0.05) 100%)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '28px',
    border: '1px solid rgba(181,101,101,0.2)',
  },
  binkiHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
  binkiIcon: { fontSize: '28px' },
  binkiTitle: { fontSize: '16px', fontWeight: '500', margin: 0 },
  binkiDesc: { fontSize: '12px', color: '#8B949E', margin: '0 0 16px' },
  binkiList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  binkiRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' },
  binkiRank: { fontSize: '12px', fontWeight: '600', color: '#B56565', width: '28px' },
  binkiAvatar: { fontSize: '20px' },
  binkiName: { flex: 1, fontSize: '13px', fontWeight: '500' },
  binkiCount: { fontSize: '14px' },
  awardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  awardCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  awardIconLarge: { fontSize: '28px', marginBottom: '6px' },
  awardName: { fontSize: '10px', color: '#8B949E', textAlign: 'center' },
};

export default AwardsScreen;
