import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { shared } from '../styles/shared.js';

const condLabelMap = {
  freshSnow: 'Fresh Snow', baseDepth: 'Base Depth', snowpack: 'Snowpack', avalanche: 'Avalanche',
  temperature: 'Temperature', waterTemp: 'Water Temp', flowRate: 'Flow Rate', clarity: 'Clarity',
  hatches: 'Hatches', fishActivity: 'Fish Activity', waterLevel: 'Water Level', waveHeight: 'Wave Height',
  windSpeed: 'Wind', trailConditions: 'Trail', snowLine: 'Snow Line', crowdLevel: 'Crowds',
  courseConditions: 'Course', gameActivity: 'Game', season: 'Season', nighttimeLow: 'Overnight Low',
  campgroundStatus: 'Campground', fireBan: 'Fire Ban', bugLevel: 'Bugs', dustLevel: 'Dust',
  difficulty: 'Difficulty', conditions: 'Conditions', bestTime: 'Best Time', availability: 'Availability',
  moonPhase: 'Moon', terrain: 'Terrain', greenFees: 'Green Fees', teeTimeAvail: 'Tee Times',
  tagInfo: 'Tags', sunrise: 'Sunrise/Sunset', peakTimes: 'Peak Times', specialOffers: 'Specials',
};
const longCondFields = ['forecast', 'specialNotes', 'trailStatus', 'regulations', 'launchAccess'];

