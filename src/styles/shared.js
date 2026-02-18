// Party of Six - Shared Styles
// Styles used by 2+ files (app shell, modals, sections, etc.)

export const shared = {
  app: {
    fontFamily: "'Outfit', 'SF Pro Display', -apple-system, sans-serif",
    background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
    minHeight: '100vh',
    color: '#E6EDF3',
    position: 'relative',
    maxWidth: '430px',
    margin: '0 auto',
  },
  statusBar: { height: '44px' },
  content: { paddingBottom: '90px', overflowY: 'auto' },
  screen: { padding: '0 16px 24px' },

  // Sections
  section: { marginBottom: '28px' },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '500',
    marginBottom: '14px',
    color: '#C9A962',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },

  // Modals
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
    overflowY: 'auto',
  },
  modal: {
    width: '100%',
    maxWidth: '380px',
    background: '#1A1A1A',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(201,169,98,0.2)',
  },
  modalTitle: { fontSize: '18px', fontWeight: '500', margin: '0 0 20px', textAlign: 'center', letterSpacing: '1px' },
  closeButton: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#8B949E',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '16px',
  },

  // Empty State
  emptyState: { textAlign: 'center', padding: '40px 20px' },
  emptyStateIcon: { fontSize: '48px', opacity: 0.5 },
  emptyStateText: { color: '#6E7681', marginTop: '12px' },

  // Error Banner
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(181,101,101,0.15)',
    border: '1px solid rgba(181,101,101,0.3)',
    borderRadius: '8px',
    color: '#FF6B6B',
    fontSize: '12px',
    marginBottom: '12px',
  },

  // Config (Plan screen + reusable)
  configLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#C9A962',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '10px',
    marginTop: '4px',
  },
  configRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '8px 0',
  },
  groupSizeValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#C9A962',
  },

  // Category Tabs (Plan + Games)
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    margin: '0 -16px 20px',
    padding: '0 16px 8px',
  },
  categoryTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    color: '#8B949E',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  categoryTabActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },
};

export default shared;
