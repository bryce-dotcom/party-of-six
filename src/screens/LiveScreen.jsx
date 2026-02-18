import React, { useState } from 'react';
import { shared } from '../styles/shared.js';

const LiveScreen = () => {
  const [liveTab, setLiveTab] = useState('map');
  const [messageText, setMessageText] = useState('');
  const [sharingLocation, setSharingLocation] = useState(true);

  const crewLocations = [
    { id: 1, name: 'Bryce', avatar: '🏔️', lat: 43.8231, lng: -110.0725, status: 'moving', speed: '35 mph', lastUpdate: '1m ago', battery: 78 },
    { id: 2, name: 'Jake', avatar: '🎿', lat: 43.8245, lng: -110.0698, status: 'stopped', speed: '0 mph', lastUpdate: '2m ago', battery: 45 },
    { id: 3, name: 'Mike', avatar: '🛷', lat: 43.8198, lng: -110.0751, status: 'moving', speed: '28 mph', lastUpdate: '30s ago', battery: 92 },
    { id: 4, name: 'Tyler', avatar: '🏂', lat: 43.8212, lng: -110.0680, status: 'moving', speed: '42 mph', lastUpdate: '1m ago', battery: 63 },
    { id: 5, name: 'Dave', avatar: '🎣', lat: 43.8267, lng: -110.0712, status: 'stopped', speed: '0 mph', lastUpdate: '5m ago', battery: 34 },
    { id: 6, name: 'Chris', avatar: '⛵', lat: 43.8189, lng: -110.0695, status: 'moving', speed: '31 mph', lastUpdate: '45s ago', battery: 81 },
  ];

  const messages = [
    { id: 1, sender: 'Bryce', avatar: '🏔️', text: 'Found an amazing powder stash! Head northwest from the meadow', time: '10:34 AM', type: 'text' },
    { id: 2, sender: 'Jake', avatar: '🎿', text: '📍 Shared location: Stopped at viewpoint', time: '10:36 AM', type: 'location' },
    { id: 3, sender: 'Tyler', avatar: '🏂', text: 'On my way! Save some for me', time: '10:37 AM', type: 'text' },
    { id: 4, sender: 'Mike', avatar: '🛷', text: "Jake you good? Saw you stopped", time: '10:38 AM', type: 'text' },
    { id: 5, sender: 'Jake', avatar: '🎿', text: 'Yeah just taking pics 📸', time: '10:39 AM', type: 'text' },
    { id: 6, sender: 'Dave', avatar: '🎣', text: '🚨 SOS: Stuck in tree well. Need help!', time: '10:41 AM', type: 'sos' },
    { id: 7, sender: 'Bryce', avatar: '🏔️', text: 'On my way Dave! Everyone head to his pin', time: '10:41 AM', type: 'text' },
    { id: 8, sender: 'Chris', avatar: '⛵', text: '2 min out', time: '10:42 AM', type: 'text' },
  ];

  const quickMessages = [
    { icon: '👍', text: 'All good!' },
    { icon: '⏸️', text: 'Stopping' },
    { icon: '⛽', text: 'Need fuel' },
    { icon: '🔧', text: 'Mech issue' },
    { icon: '📍', text: 'Meet here' },
    { icon: '🚨', text: 'SOS' },
  ];

  return (
    <div style={shared.screen}>
      <div style={styles.liveHeader}>
        <div style={styles.liveHeaderTop}>
          <div>
            <h1 style={styles.liveTitle}>Live</h1>
            <p style={styles.liveSubtitle}>Togwotee Weekend • {crewLocations.filter(c => c.status === 'moving').length} moving</p>
          </div>
          <button
            style={{
              ...styles.shareLocationButton,
              background: sharingLocation ? 'rgba(107,203,119,0.15)' : 'rgba(181,101,101,0.15)',
              borderColor: sharingLocation ? '#6BCB77' : '#B56565',
              color: sharingLocation ? '#6BCB77' : '#B56565',
            }}
            onClick={() => setSharingLocation(!sharingLocation)}
          >
            {sharingLocation ? '📍 Live' : '📍 Off'}
          </button>
        </div>

        <div style={styles.liveToggle}>
          {['map', 'chat', 'list'].map(tab => (
            <button
              key={tab}
              style={{...styles.liveToggleButton, ...(liveTab === tab ? styles.liveToggleActive : {})}}
              onClick={() => setLiveTab(tab)}
            >
              {tab === 'map' ? '🗺️ Map' : tab === 'chat' ? '💬 Chat' : '👥 List'}
            </button>
          ))}
        </div>
      </div>

      {/* MAP VIEW */}
      {liveTab === 'map' && (
        <div>
          <div style={styles.mapView}>
            {crewLocations.map((member, idx) => (
              <div
                key={member.id}
                style={{
                  ...styles.mapMarker,
                  top: `${15 + (idx * 13)}%`,
                  left: `${10 + (idx * 14)}%`,
                  background: member.status === 'moving' ? 'rgba(107,203,119,0.95)' : 'rgba(201,169,98,0.95)',
                }}
              >
                <span style={styles.mapMarkerAvatar}>{member.avatar}</span>
                <div style={styles.mapMarkerInfo}>
                  <span style={styles.mapMarkerName}>{member.name}</span>
                  {member.status === 'moving' && <span style={styles.mapMarkerSpeed}>{member.speed}</span>}
                </div>
              </div>
            ))}
            <div style={styles.mapControls}>
              <button style={styles.mapControlButton}>+</button>
              <button style={styles.mapControlButton}>−</button>
              <button style={styles.mapControlButton}>◎</button>
            </div>
          </div>
          <div style={styles.mapQuickActions}>
            <button style={styles.mapActionButton}><span>📍</span><span>Pin</span></button>
            <button style={styles.mapActionButton}><span>🧭</span><span>Navigate</span></button>
            <button style={{...styles.mapActionButton, background: 'rgba(181,101,101,0.2)', borderColor: '#B56565'}}><span>🚨</span><span>SOS</span></button>
            <button style={styles.mapActionButton}><span>📏</span><span>Distance</span></button>
          </div>
        </div>
      )}

      {/* CHAT VIEW */}
      {liveTab === 'chat' && (
        <div style={styles.chatContainer}>
          <div style={styles.chatMessages}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  ...styles.chatMessage,
                  ...(msg.type === 'sos' ? styles.chatMessageSOS : {}),
                }}
              >
                <span style={styles.chatAvatar}>{msg.avatar}</span>
                <div style={styles.chatBubble}>
                  <div style={styles.chatBubbleHeader}>
                    <span style={styles.chatSender}>{msg.sender}</span>
                    <span style={styles.chatTime}>{msg.time}</span>
                  </div>
                  <p style={{
                    ...styles.chatText,
                    ...(msg.type === 'sos' ? {color: '#FF6B6B', fontWeight: '600'} : {}),
                    ...(msg.type === 'location' ? {color: '#6BCB77'} : {}),
                  }}>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.quickMessagesRow}>
            {quickMessages.map((qm, idx) => (
              <button key={idx} style={{
                ...styles.quickMessageButton,
                ...(qm.text === 'SOS' ? {background: 'rgba(181,101,101,0.2)', borderColor: '#B56565'} : {}),
              }}>
                {qm.icon}
              </button>
            ))}
          </div>
          <div style={styles.chatInputContainer}>
            <button style={styles.chatAttachButton}>📍</button>
            <input
              type="text"
              placeholder="Message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={styles.chatInput}
            />
            <button style={styles.chatSendButton}>➤</button>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {liveTab === 'list' && (
        <div style={styles.listContainer}>
          {crewLocations.map(member => (
            <div key={member.id} style={styles.locationCard}>
              <span style={styles.locationAvatar}>{member.avatar}</span>
              <div style={styles.locationInfo}>
                <span style={styles.locationName}>{member.name}</span>
                <span style={styles.locationStatus}>
                  {member.status === 'moving' ? `🟢 ${member.speed}` : '🟡 Stopped'} • {member.lastUpdate}
                </span>
              </div>
              <div style={styles.locationRight}>
                <div style={styles.batteryContainer}>
                  <div style={styles.batteryBar}>
                    <div style={{
                      ...styles.batteryLevel,
                      width: `${member.battery}%`,
                      background: member.battery > 50 ? '#6BCB77' : member.battery > 20 ? '#FFD93D' : '#FF6B6B',
                    }} />
                  </div>
                  <span style={styles.batteryText}>{member.battery}%</span>
                </div>
                <button style={styles.navigateButton}>🧭</button>
              </div>
            </div>
          ))}
          <div style={styles.groupStats}>
            <div style={styles.groupStat}>
              <span style={styles.groupStatValue}>2.3 mi</span>
              <span style={styles.groupStatLabel}>Furthest</span>
            </div>
            <div style={styles.groupStat}>
              <span style={styles.groupStatValue}>0.8 mi</span>
              <span style={styles.groupStatLabel}>Avg Dist</span>
            </div>
            <div style={styles.groupStat}>
              <span style={styles.groupStatValue}>34 mph</span>
              <span style={styles.groupStatLabel}>Avg Speed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  liveHeader: { marginBottom: '16px' },
  liveHeaderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  liveTitle: {
    fontSize: '24px',
    fontWeight: '300',
    margin: 0,
    letterSpacing: '2px',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  liveSubtitle: { fontSize: '12px', color: '#6E7681', margin: '4px 0 0' },
  shareLocationButton: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  liveToggle: {
    display: 'flex',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '4px',
    gap: '4px',
  },
  liveToggleButton: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#6E7681',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  liveToggleActive: {
    background: 'rgba(201,169,98,0.15)',
    color: '#C9A962',
  },
  mapView: {
    height: '340px',
    background: 'linear-gradient(180deg, #1a2e1a 0%, #0d1f1a 50%, #1a1a2e 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.15)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  mapMarker: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px 6px 6px',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  mapMarkerAvatar: { fontSize: '18px' },
  mapMarkerInfo: { display: 'flex', flexDirection: 'column' },
  mapMarkerName: { fontSize: '11px', fontWeight: '600', color: '#0D0D0D' },
  mapMarkerSpeed: { fontSize: '9px', color: 'rgba(0,0,0,0.7)' },
  mapControls: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mapControlButton: {
    width: '32px',
    height: '32px',
    background: 'rgba(26,26,26,0.9)',
    border: '1px solid rgba(201,169,98,0.2)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '16px',
    cursor: 'pointer',
  },
  mapQuickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  mapActionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 8px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(201,169,98,0.15)',
    borderRadius: '10px',
    color: '#E6EDF3',
    fontSize: '10px',
    cursor: 'pointer',
  },
  chatContainer: { display: 'flex', flexDirection: 'column', height: '450px' },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '12px',
  },
  chatMessage: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)',
  },
  chatMessageSOS: {
    background: 'rgba(181,101,101,0.15)',
    border: '1px solid rgba(181,101,101,0.3)',
  },
  chatAvatar: { fontSize: '24px', flexShrink: 0 },
  chatBubble: { flex: 1 },
  chatBubbleHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  chatSender: { fontSize: '12px', fontWeight: '600', color: '#C9A962' },
  chatTime: { fontSize: '10px', color: '#6E7681' },
  chatText: { fontSize: '13px', margin: 0, lineHeight: '1.4', color: '#C9D1D9' },
  quickMessagesRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  quickMessageButton: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,169,98,0.15)',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  chatInputContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  chatAttachButton: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,169,98,0.15)',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  chatInput: {
    flex: 1,
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,169,98,0.15)',
    borderRadius: '10px',
    color: '#E6EDF3',
    fontSize: '14px',
    outline: 'none',
  },
  chatSendButton: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0D0D0D',
    fontSize: '16px',
    cursor: 'pointer',
  },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  locationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
  },
  locationAvatar: { fontSize: '28px' },
  locationInfo: { flex: 1 },
  locationName: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '2px' },
  locationStatus: { display: 'block', fontSize: '11px', color: '#8B949E' },
  locationRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  batteryContainer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' },
  batteryBar: {
    width: '40px',
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  batteryLevel: { height: '100%', borderRadius: '4px' },
  batteryText: { fontSize: '9px', color: '#6E7681' },
  navigateButton: {
    width: '36px',
    height: '36px',
    background: 'rgba(201,169,98,0.1)',
    border: '1px solid rgba(201,169,98,0.2)',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  groupStats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '16px',
    background: 'rgba(201,169,98,0.05)',
    borderRadius: '12px',
    marginTop: '8px',
  },
  groupStat: { textAlign: 'center' },
  groupStatValue: { display: 'block', fontSize: '18px', fontWeight: '300', color: '#C9A962', fontFamily: "'Playfair Display', Georgia, serif" },
  groupStatLabel: { display: 'block', fontSize: '9px', color: '#6E7681', textTransform: 'uppercase', letterSpacing: '0.5px' },
};

export default LiveScreen;