const TripDetail = ({ trip }) => {
  const { setSelectedTrip } = useApp();
  const pd = trip.planData;

  return (
    <div style={shared.modalOverlay} onClick={() => setSelectedTrip(null)}>
      <div style={styles.tripDetailModal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.tripDetailHeader}>
          <div style={styles.tripDetailCover}>{trip.coverPhoto}</div>
          <div>
            <span style={styles.tripDetailActivity}>{trip.activity} {trip.activityName}</span>
            <h2 style={styles.tripDetailName}>{trip.name}</h2>
            <p style={styles.tripDetailLocation}>{trip.location}</p>
            <p style={styles.tripDetailDate}>{trip.date}</p>
          </div>
        </div>

        {/* Attendees */}
        <div style={styles.tripDetailSection}>
          <h3 style={styles.tripDetailSectionTitle}>Crew</h3>
          <div style={styles.tripDetailAttendees}>
            {trip.attendees.map((name, idx) => (
              <span key={idx} style={styles.tripDetailAttendee}>{name}</span>
            ))}
          </div>
        </div>

        {/* AI PLAN DATA: Conditions */}
        {pd?.conditions && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Conditions</h3>
            <div style={styles.tdCondGrid}>
              {Object.entries(pd.conditions).filter(([k, v]) => v && !longCondFields.includes(k)).map(([key, val]) => (
                <div key={key} style={styles.tdCondItem}>
                  <span style={styles.tdCondLabel}>{condLabelMap[key] || key.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{
                    ...styles.tdCondValue,
                    ...(key === 'avalanche' ? { color: val === 'Low' ? '#6BCB77' : val === 'Moderate' ? '#FFD93D' : val === 'Considerable' ? '#E8853D' : '#B56565' } : {})
                  }}>{val}</span>
                </div>
              ))}
            </div>
            {pd.conditions.forecast && <p style={styles.tdCondExtra}>🌤️ {pd.conditions.forecast}</p>}
            {pd.conditions.trailStatus && <p style={styles.tdCondExtra}>🥾 Trail: {pd.conditions.trailStatus}</p>}
            {pd.conditions.regulations && <p style={styles.tdCondExtra}>📋 {pd.conditions.regulations}</p>}
            {pd.conditions.specialNotes && <p style={{...styles.tdCondExtra, color: '#C9A962'}}>💡 {pd.conditions.specialNotes}</p>}
          </div>
        )}

        {/* AI PLAN DATA: Travel */}
        {pd?.travel && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Getting There</h3>
            <div style={styles.tdInfoRows}>
              <div style={styles.tdInfoRow}><span>Drive Time</span><strong>{pd.travel.driveTime}</strong></div>
              <div style={styles.tdInfoRow}><span>Distance</span><strong>{pd.travel.distance}</strong></div>
              <div style={styles.tdInfoRow}><span>Gas</span><strong>{pd.travel.gasEstimate}</strong></div>
            </div>
            {pd.travel.routeNotes && <p style={styles.tdCondExtra}>🛣️ {pd.travel.routeNotes}</p>}
            {pd.travel.memberDriveTimes?.length > 0 && (
              <div style={{marginTop: '10px', borderTop: '1px solid rgba(201,169,98,0.15)', paddingTop: '8px'}}>
                <div style={{fontSize: '10px', color: '#8B949E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Individual Drive Times</div>
                {pd.travel.memberDriveTimes.map((m, idx) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '11px'}}>
                    <span style={{color: '#C9D1D9'}}>{m.name} <span style={{color: '#6E7681'}}>from {m.from}</span></span>
                    <strong style={{color: '#C9A962'}}>{m.driveTime}</strong>
                  </div>
                ))}
              </div>
            )}
            {pd.flights && (
              <div style={{marginTop: '10px', borderTop: '1px solid rgba(201,169,98,0.15)', paddingTop: '8px'}}>
                <div style={{fontSize: '10px', color: '#8B949E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>✈️ Flight Estimates</div>
                {pd.flights.nearestAirport && (
                  <div style={{fontSize: '11px', color: '#C9D1D9', marginBottom: '4px'}}>Nearest airport: <strong style={{color: '#C9A962'}}>{pd.flights.nearestAirport}</strong></div>
                )}
                {pd.flights.memberFlights?.map((f, idx) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '11px'}}>
                    <span style={{color: '#C9D1D9'}}>{f.name} <span style={{color: '#6E7681'}}>({f.airport})</span></span>
                    <strong style={{color: '#C9A962'}}>{f.estimatedCost}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI PLAN DATA: Where to Stay */}
        {pd?.lodging?.length > 0 && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Where to Stay</h3>
            {pd.lodging.map((lodge, idx) => (
              <div key={idx} style={styles.tdLodgeCard}>
                <div style={styles.tdLodgeTop}>
                  <span style={styles.tdLodgeName}>{lodge.name}</span>
                  <span style={styles.tdLodgePrice}>${lodge.pricePerNight}<span style={{fontSize:'10px', color:'#6E7681'}}>/night</span></span>
                </div>
                {lodge.type && <span style={styles.tdLodgeType}>{lodge.type}</span>}
                {lodge.rating && <div style={{fontSize:'11px', color:'#8B949E', margin:'2px 0'}}>{'⭐'.repeat(Math.min(Math.round(lodge.rating), 5))} {lodge.rating}</div>}
                <p style={styles.tdLodgeDesc}>{lodge.highlights}</p>
                {lodge.bookingNote && <p style={styles.tdLodgeBooking}>💡 {lodge.bookingNote}</p>}
              </div>
            ))}
          </div>
        )}

        {/* AI PLAN DATA: Where to Eat */}
        {pd?.dining?.length > 0 && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Where to Eat</h3>
            {pd.dining.map((place, idx) => (
              <div key={idx} style={styles.tdDiningRow}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={styles.tdDiningName}>{place.name}</span>
                  <span style={styles.tdDiningPrice}>{place.priceRange}</span>
                </div>
                <p style={styles.tdDiningNote}>{place.type} · {place.note}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI PLAN DATA: Activities */}
        {pd?.activities?.length > 0 && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Things to Do</h3>
            {pd.activities.map((act, idx) => (
              <div key={idx} style={styles.tdActivityRow}>
                <span style={styles.tdActivityName}>{act.name}</span>
                <p style={styles.tdActivityDesc}>{act.description}</p>
                {act.cost && <span style={styles.tdActivityCost}>{act.cost}</span>}
              </div>
            ))}
          </div>
        )}

        {/* AI PLAN DATA: Rentals */}
        {pd?.rentals?.available && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Rentals & Gear</h3>
            <div style={styles.tdInfoRows}>
              <div style={styles.tdInfoRow}><span>Provider</span><strong>{pd.rentals.provider}</strong></div>
              <div style={styles.tdInfoRow}><span>Price</span><strong>${pd.rentals.pricePerDay}/day</strong></div>
            </div>
            {pd.rentals.notes && <p style={styles.tdCondExtra}>📋 {pd.rentals.notes}</p>}
          </div>
        )}

        {/* AI PLAN DATA: Cost Breakdown */}
        {pd?.costs && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Cost Breakdown</h3>
            <div style={styles.tdCostList}>
              {pd.costs.lodging > 0 && <div style={styles.tdCostRow}><span>Lodging ({pd.costs.nights || 2} nights)</span><span>${pd.costs.lodging}</span></div>}
              {pd.costs.gas > 0 && <div style={styles.tdCostRow}><span>Gas</span><span>${pd.costs.gas}</span></div>}
              {pd.costs.permits > 0 && <div style={styles.tdCostRow}><span>Permits</span><span>${pd.costs.permits}</span></div>}
              {pd.costs.rentals > 0 && <div style={styles.tdCostRow}><span>Rentals</span><span>${pd.costs.rentals}</span></div>}
              {pd.costs.food > 0 && <div style={styles.tdCostRow}><span>Food & drinks</span><span>${pd.costs.food}</span></div>}
              <div style={{borderTop:'1px solid rgba(201,169,98,0.2)', margin:'8px 0'}} />
              <div style={{...styles.tdCostRow, fontWeight:'600', color:'#ECEDEE'}}><span>Total (group)</span><span>${pd.costs.total}</span></div>
              <div style={{...styles.tdCostRow, color:'#C9A962', fontWeight:'700', fontSize:'15px'}}><span>Per person</span><span>${pd.costs.perPerson}</span></div>
            </div>
          </div>
        )}

        {/* AI PLAN DATA: Permits */}
        {pd?.permits?.required && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Permits Required</h3>
            <p style={styles.tdCondExtra}>📋 {pd.permits.details}</p>
            {pd.permits.cost > 0 && <p style={{fontSize:'12px', color:'#C9A962', marginTop:'4px'}}>Cost: ${pd.permits.cost}</p>}
          </div>
        )}

        {/* AI PLAN DATA: Packing List */}
        {pd?.packingList?.length > 0 && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Packing List</h3>
            <div style={styles.tdPackingGrid}>
              {pd.packingList.map((item, idx) => (
                <div key={idx} style={styles.tdPackingItem}>
                  <span style={{color:'#C9A962', marginRight:'6px'}}>○</span>
                  <span style={{fontSize:'12px', color:'#C9D1D9'}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlights (for non-AI trips) */}
        {(!pd && trip.highlights.length > 0) && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Highlights</h3>
            <ul style={styles.tripDetailHighlights}>
              {trip.highlights.map((h, idx) => (
                <li key={idx} style={styles.tripDetailHighlight}>• {h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {trip.awards.length > 0 && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Awards Given</h3>
            <div style={styles.tripDetailAwards}>
              {trip.awards.map((a, idx) => (
                <div key={idx} style={styles.tripDetailAward}>
                  <span style={styles.tripDetailAwardIcon}>{a.award}</span>
                  <div>
                    <span style={styles.tripDetailAwardName}>{a.name}</span>
                    <span style={styles.tripDetailAwardRecipient}>→ {a.recipient}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {trip.photos.length > 0 && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Photos</h3>
            <div style={styles.tripDetailPhotos}>
              {trip.photos.map((photo) => (
                <div key={photo.id} style={styles.tripDetailPhoto}>
                  <span style={styles.tripDetailPhotoEmoji}>{photo.emoji}</span>
                  <span style={styles.tripDetailPhotoCaption}>{photo.caption}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={styles.tripDetailSection}>
          <h3 style={styles.tripDetailSectionTitle}>Trip Stats</h3>
          <div style={styles.tripDetailStats}>
            {Object.entries(trip.stats).map(([key, value]) => (
              <div key={key} style={styles.tripDetailStat}>
                <span style={styles.tripDetailStatValue}>{value}</span>
                <span style={styles.tripDetailStatLabel}>{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {trip.tripNotes && !pd && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Trip Notes</h3>
            <p style={styles.tripDetailNotes}>{trip.tripNotes}</p>
          </div>
        )}

        <button style={shared.closeButton} onClick={() => setSelectedTrip(null)}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  tripDetailModal: {
    width: '100%',
    maxWidth: '400px',
    maxHeight: '85vh',
    background: '#1A1A1A',
    borderRadius: '16px',
    border: '1px solid rgba(201,169,98,0.2)',
    overflowY: 'auto',
  },
  tripDetailHeader: {
    position: 'relative',
    padding: '24px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  },
  tripDetailCover: { fontSize: '48px', marginBottom: '12px' },
  tripDetailActivity: { fontSize: '12px', color: '#C9A962' },
  tripDetailName: { fontSize: '22px', fontWeight: '300', margin: '4px 0', fontFamily: "'Playfair Display', Georgia, serif" },
  tripDetailLocation: { fontSize: '13px', color: '#8B949E', margin: '0 0 2px' },
  tripDetailDate: { fontSize: '12px', color: '#6E7681', margin: 0 },
  tripDetailSection: { padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  tripDetailSectionTitle: { fontSize: '11px', color: '#C9A962', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px' },
  tripDetailAttendees: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tripDetailAttendee: { padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '12px' },
  tripDetailHighlights: { margin: 0, padding: 0, listStyle: 'none' },
  tripDetailHighlight: { fontSize: '13px', color: '#C9D1D9', marginBottom: '6px' },
  tripDetailAwards: { display: 'flex', flexDirection: 'column', gap: '8px' },
  tripDetailAward: { display: 'flex', alignItems: 'center', gap: '10px' },
  tripDetailAwardIcon: { fontSize: '24px' },
  tripDetailAwardName: { display: 'block', fontSize: '13px', fontWeight: '500' },
  tripDetailAwardRecipient: { display: 'block', fontSize: '11px', color: '#C9A962' },
  tripDetailPhotos: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  tripDetailPhoto: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '12px 8px',
    textAlign: 'center',
  },
  tripDetailPhotoEmoji: { fontSize: '28px', display: 'block', marginBottom: '4px' },
  tripDetailPhotoCaption: { fontSize: '9px', color: '#6E7681', lineHeight: '1.3' },
  tripDetailStats: { display: 'flex', justifyContent: 'space-around' },
  tripDetailStat: { textAlign: 'center' },
  tripDetailStatValue: { display: 'block', fontSize: '18px', fontWeight: '300', color: '#C9A962', fontFamily: "'Playfair Display', Georgia, serif" },
  tripDetailStatLabel: { display: 'block', fontSize: '10px', color: '#6E7681', textTransform: 'capitalize' },
  tripDetailNotes: { fontSize: '13px', color: '#8B949E', lineHeight: '1.5', fontStyle: 'italic', margin: 0 },

  // AI Plan Data styles
  tdCondGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' },
  tdCondItem: { background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px 10px' },
  tdCondLabel: { display: 'block', fontSize: '10px', color: '#6E7681', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' },
  tdCondValue: { display: 'block', fontSize: '13px', color: '#ECEDEE', fontWeight: '500' },
  tdCondExtra: { fontSize: '12px', color: '#8B949E', lineHeight: '1.5', margin: '6px 0 0' },
  tdInfoRows: { display: 'flex', flexDirection: 'column', gap: '6px' },
  tdInfoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#8B949E', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  tdLodgeCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.05)' },
  tdLodgeTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  tdLodgeName: { fontSize: '14px', fontWeight: '600', color: '#ECEDEE' },
  tdLodgePrice: { fontSize: '14px', fontWeight: '600', color: '#C9A962' },
  tdLodgeType: { display: 'inline-block', fontSize: '10px', color: '#8B949E', background: 'rgba(201,169,98,0.1)', padding: '2px 6px', borderRadius: '4px', margin: '4px 0' },
  tdLodgeDesc: { fontSize: '12px', color: '#8B949E', lineHeight: '1.4', margin: '4px 0 0' },
  tdLodgeBooking: { fontSize: '11px', color: '#C9A962', margin: '4px 0 0', fontStyle: 'italic' },
  tdDiningRow: { padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  tdDiningName: { fontSize: '13px', fontWeight: '600', color: '#ECEDEE' },
  tdDiningPrice: { fontSize: '12px', color: '#C9A962', fontWeight: '500' },
  tdDiningNote: { fontSize: '11px', color: '#8B949E', margin: '2px 0 0' },
  tdActivityRow: { padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  tdActivityName: { fontSize: '13px', fontWeight: '600', color: '#ECEDEE' },
  tdActivityDesc: { fontSize: '11px', color: '#8B949E', margin: '2px 0 0', lineHeight: '1.4' },
  tdActivityCost: { fontSize: '11px', color: '#C9A962', fontWeight: '500' },
  tdCostList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  tdCostRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#8B949E', padding: '2px 0' },
  tdPackingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' },
  tdPackingItem: { display: 'flex', alignItems: 'flex-start', padding: '4px 0' },
};

export default TripDetail;
