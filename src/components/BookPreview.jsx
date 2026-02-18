import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const BookPreview = () => {
  const { currentCrew, crewTrips, crewYears, setShowBookPreview } = useApp();

  return (
    <div style={shared.modalOverlay} onClick={() => setShowBookPreview(false)}>
      <div style={styles.bookPreviewModal} onClick={e => e.stopPropagation()}>
        <div style={styles.bookCover}>
          <div style={styles.bookCoverInner}>
            <div style={styles.bookEstablished}>{currentCrew.established}</div>
            <div style={styles.bookIcon}>{currentCrew.icon}</div>
            <h1 style={styles.bookTitle}>{currentCrew.name}</h1>
            <div style={styles.bookSubtitle}>Adventure Book</div>
            <div style={styles.bookDivider}>◆</div>
            <div style={styles.bookStats}>
              {currentCrew.stats.totalTrips} Trips • {currentCrew.stats.totalPhotos} Photos
            </div>
            <div style={styles.bookYears}>
              {Math.min(...crewYears)} - {Math.max(...crewYears)}
            </div>
          </div>
        </div>

        <div style={styles.bookOptions}>
          <h3 style={styles.bookOptionsTitle}>Create Your Book</h3>
          <p style={styles.bookOptionsDesc}>
            Turn your adventures into a beautiful printed book
          </p>

          <div style={styles.bookFormats}>
            <button style={styles.bookFormatOption}>
              <span style={styles.bookFormatIcon}>📖</span>
              <span style={styles.bookFormatName}>Softcover</span>
              <span style={styles.bookFormatPrice}>$29.99</span>
            </button>
            <button style={styles.bookFormatOptionPremium}>
              <span style={styles.bookFormatIcon}>📚</span>
              <span style={styles.bookFormatName}>Hardcover</span>
              <span style={styles.bookFormatPrice}>$49.99</span>
              <span style={styles.bookFormatBadge}>Premium</span>
            </button>
            <button style={styles.bookFormatOption}>
              <span style={styles.bookFormatIcon}>📄</span>
              <span style={styles.bookFormatName}>PDF</span>
              <span style={styles.bookFormatPrice}>Free</span>
            </button>
          </div>

          <div style={styles.bookIncluded}>
            <h4 style={styles.bookIncludedTitle}>What's Included</h4>
            <ul style={styles.bookIncludedList}>
              <li>✓ All {crewTrips.length} trip summaries</li>
              <li>✓ {currentCrew.stats.totalPhotos}+ photos</li>
              <li>✓ Award history & leaderboards</li>
              <li>✓ Member profiles & stats</li>
              <li>✓ Trip notes & highlights</li>
              <li>✓ Custom cover with crew name</li>
            </ul>
          </div>

          <button style={styles.bookCreateButton}>
            Create Adventure Book
          </button>
        </div>

        <button style={shared.closeButton} onClick={() => setShowBookPreview(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  bookPreviewModal: {
    width: '100%',
    maxWidth: '400px',
    maxHeight: '85vh',
    background: '#1A1A1A',
    borderRadius: '16px',
    border: '1px solid rgba(201,169,98,0.2)',
    overflowY: 'auto',
  },
  bookCover: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    padding: '32px 24px',
    borderBottom: '1px solid rgba(201,169,98,0.2)',
  },
  bookCoverInner: {
    border: '2px solid #C9A962',
    borderRadius: '4px',
    padding: '32px 24px',
    textAlign: 'center',
  },
  bookEstablished: { fontSize: '10px', color: '#C9A962', letterSpacing: '3px', marginBottom: '16px' },
  bookIcon: { fontSize: '48px', marginBottom: '12px' },
  bookTitle: { fontSize: '24px', fontWeight: '300', margin: '0 0 4px', fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '2px' },
  bookSubtitle: { fontSize: '12px', color: '#8B949E', letterSpacing: '2px', textTransform: 'uppercase' },
  bookDivider: { color: '#C9A962', margin: '16px 0', fontSize: '12px' },
  bookStats: { fontSize: '11px', color: '#6E7681' },
  bookYears: { fontSize: '12px', color: '#C9A962', marginTop: '8px' },
  bookOptions: { padding: '24px' },
  bookOptionsTitle: { fontSize: '16px', fontWeight: '500', margin: '0 0 8px', textAlign: 'center' },
  bookOptionsDesc: { fontSize: '12px', color: '#8B949E', textAlign: 'center', marginBottom: '20px' },
  bookFormats: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  bookFormatOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  bookFormatOptionPremium: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(201,169,98,0.1)',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
  },
  bookFormatIcon: { fontSize: '24px' },
  bookFormatName: { flex: 1, fontSize: '14px', fontWeight: '500' },
  bookFormatPrice: { fontSize: '14px', color: '#C9A962', fontWeight: '500' },
  bookFormatBadge: {
    position: 'absolute',
    top: '-8px',
    right: '12px',
    background: '#C9A962',
    color: '#0D0D0D',
    fontSize: '9px',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bookIncluded: { marginBottom: '20px' },
  bookIncludedTitle: { fontSize: '12px', color: '#8B949E', marginBottom: '10px' },
  bookIncludedList: { margin: 0, padding: 0, listStyle: 'none' },
  bookCreateButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0D0D0D',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default BookPreview;
