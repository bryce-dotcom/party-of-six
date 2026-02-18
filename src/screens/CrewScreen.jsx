import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';
import MemberAvatar from '../components/MemberAvatar.jsx';
import MemberEditor from '../components/MemberEditor.jsx';

const CrewScreen = () => {
  const { currentCrew, activeCrew } = useApp();
  const [editingMember, setEditingMember] = useState(null);
  const [isNewMember, setIsNewMember] = useState(false);
  const [pressedId, setPressedId] = useState(null);

  const handleInvite = () => {
    setEditingMember({
      id: Date.now(),
      name: '',
      avatar: '\uD83D\uDC64',
      role: '',
      birthday: '',
      awards: [],
      binki: 0,
      tripsAttended: 0,
      city: '',
      airport: '',
      profilePhoto: null,
    });
    setIsNewMember(true);
  };

  return (
    <div style={shared.screen}>
      <div style={styles.crewHeader}>
        <h1 style={styles.crewTitle}>{currentCrew.name}</h1>
        <button style={styles.inviteButton} onClick={handleInvite}>+ Invite</button>
      </div>

      {currentCrew.homeBase && (
        <div style={{padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <span style={{fontSize: '12px'}}>📍</span>
          <span style={{fontSize: '12px', color: '#8B949E'}}>Home base:</span>
          <span style={{fontSize: '12px', color: '#C9A962', fontWeight: '600'}}>{currentCrew.homeBase}</span>
        </div>
      )}

      <div style={styles.crewGrid}>
        {currentCrew.members.map(member => (
          <div
            key={member.id}
            style={{
              ...styles.memberCard,
              ...(pressedId === member.id ? styles.memberCardPressed : {}),
            }}
            onClick={() => { setEditingMember(member); setIsNewMember(false); }}
            onMouseDown={() => setPressedId(member.id)}
            onMouseUp={() => setPressedId(null)}
            onMouseLeave={() => setPressedId(null)}
            onTouchStart={() => setPressedId(member.id)}
            onTouchEnd={() => setPressedId(null)}
          >
            <div style={styles.memberPhotoArea}>
              <MemberAvatar member={member} size={56} />
              <div style={styles.editBadge}>{'\u270F\uFE0F'}</div>
            </div>
            <h3 style={styles.memberName}>{member.name}</h3>
            <p style={styles.memberRole}>{member.role}</p>
            {member.city && (
              <p style={styles.memberCity}>
                <span>{'\uD83D\uDCCD'}</span> {member.city}
              </p>
            )}
            <div style={styles.memberAwards}>
              {member.awards.slice(0, 4).map((award, idx) => (
                <span key={idx}>{award}</span>
              ))}
            </div>
            <div style={styles.memberStats}>
              <div style={styles.memberStat}>
                <span style={styles.memberStatNum}>{member.tripsAttended}</span>
                <span style={styles.memberStatLabel}>trips</span>
              </div>
              {member.binki > 0 && (
                <div style={styles.memberBinki}>{'\uD83D\uDC76'} x{member.binki}</div>
              )}
            </div>
            <p style={styles.memberBirthday}>{'\uD83C\uDF82'} {member.birthday}</p>
          </div>
        ))}
      </div>

      {editingMember && (
        <MemberEditor
          member={editingMember}
          crewId={activeCrew}
          isNew={isNewMember}
          onClose={() => { setEditingMember(null); setIsNewMember(false); }}
        />
      )}
    </div>
  );
};

const styles = {
  crewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' },
  crewTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  inviteButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '12px',
    cursor: 'pointer',
  },
  crewGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  memberCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  memberCardPressed: {
    transform: 'scale(0.96)',
  },
  memberPhotoArea: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '8px',
  },
  editBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(201,169,98,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
  },
  memberName: { fontSize: '15px', fontWeight: '500', margin: '0 0 2px' },
  memberRole: { fontSize: '11px', color: '#6E7681', margin: '0 0 6px' },
  memberCity: {
    fontSize: '10px',
    color: '#6E7681',
    margin: '0 0 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
  },
  memberAwards: { display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '10px', fontSize: '16px' },
  memberStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  memberStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  memberStatNum: { fontSize: '16px', fontWeight: '600' },
  memberStatLabel: { fontSize: '9px', color: '#6E7681' },
  memberBinki: { padding: '3px 6px', background: 'rgba(181,101,101,0.2)', borderRadius: '6px', fontSize: '11px' },
  memberBirthday: { fontSize: '11px', color: '#6E7681', margin: 0 },
};

export default CrewScreen;
