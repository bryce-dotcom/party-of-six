import React, { useState } from 'react';
import { games, gameCategories } from '../data/games.js';
import { shared } from '../styles/shared.js';

const GamePicker = ({ attendees, onGameAdded, onClose }) => {
  const [step, setStep] = useState('pick'); // 'pick' | 'winner'
  const [selectedGame, setSelectedGame] = useState(null);
  const [category, setCategory] = useState('all');

  const filtered = category === 'all' ? games : games.filter(g => g.category === category);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setStep('winner');
  };

  const handleSelectWinner = (winner) => {
    onGameAdded({
      gameId: selectedGame.id,
      name: selectedGame.name,
      icon: selectedGame.icon,
      winner,
    });
    onClose();
  };

  return (
    <div style={shared.modalOverlay} onClick={onClose}>
      <div style={shared.modal} onClick={e => e.stopPropagation()}>
        {step === 'pick' && (
          <>
            <h2 style={shared.modalTitle}>Add Game Played</h2>
            <div style={styles.catScroll}>
              {gameCategories.map(cat => (
                <button
                  key={cat.id}
                  style={{
                    ...styles.catBtn,
                    ...(category === cat.id ? styles.catBtnActive : {}),
                  }}
                  onClick={() => setCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span style={{ fontSize: '10px' }}>{cat.label}</span>
                </button>
              ))}
            </div>
            <div style={styles.gameList}>
              {filtered.map(game => (
                <button
                  key={game.id}
                  style={styles.gameRow}
                  onClick={() => handleSelectGame(game)}
                >
                  <span style={styles.gameIcon}>{game.icon}</span>
                  <div style={styles.gameInfo}>
                    <span style={styles.gameName}>{game.name}</span>
                    <span style={styles.gameDesc}>{game.desc}</span>
                  </div>
                  <span style={styles.gamePlayers}>{game.players}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'winner' && selectedGame && (
          <>
            <h2 style={shared.modalTitle}>
              {selectedGame.icon} {selectedGame.name}
            </h2>
            <p style={styles.winnerPrompt}>Who won?</p>
            <div style={styles.winnerGrid}>
              {attendees.map(name => (
                <button
                  key={name}
                  style={styles.winnerBtn}
                  onClick={() => handleSelectWinner(name)}
                >
                  {name}
                </button>
              ))}
              <button
                style={{ ...styles.winnerBtn, borderColor: 'rgba(255,255,255,0.1)', color: '#8B949E' }}
                onClick={() => handleSelectWinner('Tie')}
              >
                Tie
              </button>
            </div>
            <button style={styles.backBtn} onClick={() => { setStep('pick'); setSelectedGame(null); }}>
              {'\u2190'} Back to games
            </button>
          </>
        )}

        <button style={shared.closeButton} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  catScroll: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    marginBottom: '14px',
    paddingBottom: '4px',
  },
  catBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    padding: '6px 10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#8B949E',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '13px',
  },
  catBtnActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },
  gameList: {
    maxHeight: '320px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  gameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    color: '#E6EDF3',
    cursor: 'pointer',
    textAlign: 'left',
  },
  gameIcon: { fontSize: '20px', flexShrink: 0 },
  gameInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  gameName: { fontSize: '13px', fontWeight: '500' },
  gameDesc: { fontSize: '10px', color: '#6E7681' },
  gamePlayers: { fontSize: '10px', color: '#6E7681', flexShrink: 0 },
  winnerPrompt: {
    fontSize: '14px',
    color: '#8B949E',
    textAlign: 'center',
    margin: '0 0 16px',
  },
  winnerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  winnerBtn: {
    padding: '12px',
    background: 'rgba(201,169,98,0.08)',
    border: '1px solid rgba(201,169,98,0.25)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'center',
  },
  backBtn: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: '#C9A962',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    marginBottom: '4px',
  },
};

export default GamePicker;
