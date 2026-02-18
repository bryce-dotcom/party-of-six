import React from 'react';

const Logo = () => (
  <div style={styles.logoContainer}>
    <div style={styles.logoTopLine}>
      <div style={styles.logoLineGradientLeft} />
      <span style={styles.logoEstText}>EST. 2026</span>
      <div style={styles.logoLineGradientRight} />
    </div>
    <div style={styles.logoMain}>
      <span style={styles.logoParty}>PARTY</span>
      <span style={styles.logoOf}>of</span>
      <span style={styles.logoSix}>SIX</span>
    </div>
    <div style={styles.logoDivider}>
      <div style={styles.logoDividerLineLeft} />
      <div style={styles.logoDividerDiamond} />
      <div style={styles.logoDividerLineRight} />
    </div>
    <p style={styles.logoTagline}>ADVENTURES AWAIT</p>
  </div>
);

const styles = {
  logoContainer: { textAlign: 'center', paddingTop: '4px' },
  logoTopLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  logoLineGradientLeft: {
    width: '40px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #C9A962)',
  },
  logoLineGradientRight: {
    width: '40px',
    height: '1px',
    background: 'linear-gradient(90deg, #C9A962, transparent)',
  },
  logoEstText: {
    fontSize: '9px',
    letterSpacing: '3px',
    color: '#C9A962',
    fontWeight: '400',
  },
  logoMain: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '10px',
  },
  logoParty: {
    fontSize: '32px',
    fontWeight: '300',
    letterSpacing: '6px',
    color: '#C9A962',
    fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
  },
  logoOf: {
    fontSize: '20px',
    fontStyle: 'italic',
    fontWeight: '300',
    color: '#8B949E',
    fontFamily: "'Cormorant Garamond', 'Times New Roman', Georgia, serif",
    margin: '0 2px',
  },
  logoSix: {
    fontSize: '32px',
    fontWeight: '300',
    letterSpacing: '6px',
    color: '#C9A962',
    fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
  },
  logoDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '12px',
  },
  logoDividerLineLeft: {
    width: '50px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #C9A962)',
  },
  logoDividerLineRight: {
    width: '50px',
    height: '1px',
    background: 'linear-gradient(90deg, #C9A962, transparent)',
  },
  logoDividerDiamond: {
    width: '6px',
    height: '6px',
    background: '#C9A962',
    transform: 'rotate(45deg)',
  },
  logoTagline: {
    fontSize: '9px',
    letterSpacing: '4px',
    color: '#6E7681',
    marginTop: '12px',
    marginBottom: '0',
    fontWeight: '400',
  },
};

export default Logo;
