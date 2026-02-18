import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const ICON_OPTIONS = [
  '\uD83C\uDFD4\uFE0F', '\uD83E\uDD42', '\uD83D\uDC51', '\uD83D\uDE80', '\u26F5', '\uD83C\uDFBF',
  '\uD83C\uDFD6\uFE0F', '\uD83C\uDFD5\uFE0F', '\uD83D\uDEB4', '\uD83C\uDFC4', '\uD83E\uDD3E',
  '\uD83D\uDC91', '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66',
  '\uD83C\uDF1F', '\uD83D\uDD25', '\uD83C\uDFC6', '\uD83C\uDFAF', '\uD83E\uDDED',
  '\uD83C\uDF0A', '\uD83C\uDF34', '\u2744\uFE0F', '\uD83C\uDF89', '\uD83D\uDC85',
];

const COLOR_OPTIONS = [
  '#C9A962', '#D4A5A5', '#7EB5A6', '#B8A9C9', '#A5C4D4', '#D4B896',
];

const CrewEditor = ({ crew, isNew, onClose }) => {
  const { updateCrew, addCrew, setActiveCrew, setActiveTab, setShowCrewSwitcher } = useApp();
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  const [name, setName] = useState(crew?.name || '');
  const [icon, setIcon] = useState(crew?.icon || '\uD83C\uDFD4\uFE0F');
  const [tagline, setTagline] = useState(crew?.tagline || '');
  const [established, setEstablished] = useState(crew?.established || `Est. ${new Date().getFullYear()}`);
  const [homeBase, setHomeBase] = useState(crew?.homeBase || '');
  const [color, setColor] = useState(crew?.color || '#C9A962');
  const [heroPhoto, setHeroPhoto] = useState(crew?.heroPhoto || null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const resizeAndSet = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        setHeroPhoto(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) resizeAndSet(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const updates = {
      name: name.trim(),
      icon,
      tagline: tagline.trim(),
      established: established.trim(),
      homeBase: homeBase.trim(),
      color,
      heroPhoto,
    };

    if (isNew) {
      const crewId = `crew-${Date.now()}`;
      addCrew({
        id: crewId,
        ...updates,
        members: [],
        stats: { totalTrips: 0, totalAwards: 0, totalPhotos: 0 },
      });
      setActiveCrew(crewId);
      setActiveTab('crew');
      setShowCrewSwitcher(false);
    } else {
      updateCrew(crew.id, updates);
    }
    onClose();
  };

  return (
    <div style={shared.modalOverlay} onClick={onClose}>
      <div style={{...shared.modal, maxHeight: '85vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
        <h2 style={shared.modalTitle}>{isNew ? 'Create New Crew' : 'Edit Crew'}</h2>

        {/* Hero Photo */}
        <div style={styles.heroArea} onClick={() => galleryRef.current?.click()}>
          {heroPhoto ? (
            <img src={heroPhoto} alt="Crew" style={styles.heroImg} />
          ) : (
            <div style={{...styles.heroFallback, background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`}}>
              <span style={styles.heroIcon}>{icon}</span>
            </div>
          )}
          <div style={styles.heroCameraBadge}>{'\uD83D\uDCF7'} {heroPhoto ? 'Change' : 'Add Photo'}</div>
        </div>
        <div style={styles.photoButtons}>
          <button style={styles.photoBtn} onClick={() => galleryRef.current?.click()}>
            Upload Photo
          </button>
          <button style={styles.photoBtn} onClick={() => cameraRef.current?.click()}>
            Take Photo
          </button>
          {heroPhoto && (
            <button
              style={{...styles.photoBtn, color: '#B56565', borderColor: 'rgba(181,101,101,0.3)'}}
              onClick={() => setHeroPhoto(null)}
            >
              Remove
            </button>
          )}
        </div>
        <input ref={galleryRef} type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{display: 'none'}} />

        {/* Icon Picker */}
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Crew Icon</label>
          <div style={styles.iconRow}>
            <span style={styles.currentIcon}>{icon}</span>
            <button style={styles.changeBtn} onClick={() => setShowIconPicker(!showIconPicker)}>
              {showIconPicker ? 'Close' : 'Change'}
            </button>
          </div>
          {showIconPicker && (
            <div style={styles.iconGrid}>
              {ICON_OPTIONS.map((e, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.iconOption,
                    ...(icon === e ? styles.iconOptionActive : {}),
                  }}
                  onClick={() => { setIcon(e); setShowIconPicker(false); }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Crew Name</label>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Boyz" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Tagline</label>
          <input style={styles.input} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Send it or go home" />
        </div>
        <div style={styles.fieldRow}>
          <div style={{flex: 1}}>
            <label style={shared.configLabel}>Established</label>
            <input style={styles.input} value={established} onChange={e => setEstablished(e.target.value)} placeholder="Est. 2024" />
          </div>
          <div style={{flex: 1}}>
            <label style={shared.configLabel}>Home Base</label>
            <input style={styles.input} value={homeBase} onChange={e => setHomeBase(e.target.value)} placeholder="e.g. Lehi, UT" />
          </div>
        </div>

        {/* Color Picker */}
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Accent Color</label>
          <div style={styles.colorRow}>
            {COLOR_OPTIONS.map(c => (
              <button
                key={c}
                style={{
                  ...styles.colorDot,
                  background: c,
                  ...(color === c ? { border: '3px solid #fff', transform: 'scale(1.2)' } : {}),
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          style={{...styles.saveBtn, opacity: name.trim() ? 1 : 0.4}}
          onClick={name.trim() ? handleSave : undefined}
        >
          {isNew ? '\u2795 Create Crew' : '\u2714\uFE0F Save Changes'}
        </button>

        <button style={shared.closeButton} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  heroArea: {
    height: '160px',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    marginBottom: '10px',
    border: '1px dashed rgba(201,169,98,0.3)',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: { fontSize: '56px' },
  heroCameraBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    padding: '6px 12px',
    background: 'rgba(0,0,0,0.7)',
    borderRadius: '8px',
    fontSize: '11px',
    color: '#C9A962',
  },
  photoButtons: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  photoBtn: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '6px',
    color: '#C9A962',
    fontSize: '11px',
    cursor: 'pointer',
  },
  fieldGroup: { marginBottom: '14px' },
  fieldRow: { display: 'flex', gap: '10px', marginBottom: '14px' },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#E6EDF3',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  },
  iconRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  currentIcon: { fontSize: '32px' },
  changeBtn: {
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '6px',
    color: '#C9A962',
    fontSize: '11px',
    cursor: 'pointer',
  },
  iconGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '10px',
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
  },
  iconOption: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  iconOptionActive: {
    background: 'rgba(201,169,98,0.2)',
    borderColor: '#C9A962',
  },
  colorRow: {
    display: 'flex',
    gap: '10px',
  },
  colorDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0D0D0D',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(201,169,98,0.2)',
    marginBottom: '8px',
  },
};

export default CrewEditor;
