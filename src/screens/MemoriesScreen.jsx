import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const MemoriesScreen = () => {
  const { crewYears, memoriesYear, setMemoriesYear, filteredTrips, setSelectedTrip, setShowBookPreview } = useApp();

  return (
    <div style={shared.screen}>
      <div style={styles.memoriesHeader}>
        <h1 style={styles.memoriesTitle}>Memories</h1>
        <button style={styles.bookButton} onClick={() => setShowBookPreview(true)}>
          📖 Create Book
        </button>
      </div>

      {/* Year Filter */}
      <div style={styles.yearFilter}>
        <button
          style={{
            ...styles.yearButton,
            ...(memoriesYear === 'all' ? styles.yearButtonActive : {}),
          }}
          onClick={() => setMemoriesYear('all')}
        >
          All Years
        </button>
        {crewYears.map(year => (
          <button
            key={year}
            style={{
              ...styles.yearButton,
              ...(memoriesYear === year.toString() ? styles.yearButtonActive : {}),
            }}
            onClick={() => setMemoriesYear(year.toString())}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div style={styles.memoriesGrid}>
        {filteredTrips.map(trip => (
          <div
            key={trip.id}
            style={styles.memoryCard}
            onClick={() => setSelectedTrip(trip)}
          >
            <div style={styles.memoryCardCover}>
              <span style={styles.memoryCardEmoji}>{trip.coverPhoto}</span>
              <div style={styles.memoryCardOverlay}>
                <span style={styles.memoryCardPhotoCount}>{trip.photos.length} 📷</span>
              </div>
            </div>
            <div style={styles.memoryCardContent}>
              <div style={styles.memoryCardTop}>
                <span style={styles.memoryCardActivity}>{trip.activity}</span>
                <span style={styles.memoryCardYear}>{trip.year}</span>
              </div>
              <h3 style={styles.memoryCardName}>{trip.name}</h3>
              <p style={styles.memoryCardLocation}>{trip.location}</p>
              <p style={styles.memoryCardDate}>{trip.date}</p>
              {trip.awards.length > 0 && (
                <div style={styles.memoryCardAwards}>
                  {trip.awards.slice(0, 3).map((a, idx) => (
                    <span key={idx} style={styles.memoryCardAwardIcon}>{a.award}</span>
                  ))}
                  {trip.awards.length > 3 && (
                    <span style={styles.memoryCardAwardMore}>+{trip.awards.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div style={shared.emptyState}>
          <span style={shared.emptyStateIcon}>📸</span>
          <p style={shared.emptyStateText}>No trips found for this filter</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  memoriesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
  },
  memoriesTitle: {
    fontSize: '24px',
    fontWeight: '300',
    margin: 0,
    letterSpacing: '2px',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  bookButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  yearFilter: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
    padding: '4px 0',
  },
  yearButton: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    color: '#8B949E',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  yearButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },
  memoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  memoryCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  memoryCardCover: {
    height: '100px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  memoryCardEmoji: { fontSize: '40px' },
  memoryCardOverlay: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.6)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  memoryCardPhotoCount: { fontSize: '10px', color: '#fff' },
  memoryCardContent: { padding: '12px' },
  memoryCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  memoryCardActivity: { fontSize: '16px' },
  memoryCardYear: { fontSize: '11px', color: '#6E7681' },
  memoryCardName: { fontSize: '13px', fontWeight: '600', margin: '0 0 4px', letterSpacing: '0.3px' },
  memoryCardLocation: { fontSize: '11px', color: '#8B949E', margin: '0 0 2px' },
  memoryCardDate: { fontSize: '10px', color: '#6E7681', margin: 0 },
  memoryCardAwards: { display: 'flex', gap: '4px', marginTop: '8px', alignItems: 'center' },
  memoryCardAwardIcon: { fontSize: '14px' },
  memoryCardAwardMore: { fontSize: '10px', color: '#6E7681' },
};

export default MemoriesScreen;
