import React, { useState } from 'react';
import PhotoUploader from './PhotoUploader.jsx';
import GamePicker from './GamePicker.jsx';

const HeroTripSection = ({ trip, onUpdateTrip }) => {
  const [showGamePicker, setShowGamePicker] = useState(false);

  const userPhotos = trip.userPhotos || [];
  const heroIdx = trip.heroPhotoIndex || 0;
  const heroPhoto = userPhotos[heroIdx] || null;
  const gamesPlayed = trip.gamesPlayed || [];
  const conditions = trip.planData?.conditions || trip.stats?.conditions || null;

  const handlePhotoAdded = (photo) => {
    const updated = [...userPhotos, photo];
    onUpdateTrip(trip.id, { userPhotos: updated });
  };

  const handleSetHero = (idx) => {
    onUpdateTrip(trip.id, { heroPhotoIndex: idx });
  };

  const handleGameAdded = (game) => {
    onUpdateTrip(trip.id, { gamesPlayed: [...gamesPlayed, game] });
  };

  return (
    <div style={styles.container}>
      {/* 1. Hero Photo */}
      <div style={styles.heroPhoto}>
        {heroPhoto ? (
          <img src={heroPhoto.dataUrl} alt={trip.name} style={styles.heroImg} />
        ) : (
          <div style={styles.heroFallback}>
            <span style={styles.heroEmoji}>{trip.coverPhoto}</span>
          </div>
        )}
        <div style={styles.heroOverlay}>
          <span style={styles.heroActivity}>{trip.activity}</span>
          <h2 style={styles.heroName}>{trip.name}</h2>
          <p style={styles.heroMeta}>{trip.date} {'\u00B7'} {trip.location}</p>
        </div>
      </div>

      {/* 2. Trip Info */}
      <div style={styles.infoSection}>
        {trip.tripNotes && (
          <p style={styles.tripNotes}>{trip.tripNotes}</p>
        )}
        {conditions && (
          <div style={styles.conditionsRow}>
            {typeof conditions === 'string' ? (
              <span style={styles.condBadge}>{'\u{1F3D4}\uFE0F'} {conditions}</span>
            ) : (
              Object.entries(conditions)
                .filter(([k, v]) => v && !['forecast', 'specialNotes', 'trailStatus', 'regulations', 'launchAccess'].includes(k))
                .slice(0, 4)
                .map(([key, val]) => (
                  <span key={key} style={styles.condBadge}>{val}</span>
                ))
            )}
          </div>
        )}
        {trip.highlights && trip.highlights.length > 0 && (
          <div style={styles.highlightsList}>
            {trip.highlights.map((h, i) => (
              <div key={i} style={styles.highlightItem}>
                <span style={styles.highlightDot}>{'\u2022'}</span>
                <span style={styles.highlightText}>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Photos Grid */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{'\uD83D\uDCF7'} Photos</h3>
          <span style={styles.photoCount}>{userPhotos.length} photos</span>
        </div>
        <div style={styles.photosScroll}>
          {userPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              style={{
                ...styles.photoThumb,
                ...(idx === heroIdx ? styles.photoThumbHero : {}),
              }}
              onClick={() => handleSetHero(idx)}
              title="Set as hero photo"
            >
              <img src={photo.dataUrl} alt={photo.caption || 'Trip photo'} style={styles.photoThumbImg} />
            </button>
          ))}
          <div style={styles.addPhotoSlot}>
            <PhotoUploader onPhotoAdded={handlePhotoAdded} />
          </div>
        </div>
      </div>

      {/* 4. Awards */}
      {trip.awards && trip.awards.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>{'\uD83C\uDFC6'} Awards</h3>
          <div style={styles.awardsList}>
            {trip.awards.map((a, i) => (
              <div key={i} style={styles.awardItem}>
                <span style={styles.awardIcon}>{a.award}</span>
                <div style={styles.awardInfo}>
                  <span style={styles.awardName}>{a.name}</span>
                  <span style={styles.awardRecipient}>{a.recipient}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Games Played */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{'\uD83C\uDFAE'} Games Played</h3>
          <button style={styles.addGameBtn} onClick={() => setShowGamePicker(true)}>
            + Add Game
          </button>
        </div>
        {gamesPlayed.length > 0 ? (
          <div style={styles.gamesList}>
            {gamesPlayed.map((g, i) => (
              <div key={i} style={styles.gameItem}>
                <span style={styles.gameIcon}>{g.icon}</span>
                <div style={styles.gameInfo}>
                  <span style={styles.gameName}>{g.name}</span>
                  <span style={styles.gameWinner}>Winner: {g.winner}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noGames}>No games recorded yet</p>
        )}
      </div>

      {showGamePicker && (
        <GamePicker
          attendees={trip.attendees || []}
          onGameAdded={handleGameAdded}
          onClose={() => setShowGamePicker(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '24px',
  },
  // Hero Photo
  heroPhoto: {
    position: 'relative',
    height: '240px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroFallback: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: '72px' },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '40px 16px 16px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
  },
  heroActivity: { fontSize: '20px' },
  heroName: {
    fontSize: '22px',
    fontWeight: '300',
    margin: '4px 0 2px',
    letterSpacing: '1px',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  heroMeta: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
  },
  // Trip Info
  infoSection: {
    padding: '0 0 8px',
  },
  tripNotes: {
    fontSize: '13px',
    color: '#C9D1D9',
    lineHeight: '1.5',
    margin: '0 0 10px',
    fontStyle: 'italic',
    fontFamily: "'Cormorant Garamond', serif",
  },
  conditionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '10px',
  },
  condBadge: {
    padding: '4px 10px',
    background: 'rgba(201,169,98,0.1)',
    border: '1px solid rgba(201,169,98,0.2)',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#C9A962',
  },
  highlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  highlightDot: { color: '#C9A962', fontSize: '12px', lineHeight: '1.5' },
  highlightText: { fontSize: '12px', color: '#8B949E', lineHeight: '1.5' },
  // Sections
  section: {
    marginTop: '16px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '500',
    margin: 0,
    letterSpacing: '0.5px',
  },
  photoCount: {
    fontSize: '11px',
    color: '#6E7681',
  },
  // Photos scroll
  photosScroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  photoThumb: {
    width: '80px',
    height: '80px',
    borderRadius: '10px',
    overflow: 'hidden',
    flexShrink: 0,
    border: '2px solid transparent',
    padding: 0,
    cursor: 'pointer',
    background: 'none',
  },
  photoThumbHero: {
    border: '2px solid #C9A962',
    boxShadow: '0 0 8px rgba(201,169,98,0.4)',
  },
  photoThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '8px',
  },
  addPhotoSlot: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  // Awards
  awardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  awardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  awardIcon: { fontSize: '22px' },
  awardInfo: { display: 'flex', flexDirection: 'column', gap: '1px' },
  awardName: { fontSize: '12px', fontWeight: '500', color: '#E6EDF3' },
  awardRecipient: { fontSize: '11px', color: '#C9A962' },
  // Games
  addGameBtn: {
    padding: '6px 12px',
    background: 'rgba(201,169,98,0.12)',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  gamesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  gameItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  gameIcon: { fontSize: '20px' },
  gameInfo: { display: 'flex', flexDirection: 'column', gap: '1px' },
  gameName: { fontSize: '12px', fontWeight: '500', color: '#E6EDF3' },
  gameWinner: { fontSize: '11px', color: '#6BCB77' },
  noGames: {
    fontSize: '12px',
    color: '#6E7681',
    margin: 0,
    fontStyle: 'italic',
  },
};

export default HeroTripSection;
