import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { activities, activityCategories, getActivityGroups } from '../data/activities.js';
import { planTrip } from '../services/claude.js';
import { shared } from '../styles/shared.js';

const PlanScreen = () => {
  const {
    currentCrew, activeCrew,
    tripActivity, setTripActivity,
    activityFilter, setActivityFilter,
    planStep, setPlanStep,
    planDates, setPlanDates,
    planRegion, setPlanRegion,
    planBudget, setPlanBudget,
    planResults, setPlanResults,
    selectedPlanOption, setSelectedPlanOption,
    planError, setPlanError,
    loadingMessage, setLoadingMessage,
    tripCreated, setTripCreated,
    previousDestinations, setPreviousDestinations,
    allTrips, setAllTrips,
    setActiveTab,
  } = useApp();

  // Group activities by category
  const activityGroups = getActivityGroups();

  const displayGroups = activityFilter === 'all'
    ? activityGroups
    : activityGroups.filter(g => g.id === activityFilter);

  const regions = [
    { id: 'utah', label: 'Utah', icon: '\u{1F3D4}\uFE0F' },
    { id: 'wyoming', label: 'Wyoming', icon: '\u{1F9AC}' },
    { id: 'idaho', label: 'Idaho', icon: '\u{1F332}' },
    { id: 'colorado', label: 'Colorado', icon: '\u26F0\uFE0F' },
    { id: 'anywhere', label: 'Anywhere < 6hrs', icon: '\u{1F5FA}\uFE0F' },
  ];

  const budgetOptions = [
    { id: 'budget', label: 'Budget', range: '$50-100/person', icon: '\u{1F4B5}' },
    { id: 'moderate', label: 'Moderate', range: '$100-250/person', icon: '\u{1F4B0}' },
    { id: 'premium', label: 'Premium', range: '$250-500/person', icon: '\u{1F48E}' },
    { id: 'nolimit', label: 'No Limit', range: "Sky's the limit", icon: '\u{1F942}' },
  ];

  const getDateLabel = () => {
    const now = new Date();
    const day = now.getDay();
    const offset = planDates === 'next_weekend' ? 7 : 0;
    const daysUntilFri = ((5 - day + 7) % 7 || 7) + offset;
    const fri = new Date(now);
    fri.setDate(now.getDate() + daysUntilFri);
    const sun = new Date(fri);
    sun.setDate(fri.getDate() + 2);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fmtY = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return planDates === 'custom' ? 'Flexible Dates' : `${fmt(fri)} - ${fmtY(sun)}`;
  };

  const handleFindOptions = async () => {
    setPlanStep('loading');
    setPlanError('');
    setTripCreated(false);

    const messages = [
      'Searching current conditions...',
      'Checking weather forecasts...',
      'Finding the best lodging & Airbnbs...',
      'Scouting restaurants and bars...',
      `Calculating drive times from ${currentCrew.homeBase || 'SLC'}...`,
      'Comparing destinations...',
      'Building cost breakdowns...',
      'Finding nearby activities...',
      'Finalizing recommendations...',
      'Almost there...',
    ];

    let msgIdx = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 3000);

    try {
      const result = await planTrip({
        activity: tripActivity,
        dates: planDates,
        region: planRegion || 'anywhere',
        budget: planBudget,
        groupSize: currentCrew.members.length,
        crewName: currentCrew.name,
        excludeDestinations: previousDestinations,
        homeBase: currentCrew.homeBase,
        memberLocations: currentCrew.members.map(m => ({
          name: m.name,
          city: m.city,
          airport: m.airport,
        })),
      });
      // Track these destinations so Redo gives different ones
      const newDests = (result.options || []).map(o => o.destination).filter(Boolean);
      setPreviousDestinations(prev => [...prev, ...newDests]);
      setPlanResults(result);
      setPlanStep('results');
    } catch (err) {
      setPlanError(err.message || 'Failed to get recommendations. Please try again.');
      setPlanStep('configure');
    } finally {
      clearInterval(interval);
    }
  };

  const handleCreateTrip = (option) => {
    const activityObj = activities.find(a => a.label === tripActivity);
    const newTrip = {
      id: `trip-${Date.now()}`,
      crewId: activeCrew,
      name: `${option.destination.split(',')[0]} Trip`,
      date: getDateLabel(),
      year: new Date().getFullYear(),
      activity: activityObj?.icon || '\u{1F3AF}',
      activityName: tripActivity,
      location: option.destination,
      coverPhoto: activityObj?.icon || '\u{1F3AF}',
      attendees: currentCrew.members.map(m => m.name),
      highlights: [option.tagline],
      awards: [],
      photos: [],
      stats: { estimatedCost: `$${option.costs?.perPerson || 0}/person`, driveTime: option.travel?.driveTime || '' },
      tripNotes: `AI-planned ${tripActivity} trip. ${option.tagline}`,
      // Full AI plan data so the crew can reference everything during the trip
      planData: {
        conditions: option.conditions || null,
        travel: option.travel || null,
        lodging: option.lodging || [],
        dining: option.dining || [],
        rentals: option.rentals || null,
        costs: option.costs || null,
        permits: option.permits || null,
        packingList: option.packingList || [],
        activities: option.activities || [],
        flights: option.flights || null,
        tagline: option.tagline,
        type: option.type,
      },
    };
    setAllTrips(prev => [newTrip, ...prev]);
    setTripCreated(true);
  };

  const handleReset = () => {
    setPlanStep('activity');
    setTripActivity('');
    setPlanResults(null);
    setSelectedPlanOption(null);
    setPlanError('');
    setTripCreated(false);
    setPreviousDestinations([]);
  };

  const handleBack = () => {
    if (planStep === 'detail') {
      setSelectedPlanOption(null);
      setPlanStep('results');
    } else if (planStep === 'results') {
      setPlanStep('configure');
    }
  };

  const optionIcon = (type) => type === 'best_conditions' ? '\u{1F3AF}' : type === 'closest' ? '\u{1F4CD}' : '\u{1F4B0}';
  const optionLabel = (type) => type === 'best_conditions' ? 'Best Conditions' : type === 'closest' ? 'Closest' : 'Best Value';

  return (
    <div style={shared.screen}>
      {/* ============================================ */}
      {/* STEP: Activity Selection + Configure         */}
      {/* ============================================ */}
      {(planStep === 'activity' || planStep === 'configure') && (
        <>
          <div style={styles.planHeader}>
            <h1 style={styles.planTitle}>Plan Trip</h1>
            <p style={styles.planSubtitle}>Choose an activity for {currentCrew.name}</p>
          </div>

          {/* When activity is selected, show compact bar instead of full grid */}
          {tripActivity ? (
            <div style={styles.selectedActivityBar}>
              <div style={styles.selectedActivityInfo}>
                <span style={{fontSize: '24px'}}>{activities.find(a => a.label === tripActivity)?.icon || '\u{1F3AF}'}</span>
                <div>
                  <span style={styles.selectedActivityName}>{tripActivity}</span>
                  <span style={styles.selectedActivitySub}>for {currentCrew.name}</span>
                </div>
              </div>
              <button
                style={styles.changeActivityBtn}
                onClick={() => { setTripActivity(''); setPlanStep('activity'); }}
              >
                Change
              </button>
            </div>
          ) : (
            <>
              <div style={shared.categoryTabs}>
                {activityCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActivityFilter(cat.id)}
                    style={{ ...shared.categoryTab, ...(activityFilter === cat.id ? shared.categoryTabActive : {}) }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div style={styles.activityGroups}>
                {displayGroups.map(group => (
                  <div key={group.id} style={styles.activityGroup}>
                    <div style={styles.activityGroupHeader}>
                      <span style={styles.activityGroupIcon}>{group.icon}</span>
                      <span style={styles.activityGroupLabel}>{group.label}</span>
                    </div>
                    <div style={styles.activityGroupGrid}>
                      {group.activities.map(act => (
                        <button
                          key={act.id}
                          onClick={() => { setTripActivity(act.label); setPlanStep('configure'); }}
                          style={{ ...styles.activityButton, ...(tripActivity === act.label ? styles.activityButtonActive : {}) }}
                        >
                          <span style={styles.activityIconLarge}>{act.icon}</span>
                          <span style={styles.activityLabel}>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* AI Configure Section */}
          {tripActivity && (
            <div style={styles.aiSection}>
              <div style={styles.aiHeader}>
                <span>{'\u{1F916}'}</span><span>AI Trip Assistant</span>
              </div>
              <div style={styles.aiPrompt}>
                <p style={styles.aiQuestion}>
                  Planning a <strong style={{color: '#C9A962'}}>{tripActivity}</strong> trip for <strong style={{color: '#C9A962'}}>{currentCrew.name}</strong>
                </p>

                {/* Date Selection */}
                <div style={shared.configLabel}>When are you going?</div>
                <div style={styles.dateButtons}>
                  {[
                    { id: 'this_weekend', label: 'This Weekend' },
                    { id: 'next_weekend', label: 'Next Weekend' },
                    { id: 'custom', label: 'Pick Dates' },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setPlanDates(d.id)}
                      style={{ ...styles.dateButton, ...(planDates === d.id ? styles.dateButtonActive : {}) }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Region Selection */}
                <div style={shared.configLabel}>Where do you want to go?</div>
                <div style={styles.regionGrid}>
                  {regions.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setPlanRegion(r.id)}
                      style={{ ...styles.regionButton, ...(planRegion === r.id ? styles.regionButtonActive : {}) }}
                    >
                      <span style={{fontSize: '16px'}}>{r.icon}</span>
                      <span style={{fontSize: '11px'}}>{r.label}</span>
                    </button>
                  ))}
                </div>

                {/* Budget Selection */}
                <div style={shared.configLabel}>Budget per person</div>
                <div style={styles.budgetGrid}>
                  {budgetOptions.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setPlanBudget(b.id)}
                      style={{ ...styles.budgetButton, ...(planBudget === b.id ? styles.budgetButtonActive : {}) }}
                    >
                      <span style={{fontSize: '14px'}}>{b.icon}</span>
                      <span style={{fontSize: '11px', fontWeight: '600'}}>{b.label}</span>
                      <span style={{fontSize: '9px', color: '#6E7681'}}>{b.range}</span>
                    </button>
                  ))}
                </div>

                {/* Group Size */}
                <div style={shared.configRow}>
                  <span style={shared.configLabel}>Group size</span>
                  <span style={shared.groupSizeValue}>{'\u{1F465}'} {currentCrew.members.length} people</span>
                </div>

                {/* Driving From */}
                <div style={shared.configRow}>
                  <span style={shared.configLabel}>Driving from</span>
                  <span style={shared.groupSizeValue}>{'\u{1F4CD}'} {currentCrew.homeBase || 'Salt Lake City, UT'}</span>
                </div>

                {planError && (
                  <div style={shared.errorBanner}>
                    <span>{'\u26A0\uFE0F'}</span>
                    <span>{planError}</span>
                  </div>
                )}

                <button
                  style={{ ...styles.aiButton, opacity: planDates ? 1 : 0.5 }}
                  onClick={planDates ? handleFindOptions : undefined}
                >
                  {'\u{1F50D}'} Find Best Options
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* STEP: Loading                                */}
      {/* ============================================ */}
      {planStep === 'loading' && (
        <>
          <style>{`
            @keyframes plannerPulse {
              0%, 100% { opacity: 0.3; transform: scale(0.85); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            @keyframes plannerFade {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
          `}</style>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingGlow} />
            <div style={styles.loadingIconWrap}>
              <span style={styles.loadingIcon}>{'\u{1F916}'}</span>
            </div>
            <h2 style={styles.loadingTitle}>AI Trip Planner</h2>
            <p style={styles.loadingSubtitle}>
              Finding the perfect <span style={{color: '#C9A962'}}>{tripActivity.toLowerCase()}</span> trip for {currentCrew.name}
            </p>
            <div style={styles.loadingDots}>
              <span style={{...styles.loadingDot, animation: 'plannerPulse 1.4s infinite ease-in-out'}} />
              <span style={{...styles.loadingDot, animation: 'plannerPulse 1.4s 0.2s infinite ease-in-out'}} />
              <span style={{...styles.loadingDot, animation: 'plannerPulse 1.4s 0.4s infinite ease-in-out'}} />
            </div>
            <p style={{...styles.loadingMsg, animation: 'plannerFade 3s infinite ease-in-out'}}>{loadingMessage}</p>
            <div style={styles.loadingSteps}>
              {['\u{1F50D} Conditions', '\u{1F324}\uFE0F Weather', '\u{1F3E8} Lodging', '\u{1F697} Routes', '\u{1F4B0} Costs'].map((step, idx) => (
                <div key={idx} style={styles.loadingStepItem}>
                  <span style={{fontSize: '12px'}}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* STEP: Results - 3 Options                    */}
      {/* ============================================ */}
      {planStep === 'results' && planResults && (
        <div>
          <div style={styles.resultsHeader}>
            <button style={styles.backButton} onClick={handleBack}>{'\u2190'} Back</button>
            <div>
              <h1 style={styles.resultsTitle}>Recommendations</h1>
              <p style={styles.resultsSubtitle}>
                {tripActivity} {'\u00B7'} {currentCrew.name} {'\u00B7'} {getDateLabel()}
              </p>
            </div>
          </div>

          <div style={styles.resultsCards}>
            {planResults.options.map((option, idx) => (
              <button
                key={idx}
                style={styles.resultCard}
                onClick={() => { setSelectedPlanOption(option); setPlanStep('detail'); }}
              >
                <div style={styles.resultBadge}>
                  <span>{optionIcon(option.type)}</span>
                  <span style={styles.resultBadgeText}>{option.label || optionLabel(option.type)}</span>
                </div>
                <h3 style={styles.resultName}>{option.destination}</h3>
                <p style={styles.resultTagline}>{option.tagline}</p>

                <div style={styles.resultMetaRow}>
                  <span style={styles.resultMeta}>{'\u{1F697}'} {option.travel?.driveTime}</span>
                  <span style={styles.resultMeta}>{'\u{1F4B0}'} ${option.costs?.perPerson}/person</span>
                </div>

                {option.conditions && (
                  <div style={styles.resultCondRow}>
                    {(() => {
                      // Show the 2 most relevant condition fields as preview
                      const skip = ['forecast', 'specialNotes', 'trailStatus'];
                      const entries = Object.entries(option.conditions).filter(([k, v]) => v && !skip.includes(k));
                      const condIcons = { freshSnow: '\u2744\uFE0F', baseDepth: '\u{1F4CF}', snowpack: '\u{1F3D4}\uFE0F', avalanche: '\u26A0\uFE0F', temperature: '\u{1F321}\uFE0F',
                        waterTemp: '\u{1F30A}', flowRate: '\u{1F4A7}', clarity: '\u{1F441}\uFE0F', hatches: '\u{1FAB0}', fishActivity: '\u{1F41F}',
                        waterLevel: '\u{1F4CA}', waveHeight: '\u{1F30A}', windSpeed: '\u{1F4A8}', trailConditions: '\u{1F97E}', snowLine: '\u26F0\uFE0F',
                        courseConditions: '\u26F3', gameActivity: '\u{1F98C}', season: '\u{1F4C5}', nighttimeLow: '\u{1F319}',
                        crowdLevel: '\u{1F465}', conditions: '\u{1F4CB}', bestTime: '\u23F0', bugLevel: '\u{1F99F}', dustLevel: '\u{1F4A8}',
                        campgroundStatus: '\u{1F3D5}\uFE0F', availability: '\u{1F4C5}', moonPhase: '\u{1F315}' };
                      return entries.slice(0, 2).map(([key, val]) => (
                        <span key={key} style={styles.resultCond}>{condIcons[key] || '\u{1F4CB}'} {val}</span>
                      ));
                    })()}
                  </div>
                )}

                <div style={styles.resultAction}>View Details {'\u2192'}</div>
              </button>
            ))}
          </div>

          {planResults.notes && (
            <div style={styles.aiNote}>
              <span style={{fontSize: '16px'}}>{'\u{1F4A1}'}</span>
              <p style={styles.aiNoteText}>{planResults.notes}</p>
            </div>
          )}

          <div style={styles.redoRow}>
            <button style={styles.redoButton} onClick={handleFindOptions}>
              {'\u{1F504}'} Redo Search
            </button>
            <button style={styles.resetButton} onClick={handleReset}>Start Over</button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STEP: Detail View                            */}
      {/* ============================================ */}
      {planStep === 'detail' && selectedPlanOption && (
        <div>
          <button style={styles.backButton} onClick={handleBack}>{'\u2190'} Back to Options</button>

          {/* Hero */}
          <div style={styles.detailHero}>
            <div style={styles.detailBadge}>
              {optionIcon(selectedPlanOption.type)} {selectedPlanOption.label || optionLabel(selectedPlanOption.type)}
            </div>
            <h1 style={styles.detailName}>{selectedPlanOption.destination}</h1>
            <p style={styles.detailTagline}>{selectedPlanOption.tagline}</p>
          </div>

          {/* Conditions - dynamically renders all fields from AI response */}
          {selectedPlanOption.conditions && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F4CA}'} CONDITIONS</h3>
              <div style={styles.condGrid}>
                {(() => {
                  const dangerFields = ['avalanche'];
                  const longFields = ['forecast', 'specialNotes', 'trailStatus', 'regulations', 'launchAccess'];
                  const labelMap = {
                    freshSnow: 'Fresh Snow', baseDepth: 'Base Depth', snowpack: 'Snowpack', avalanche: 'Avalanche',
                    temperature: 'Temperature', waterTemp: 'Water Temp', flowRate: 'Flow Rate', clarity: 'Clarity',
                    hatches: 'Hatches', fishActivity: 'Fish Activity', waterLevel: 'Water Level', waveHeight: 'Wave Height',
                    windSpeed: 'Wind', trailConditions: 'Trail Conditions', snowLine: 'Snow Line', sunrise: 'Sunrise/Sunset',
                    crowdLevel: 'Crowd Level', courseConditions: 'Course', greenFees: 'Green Fees', teeTimeAvail: 'Tee Times',
                    gameActivity: 'Game Activity', season: 'Season', terrain: 'Terrain', moonPhase: 'Moon Phase',
                    tagInfo: 'Tags/Licenses', nighttimeLow: 'Overnight Low', campgroundStatus: 'Campground', fireBan: 'Fire Ban',
                    bugLevel: 'Bug Level', dustLevel: 'Dust Level', difficulty: 'Difficulty', conditions: 'Conditions',
                    bestTime: 'Best Time', availability: 'Availability', peakTimes: 'Peak Times', specialOffers: 'Specials',
                  };
                  const entries = Object.entries(selectedPlanOption.conditions)
                    .filter(([k, v]) => v && !longFields.includes(k));
                  return entries.map(([key, val]) => (
                    <div key={key} style={styles.condItem}>
                      <span style={styles.condLabel}>{labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                      <span style={{
                        ...styles.condValue,
                        ...(dangerFields.includes(key) ? {
                          color: val === 'Low' ? '#6BCB77' : val === 'Moderate' ? '#FFD93D' :
                                 val === 'Considerable' ? '#E8853D' : val === 'High' ? '#B56565' : '#C9D1D9'
                        } : {})
                      }}>{val}</span>
                    </div>
                  ));
                })()}
              </div>
              {selectedPlanOption.conditions.forecast && (
                <p style={styles.condForecast}>{'\u{1F324}\uFE0F'} {selectedPlanOption.conditions.forecast}</p>
              )}
              {selectedPlanOption.conditions.trailStatus && (
                <p style={styles.condTrail}>Trail: {selectedPlanOption.conditions.trailStatus}</p>
              )}
              {selectedPlanOption.conditions.regulations && (
                <p style={styles.condTrail}>{'\u{1F4CB}'} {selectedPlanOption.conditions.regulations}</p>
              )}
              {selectedPlanOption.conditions.launchAccess && (
                <p style={styles.condTrail}>{'\u{1F6A4}'} {selectedPlanOption.conditions.launchAccess}</p>
              )}
              {selectedPlanOption.conditions.specialNotes && (
                <p style={styles.condNote}>{selectedPlanOption.conditions.specialNotes}</p>
              )}
            </div>
          )}

          {/* Travel */}
          <div style={styles.detailCard}>
            <h3 style={styles.detailCardTitle}>{'\u{1F697}'} TRAVEL</h3>
            <div style={styles.infoRows}>
              <div style={styles.infoRow}><span>Drive Time</span><strong>{selectedPlanOption.travel?.driveTime}</strong></div>
              <div style={styles.infoRow}><span>Distance</span><strong>{selectedPlanOption.travel?.distance}</strong></div>
              <div style={styles.infoRow}><span>Gas Estimate</span><strong>{selectedPlanOption.travel?.gasEstimate}</strong></div>
            </div>
            {selectedPlanOption.travel?.routeNotes && (
              <p style={styles.infoNote}>{selectedPlanOption.travel.routeNotes}</p>
            )}
            {selectedPlanOption.travel?.memberDriveTimes?.length > 0 && (
              <div style={{marginTop: '12px', borderTop: '1px solid rgba(201,169,98,0.15)', paddingTop: '10px'}}>
                <div style={{fontSize: '11px', color: '#8B949E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Individual Drive Times</div>
                {selectedPlanOption.travel.memberDriveTimes.map((m, idx) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px'}}>
                    <span style={{color: '#C9D1D9'}}>{m.name} <span style={{color: '#6E7681'}}>from {m.from}</span></span>
                    <strong style={{color: '#C9A962'}}>{m.driveTime}</strong>
                  </div>
                ))}
              </div>
            )}
            {selectedPlanOption.flights && (
              <div style={{marginTop: '12px', borderTop: '1px solid rgba(201,169,98,0.15)', paddingTop: '10px'}}>
                <div style={{fontSize: '11px', color: '#8B949E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{'\u2708\uFE0F'} Flight Estimates</div>
                {selectedPlanOption.flights.nearestAirport && (
                  <div style={{fontSize: '12px', color: '#C9D1D9', marginBottom: '6px'}}>Nearest airport: <strong style={{color: '#C9A962'}}>{selectedPlanOption.flights.nearestAirport}</strong></div>
                )}
                {selectedPlanOption.flights.estimatedRT && (
                  <div style={{fontSize: '12px', color: '#C9D1D9', marginBottom: '6px'}}>Estimated RT: <strong>{selectedPlanOption.flights.estimatedRT}</strong></div>
                )}
                {selectedPlanOption.flights.memberFlights?.map((f, idx) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px'}}>
                    <span style={{color: '#C9D1D9'}}>{f.name} <span style={{color: '#6E7681'}}>({f.airport})</span></span>
                    <strong style={{color: '#C9A962'}}>{f.estimatedCost}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lodging */}
          {selectedPlanOption.lodging && selectedPlanOption.lodging.length > 0 && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F3E8}'} LODGING OPTIONS</h3>
              <div style={styles.lodgingList}>
                {selectedPlanOption.lodging.map((lodge, idx) => (
                  <div key={idx} style={styles.lodgeCard}>
                    <div style={styles.lodgeTop}>
                      <span style={styles.lodgeName}>{lodge.name}</span>
                      <span style={styles.lodgePrice}>${lodge.pricePerNight}<span style={{fontSize: '10px', color: '#6E7681'}}>/night</span></span>
                    </div>
                    {lodge.rating && (
                      <div style={styles.lodgeRating}>{'\u2B50'.repeat(Math.min(Math.round(lodge.rating), 5))} <span style={{color: '#6E7681', fontSize: '11px'}}>{lodge.rating}</span></div>
                    )}
                    <p style={styles.lodgeHighlights}>{lodge.highlights}</p>
                    {lodge.bookingNote && <p style={styles.lodgeBooking}>{'\u{1F4A1}'} {lodge.bookingNote}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dining */}
          {selectedPlanOption.dining && selectedPlanOption.dining.length > 0 && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F37D}\uFE0F'} DINING</h3>
              {selectedPlanOption.dining.map((place, idx) => (
                <div key={idx} style={styles.diningRow}>
                  <div style={styles.diningTop}>
                    <span style={styles.diningName}>{place.name}</span>
                    <span style={styles.diningPrice}>{place.priceRange}</span>
                  </div>
                  <p style={styles.diningNote}>{place.type} {'\u00B7'} {place.note}</p>
                </div>
              ))}
            </div>
          )}

          {/* Rentals */}
          {selectedPlanOption.rentals?.available && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F3BF}'} RENTALS & GEAR</h3>
              <div style={styles.infoRows}>
                <div style={styles.infoRow}><span>Provider</span><strong>{selectedPlanOption.rentals.provider}</strong></div>
                <div style={styles.infoRow}><span>Price</span><strong>${selectedPlanOption.rentals.pricePerDay}/day</strong></div>
              </div>
              {selectedPlanOption.rentals.notes && <p style={styles.infoNote}>{selectedPlanOption.rentals.notes}</p>}
            </div>
          )}

          {/* Cost Breakdown */}
          {selectedPlanOption.costs && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F4B0}'} ESTIMATED COST</h3>
              <div style={styles.costList}>
                {selectedPlanOption.costs.lodging > 0 && <div style={styles.costRow}><span>Lodging ({selectedPlanOption.costs.nights || 2} nights)</span><span>${selectedPlanOption.costs.lodging}</span></div>}
                {selectedPlanOption.costs.gas > 0 && <div style={styles.costRow}><span>Gas (round trip)</span><span>${selectedPlanOption.costs.gas}</span></div>}
                {selectedPlanOption.costs.permits > 0 && <div style={styles.costRow}><span>Permits</span><span>${selectedPlanOption.costs.permits}</span></div>}
                {selectedPlanOption.costs.rentals > 0 && <div style={styles.costRow}><span>Rentals</span><span>${selectedPlanOption.costs.rentals}</span></div>}
                {selectedPlanOption.costs.food > 0 && <div style={styles.costRow}><span>Food & drinks</span><span>${selectedPlanOption.costs.food}</span></div>}
                <div style={styles.costDivider} />
                <div style={styles.costTotalRow}><span>Total (group)</span><span>${selectedPlanOption.costs.total}</span></div>
                <div style={styles.costPerPerson}>
                  <span>Per person ({currentCrew.members.length})</span>
                  <span style={styles.costPerPersonAmt}>${selectedPlanOption.costs.perPerson}</span>
                </div>
              </div>
            </div>
          )}

          {/* Permits */}
          {selectedPlanOption.permits?.required && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F4CB}'} PERMITS REQUIRED</h3>
              <p style={styles.infoNote}>{selectedPlanOption.permits.details}</p>
              {selectedPlanOption.permits.cost > 0 && (
                <p style={{...styles.condTrail, marginTop: '8px'}}>Cost: ${selectedPlanOption.permits.cost}</p>
              )}
            </div>
          )}

          {/* Packing List */}
          {selectedPlanOption.packingList && selectedPlanOption.packingList.length > 0 && (
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>{'\u{1F392}'} PACKING LIST</h3>
              <div style={styles.packingGrid}>
                {selectedPlanOption.packingList.map((item, idx) => (
                  <div key={idx} style={styles.packingItem}>
                    <span style={{color: '#C9A962', marginRight: '8px'}}>{'\u25CB'}</span>
                    <span style={{fontSize: '12px', color: '#C9D1D9'}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={styles.detailActions}>
            {!tripCreated ? (
              <>
                <button style={styles.createTripBtn} onClick={() => handleCreateTrip(selectedPlanOption)}>
                  {'\u{1F680}'} Create Trip
                </button>
                <div style={styles.redoRow}>
                  <button style={styles.digDeeperBtn} onClick={() => { setSelectedPlanOption(null); handleFindOptions(); }}>
                    {'\u{1F50D}'} Dig Deeper
                  </button>
                  <button style={styles.redoButton} onClick={() => { setSelectedPlanOption(null); handleFindOptions(); }}>
                    {'\u{1F504}'} Redo Search
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.tripCreatedBanner}>
                <span style={{fontSize: '24px'}}>{'\u2705'}</span>
                <div>
                  <strong style={{display: 'block', marginBottom: '4px'}}>Trip Created!</strong>
                  <span style={{fontSize: '12px', color: '#8B949E'}}>Added to {currentCrew.name}'s upcoming trips</span>
                </div>
              </div>
            )}
            {tripCreated && (
              <div style={{display: 'flex', gap: '8px'}}>
                <button style={styles.viewTripBtn} onClick={() => { setActiveTab('home'); handleReset(); }}>
                  {'\u{1F3E0}'} View on Home
                </button>
                <button style={styles.planAnotherBtn} onClick={handleReset}>
                  {'\u{1F5FA}\uFE0F'} Plan Another
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  // Plan Header
  planHeader: { textAlign: 'center', padding: '16px 0 16px' },
  planTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  planSubtitle: { fontSize: '12px', color: '#6E7681', margin: '8px 0 0', letterSpacing: '1px' },

  // Grouped Activities
  activityGroups: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '24px',
  },
  activityGroup: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.08)',
    overflow: 'hidden',
  },
  activityGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    background: 'rgba(201,169,98,0.06)',
    borderBottom: '1px solid rgba(201,169,98,0.08)',
  },
  activityGroupIcon: { fontSize: '16px' },
  activityGroupLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#C9A962',
    letterSpacing: '0.5px',
  },
  activityGroupGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '12px',
  },

  // Activity Buttons
  activityButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 6px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    color: '#E6EDF3',
    cursor: 'pointer',
  },
  activityButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
  },
  activityIconLarge: { fontSize: '22px' },
  activityLabel: { fontSize: '9px', textAlign: 'center', lineHeight: '1.2', color: '#8B949E' },

  // Selected Activity Bar
  selectedActivityBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: 'rgba(201,169,98,0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.2)',
    marginBottom: '16px',
  },
  selectedActivityInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  selectedActivityName: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: '#C9A962',
  },
  selectedActivitySub: {
    display: 'block',
    fontSize: '11px',
    color: '#8B949E',
  },
  changeActivityBtn: {
    padding: '8px 14px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // AI Section
  aiSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(201,169,98,0.1)',
    overflow: 'hidden',
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 16px',
    background: 'rgba(201,169,98,0.08)',
    fontSize: '13px',
    fontWeight: '500',
  },
  aiPrompt: { padding: '16px' },
  aiQuestion: { fontSize: '14px', marginBottom: '16px' },

  // Date Buttons
  dateButtons: { display: 'flex', gap: '8px', marginBottom: '16px' },
  dateButton: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#E6EDF3',
    fontSize: '12px',
    cursor: 'pointer',
  },
  dateButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },

  // Region Grid
  regionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
    marginBottom: '16px',
  },
  regionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 4px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#E6EDF3',
    cursor: 'pointer',
  },
  regionButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },

  // Budget Grid
  budgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
    marginBottom: '16px',
  },
  budgetButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '10px 4px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#E6EDF3',
    cursor: 'pointer',
  },
  budgetButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },

  // AI Button
  aiButton: {
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
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '24px',
    position: 'relative',
  },
  loadingGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(201,169,98,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  loadingIconWrap: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(201,169,98,0.1)',
    borderRadius: '20px',
    border: '1px solid rgba(201,169,98,0.2)',
    marginBottom: '20px',
    position: 'relative',
  },
  loadingIcon: { fontSize: '36px' },
  loadingTitle: {
    fontSize: '20px',
    fontWeight: '300',
    letterSpacing: '2px',
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: '0 0 8px',
  },
  loadingSubtitle: {
    fontSize: '13px',
    color: '#8B949E',
    margin: '0 0 24px',
  },
  loadingDots: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#C9A962',
  },
  loadingMsg: {
    fontSize: '13px',
    color: '#C9A962',
    margin: '0 0 28px',
    fontStyle: 'italic',
    fontFamily: "'Cormorant Garamond', serif",
  },
  loadingSteps: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loadingStepItem: {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(201,169,98,0.1)',
  },

  // Results
  resultsHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,169,98,0.2)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  resultsTitle: {
    fontSize: '22px',
    fontWeight: '300',
    letterSpacing: '1px',
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: '0 0 4px',
  },
  resultsSubtitle: {
    fontSize: '12px',
    color: '#8B949E',
    margin: 0,
  },
  resultsCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  resultCard: {
    width: '100%',
    padding: '18px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(201,169,98,0.15)',
    borderRadius: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    color: '#E6EDF3',
    transition: 'border-color 0.2s',
  },
  resultBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    background: 'rgba(201,169,98,0.12)',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  resultBadgeText: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#C9A962',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  resultName: {
    fontSize: '18px',
    fontWeight: '400',
    margin: '0 0 4px',
    fontFamily: "'Playfair Display', Georgia, serif",
    letterSpacing: '0.5px',
  },
  resultTagline: {
    fontSize: '12px',
    color: '#8B949E',
    margin: '0 0 12px',
    lineHeight: '1.4',
  },
  resultMetaRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '8px',
  },
  resultMeta: {
    fontSize: '12px',
    color: '#C9D1D9',
  },
  resultCondRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '10px',
  },
  resultCond: {
    fontSize: '11px',
    color: '#8B949E',
    padding: '3px 8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '4px',
  },
  resultAction: {
    fontSize: '12px',
    color: '#C9A962',
    fontWeight: '500',
    letterSpacing: '0.5px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(201,169,98,0.1)',
  },

  // AI Note
  aiNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '14px',
    background: 'rgba(201,169,98,0.06)',
    borderRadius: '10px',
    border: '1px solid rgba(201,169,98,0.1)',
    marginBottom: '12px',
  },
  aiNoteText: {
    fontSize: '12px',
    color: '#8B949E',
    margin: 0,
    lineHeight: '1.5',
    fontStyle: 'italic',
  },

  // Redo / Reset
  redoRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  redoButton: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.25)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  digDeeperBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(201,169,98,0.08)',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resetButton: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#6E7681',
    fontSize: '13px',
    cursor: 'pointer',
  },

  // Detail View - Hero
  detailHero: {
    textAlign: 'center',
    padding: '20px 0',
    marginBottom: '8px',
  },
  detailBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    background: 'rgba(201,169,98,0.12)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#C9A962',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  detailName: {
    fontSize: '26px',
    fontWeight: '300',
    letterSpacing: '1px',
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: '0 0 8px',
  },
  detailTagline: {
    fontSize: '13px',
    color: '#8B949E',
    margin: 0,
    fontStyle: 'italic',
    fontFamily: "'Cormorant Garamond', serif",
    lineHeight: '1.4',
  },

  // Detail Cards
  detailCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(201,169,98,0.1)',
    padding: '18px',
    marginBottom: '12px',
  },
  detailCardTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#C9A962',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: '0 0 14px',
  },

  // Conditions
  condGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '12px',
  },
  condItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '10px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  condLabel: {
    fontSize: '10px',
    color: '#6E7681',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  condValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#E6EDF3',
  },
  condForecast: {
    fontSize: '12px',
    color: '#C9D1D9',
    margin: '0 0 6px',
    lineHeight: '1.4',
  },
  condTrail: {
    fontSize: '12px',
    color: '#6BCB77',
    margin: 0,
    fontWeight: '500',
  },
  condNote: {
    fontSize: '12px',
    color: '#C9A962',
    margin: '8px 0 0',
    fontStyle: 'italic',
  },

  // Info Rows (Travel, Rentals)
  infoRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '13px',
    color: '#8B949E',
  },
  infoNote: {
    fontSize: '12px',
    color: '#8B949E',
    margin: '10px 0 0',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },

  // Lodging
  lodgingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  lodgeCard: {
    padding: '14px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    border: '1px solid rgba(201,169,98,0.08)',
  },
  lodgeTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  lodgeName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#E6EDF3',
    flex: 1,
  },
  lodgePrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#C9A962',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
  },
  lodgeRating: {
    fontSize: '12px',
    marginBottom: '6px',
  },
  lodgeHighlights: {
    fontSize: '12px',
    color: '#C9D1D9',
    margin: '0 0 4px',
    lineHeight: '1.4',
  },
  lodgeBooking: {
    fontSize: '11px',
    color: '#8B949E',
    margin: 0,
  },

  // Dining
  diningRow: {
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  diningTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  diningName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#E6EDF3',
  },
  diningPrice: {
    fontSize: '12px',
    color: '#C9A962',
    fontWeight: '500',
  },
  diningNote: {
    fontSize: '11px',
    color: '#8B949E',
    margin: 0,
    lineHeight: '1.3',
  },

  // Cost Breakdown
  costList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  costRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#C9D1D9',
    padding: '4px 0',
  },
  costDivider: {
    height: '1px',
    background: 'rgba(201,169,98,0.2)',
    margin: '4px 0',
  },
  costTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '500',
    color: '#E6EDF3',
    padding: '4px 0',
  },
  costPerPerson: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    padding: '8px 12px',
    background: 'rgba(201,169,98,0.1)',
    borderRadius: '8px',
    marginTop: '4px',
    alignItems: 'center',
  },
  costPerPersonAmt: {
    fontSize: '20px',
    fontWeight: '300',
    color: '#C9A962',
    fontFamily: "'Playfair Display', Georgia, serif",
  },

  // Packing List
  packingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  },
  packingItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    background: 'rgba(0,0,0,0.15)',
    borderRadius: '6px',
  },

  // Detail Actions
  detailActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '8px',
    marginBottom: '16px',
  },
  createTripBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#0D0D0D',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(201,169,98,0.25)',
    letterSpacing: '0.5px',
  },
  tripCreatedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(107,203,119,0.1)',
    border: '1px solid rgba(107,203,119,0.3)',
    borderRadius: '12px',
    color: '#6BCB77',
    fontSize: '14px',
  },
  viewTripBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0D0D0D',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  planAnotherBtn: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default PlanScreen;
