import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';
import Logo from '../components/Logo.jsx';
import CrewSelector from '../components/CrewSelector.jsx';
import MemberAvatar from '../components/MemberAvatar.jsx';

const HomeScreen = () => {
  const { currentCrew, crewTrips, setActiveTab, setShowBookPreview, setSelectedTrip } = useApp();

  return (
    <div style={shared.screen}>
      {/* Hero with Main Party of Six Logo */}
      <div style={styles.heroSection}>
        <Logo />
        <CrewSelector />
        <div style={styles.quickStats}>
          <div style={styles.quickStat}>
            <span style={styles.statNumber}>{currentCrew.stats.totalTrips}</span>
            <span style={styles.statLabel}>Trips</span>
          </div>
          <div style={styles.quickStat}>
            <span style={styles.statNumber}>{currentCrew.members.length}</span>
            <span style={styles.statLabel}>Members</span>
          </div>
          <div style={styles.quickStat}>
            <span style={styles.statNumber}>{currentCrew.stats.totalPhotos}</span>
            <span style={styles.statLabel}>Photos</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <button style={styles.primaryAction} onClick={() => setActiveTab('plan')}>
          <span>🚀</span><span>Plan Trip</span>
        </button>
        <button style={styles.secondaryAction} onClick={() => setShowBookPreview(true)}>
          <span>📖</span><span>Create Book</span>
        </button>
      </div>

      {/* Recent Trips */}
      <div style={shared.section}>
        <h2 style={shared.sectionTitle}>Recent Adventures</h2>
        <div style={styles.tripCards}>
          {crewTrips.slice(0, 4).map(trip => (
            <div
              key={trip.id}
              style={styles.tripCard}
              onClick={() => setSelectedTrip(trip)}
            >
              <div style={styles.tripCardCover}>{trip.coverPhoto}</div>
              <div style={styles.tripCardContent}>
                <span style={styles.tripCardActivity}>{trip.activity}</span>
                <h3 style={styles.tripCardName}>{trip.name}</h3>
                <p style={styles.tripCardDate}>{trip.date}</p>
                <div style={styles.tripCardMeta}>
                  <span>{trip.photos.length} 📷</span>
                  <span>{trip.awards.length} 🏆</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Birthdays */}
      <div style={shared.section}>
        <h2 style={shared.sectionTitle}>Upcoming Birthdays</h2>
        <div style={styles.birthdayList}>
          {currentCrew.members.slice(0, 3).map(member => (
            <div key={member.id} style={styles.birthdayItem}>
              <MemberAvatar member={member} size={24} />
              <span style={styles.birthdayName}>{member.name}</span>
              <span style={styles.birthdayDate}>{member.birthday}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroSection: {
    padding: '28px 20px 24px',
    marginBottom: '20px',
    borderRadius: '16px',
    background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(13,13,13,0.95) 100%)',
    border: '1px solid rgba(201,169,98,0.15)',
  },
  quickStats: { display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' },
  quickStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNumber: { fontSize: '28px', fontWeight: '300', color: '#C9A962', fontFamily: "'Playfair Display', Georgia, serif" },
  statLabel: { fontSize: '9px', color: '#6E7681', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '2px' },
  quickActions: { display: 'flex', gap: '12px', marginBottom: '28px' },
  primaryAction: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0D0D0D',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(201,169,98,0.2)',
  },
  secondaryAction: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  tripCards: { display: 'flex', gap: '12px', overflowX: 'auto', margin: '0 -16px', padding: '0 16px' },
  tripCard: {
    minWidth: '160px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  tripCardCover: {
    height: '80px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
  },
  tripCardContent: { padding: '12px' },
  tripCardActivity: { fontSize: '16px' },
  tripCardName: { fontSize: '14px', fontWeight: '600', margin: '4px 0', letterSpacing: '0.3px' },
  tripCardDate: { fontSize: '11px', color: '#6E7681', margin: 0 },
  tripCardMeta: { display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', color: '#8B949E' },
  birthdayList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  birthdayItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  birthdayAvatar: { fontSize: '24px' },
  birthdayName: { flex: 1, fontSize: '14px', fontWeight: '500' },
  birthdayDate: { fontSize: '12px', color: '#C9A962' },
};

export default HomeScreen;
