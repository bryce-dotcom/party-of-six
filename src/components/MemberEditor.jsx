import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const EMOJI_OPTIONS = [
  '🏔️', '🎿', '🛷', '🏂', '🎣', '⛵', '💅', '📸', '🍷', '🧘‍♀️',
  '🎉', '🛍️', '👨', '👩', '👧', '👶', '💑', '🏄', '🚴', '🧗',
  '🎸', '🏋️', '🤠', '🧑‍🍳', '🦊', '🐻', '🌟', '👤',
];

const MemberEditor = ({ member, crewId, isNew, onClose }) => {
  const { updateMember, addMember, removeMember, renameMember } = useApp();
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  const [name, setName] = useState(member.name || '');
  const [avatar, setAvatar] = useState(member.avatar || '\uD83D\uDC64');
  const [role, setRole] = useState(member.role || '');
  const [birthday, setBirthday] = useState(member.birthday || '');
  const [city, setCity] = useState(member.city || '');
  const [airport, setAirport] = useState(member.airport || '');
  const [profilePhoto, setProfilePhoto] = useState(member.profilePhoto || null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const resizeAndSet = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        setProfilePhoto(canvas.toDataURL('image/jpeg', 0.8));
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
      avatar,
      role: role.trim(),
      birthday: birthday.trim(),
      city: city.trim(),
      airport: airport.trim().toUpperCase(),
      profilePhoto,
    };

    if (isNew) {
      addMember(crewId, {
        id: member.id,
        awards: [],
        binki: 0,
        tripsAttended: 0,
        ...updates,
      });
    } else {
      if (member.name !== name.trim()) {
        renameMember(crewId, member.id, member.name, name.trim());
        // renameMember updates name, now update remaining fields
        const { name: _, ...rest } = updates;
        updateMember(crewId, member.id, rest);
      } else {
        updateMember(crewId, member.id, updates);
      }
    }
    onClose();
  };

  const handleDelete = () => {
    removeMember(crewId, member.id);
    onClose();
  };

  return (
    <div style={shared.modalOverlay} onClick={onClose}>
      <div style={{...shared.modal, maxHeight: '85vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
        <h2 style={shared.modalTitle}>{isNew ? 'New Member' : 'Edit Member'}</h2>

        {/* Profile Photo */}
        <div style={styles.photoSection}>
          <div style={styles.photoCircle} onClick={() => galleryRef.current?.click()}>
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" style={styles.photoImg} />
            ) : (
              <span style={styles.photoPlaceholder}>{avatar}</span>
            )}
            <div style={styles.cameraBadge}>{'\uD83D\uDCF7'}</div>
          </div>
          <div style={styles.photoButtons}>
            <button style={styles.photoBtn} onClick={() => galleryRef.current?.click()}>
              Upload Photo
            </button>
            <button style={styles.photoBtn} onClick={() => cameraRef.current?.click()}>
              Take Photo
            </button>
            {profilePhoto && (
              <button
                style={{...styles.photoBtn, color: '#B56565', borderColor: 'rgba(181,101,101,0.3)'}}
                onClick={() => setProfilePhoto(null)}
              >
                Remove
              </button>
            )}
          </div>
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{display: 'none'}} />
        </div>

        {/* Emoji Avatar */}
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Avatar Emoji</label>
          <div style={styles.emojiRow}>
            <span style={styles.currentEmoji}>{avatar}</span>
            <button style={styles.changeEmojiBtn} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {showEmojiPicker ? 'Close' : 'Change'}
            </button>
          </div>
          {showEmojiPicker && (
            <div style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((e, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.emojiOption,
                    ...(avatar === e ? styles.emojiOptionActive : {}),
                  }}
                  onClick={() => { setAvatar(e); setShowEmojiPicker(false); }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Name</label>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Member name" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>Role</label>
          <input style={styles.input} value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Trip Captain, Photographer" />
        </div>
        <div style={styles.fieldRow}>
          <div style={{flex: 1}}>
            <label style={shared.configLabel}>Birthday</label>
            <input style={styles.input} value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="e.g. Mar 15" />
          </div>
          <div style={{flex: 1}}>
            <label style={shared.configLabel}>Airport</label>
            <input
              style={styles.input}
              value={airport}
              onChange={e => setAirport(e.target.value.slice(0, 4))}
              placeholder="e.g. SLC"
              maxLength={4}
            />
          </div>
        </div>
        <div style={styles.fieldGroup}>
          <label style={shared.configLabel}>City</label>
          <input style={styles.input} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Highland, UT" />
        </div>

        {/* Save */}
        <button
          style={{...styles.saveBtn, opacity: name.trim() ? 1 : 0.4}}
          onClick={name.trim() ? handleSave : undefined}
        >
          {isNew ? '\u2795 Add Member' : '\u2714\uFE0F Save Changes'}
        </button>

        {/* Delete */}
        {!isNew && (
          <>
            {!confirmDelete ? (
              <button style={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>
                Remove from Crew
              </button>
            ) : (
              <div style={styles.confirmDelete}>
                <p style={styles.confirmText}>Remove {member.name} from crew?</p>
                <div style={styles.confirmRow}>
                  <button style={styles.confirmYes} onClick={handleDelete}>Yes, Remove</button>
                  <button style={styles.confirmNo} onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
              </div>
            )}
          </>
        )}

        <button style={shared.closeButton} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  photoCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px dashed rgba(201,169,98,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    marginBottom: '10px',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  photoPlaceholder: { fontSize: '48px' },
  cameraBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(201,169,98,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  photoButtons: {
    display: 'flex',
    gap: '6px',
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
  emojiRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  currentEmoji: { fontSize: '28px' },
  changeEmojiBtn: {
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '6px',
    color: '#C9A962',
    fontSize: '11px',
    cursor: 'pointer',
  },
  emojiGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '10px',
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
  },
  emojiOption: {
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
  emojiOptionActive: {
    background: 'rgba(201,169,98,0.2)',
    borderColor: '#C9A962',
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
  deleteBtn: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: '#B56565',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  confirmDelete: {
    padding: '12px',
    background: 'rgba(181,101,101,0.1)',
    border: '1px solid rgba(181,101,101,0.3)',
    borderRadius: '10px',
    marginBottom: '4px',
  },
  confirmText: {
    fontSize: '13px',
    color: '#B56565',
    textAlign: 'center',
    margin: '0 0 10px',
  },
  confirmRow: { display: 'flex', gap: '8px' },
  confirmYes: {
    flex: 1,
    padding: '10px',
    background: 'rgba(181,101,101,0.2)',
    border: '1px solid rgba(181,101,101,0.4)',
    borderRadius: '8px',
    color: '#FF6B6B',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmNo: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#8B949E',
    fontSize: '12px',
    cursor: 'pointer',
  },
};

export default MemberEditor;
