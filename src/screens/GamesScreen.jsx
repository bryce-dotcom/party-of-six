import React, { useState } from 'react';
import { games, gameCategories, challenges, quickTools } from '../data/games.js';
import { shared } from '../styles/shared.js';

const GamesScreen = () => {
  const [gamesFilter, setGamesFilter] = useState('all');

  const filteredGames = gamesFilter === 'all'
    ? games
    : games.filter(g => g.category === gamesFilter);

  return (
    <div style={shared.screen}>
      <div style={styles.gamesHeader}>
        <h1 style={styles.gamesTitle}>Games</h1>
      </div>

      {/* Game Category Filters */}
      <div style={shared.categoryTabs}>
        {gameCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setGamesFilter(cat.id)}
            style={{
              ...shared.categoryTab,
              ...(gamesFilter === cat.id ? shared.categoryTabActive : {}),
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div style={styles.gamesGrid}>
        {filteredGames.map((game) => (
          <div key={game.id} style={styles.gameCard}>
            <div style={styles.gameCardTop}>
              <span style={styles.gameIcon}>{game.icon}</span>
              <span style={styles.gamePlayers}>{game.players}</span>
            </div>
            <h3 style={styles.gameName}>{game.name}</h3>
            <p style={styles.gameDesc}>{game.desc}</p>
            <button style={styles.gameButton}>Play</button>
          </div>
        ))}
      </div>

      {/* Challenges Section */}
      <div style={{...shared.section, marginTop: '28px'}}>
        <h2 style={shared.sectionTitle}>Group Challenges</h2>
        <div style={styles.challengesList}>
          {challenges.map((challenge, idx) => (
            <div key={idx} style={styles.challengeRow}>
              <span style={styles.challengeIcon}>{challenge.icon}</span>
              <div style={styles.challengeInfo}>
                <span style={styles.challengeName}>{challenge.name}</span>
                <span style={styles.challengeDesc}>{challenge.desc}</span>
              </div>
              <span style={styles.challengeDuration}>{challenge.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools */}
      <div style={shared.section}>
        <h2 style={shared.sectionTitle}>Quick Tools</h2>
        <div style={styles.quickTools}>
          {quickTools.map((tool, idx) => (
            <button key={idx} style={styles.quickToolButton}>
              <span style={styles.quickToolIcon}>{tool.icon}</span>
              <span style={styles.quickToolName}>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  gamesHeader: { textAlign: 'center', padding: '16px 0 20px' },
  gamesTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  gameCard: {
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(201,169,98,0.12)',
  },
  gameCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  gameIcon: { fontSize: '24px' },
  gamePlayers: {
    fontSize: '10px',
    color: '#6E7681',
    background: 'rgba(255,255,255,0.05)',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  gameName: { fontSize: '13px', fontWeight: '600', margin: '0 0 4px', letterSpacing: '0.3px' },
  gameDesc: { fontSize: '11px', color: '#6E7681', margin: '0 0 10px', lineHeight: '1.3' },
  gameButton: {
    width: '100%',
    padding: '8px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '6px',
    color: '#C9A962',
    fontWeight: '500',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  challengesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  challengeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(201,169,98,0.08)',
  },
  challengeIcon: { fontSize: '24px' },
  challengeInfo: { flex: 1 },
  challengeName: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '2px' },
  challengeDesc: { display: 'block', fontSize: '11px', color: '#6E7681' },
  challengeDuration: {
    fontSize: '9px',
    color: '#C9A962',
    background: 'rgba(201,169,98,0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  quickTools: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
  },
  quickToolButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 6px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(201,169,98,0.1)',
    borderRadius: '8px',
    color: '#E6EDF3',
    cursor: 'pointer',
  },
  quickToolIcon: { fontSize: '20px' },
  quickToolName: { fontSize: '9px', color: '#6E7681' },
};

export default GamesScreen;
