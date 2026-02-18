// Party of Six - Design System & Theme
// Reference: PARTY-OF-SIX-SPEC.md

export const colors = {
  // Primary
  gold: '#C9A962',
  goldDark: '#A8893D',
  goldLight: '#D4B978',
  
  // Backgrounds
  darkBg: '#0D0D0D',
  cardBg: 'rgba(255,255,255,0.02)',
  cardBgHover: 'rgba(255,255,255,0.04)',
  modalBg: '#1A1A1A',
  
  // Borders
  borderGold: 'rgba(201,169,98,0.15)',
  borderGoldStrong: 'rgba(201,169,98,0.3)',
  borderSubtle: 'rgba(255,255,255,0.08)',
  
  // Text
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  
  // Status
  success: '#6BCB77',
  successBg: 'rgba(107,203,119,0.15)',
  error: '#B56565',
  errorBright: '#FF6B6B',
  errorBg: 'rgba(181,101,101,0.15)',
  warning: '#FFD93D',
  warningBg: 'rgba(255,217,61,0.15)',
  
  // Crew Colors
  crewBoyz: '#C9A962',
  crewGirls: '#D4A5A5',
  crewFamily: '#7EB5A6',
  crewCouples: '#B8A9C9',
};

export const fonts = {
  headline: "'Playfair Display', Georgia, serif",
  body: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  accent: "'Cormorant Garamond', Georgia, serif",
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
};

export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  gold: '0 4px 16px rgba(201,169,98,0.2)',
  dark: '0 4px 16px rgba(0,0,0,0.3)',
};

export const layout = {
  maxWidth: '430px',
  tabBarHeight: '80px',
  statusBarHeight: '44px',
};

export default { colors, fonts, spacing, borderRadius, shadows, layout };
