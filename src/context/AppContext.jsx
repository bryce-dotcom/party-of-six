import React, { createContext, useContext, useState } from 'react';
import { crews } from '../data/crews.js';
import { defaultTrips } from '../data/trips.js';
import { activities, activityCategories } from '../data/activities.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('home');
  const [activeCrew, setActiveCrew] = useState('boyz');
  const [showCrewSwitcher, setShowCrewSwitcher] = useState(false);
  const [tripActivity, setTripActivity] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [memoriesFilter, setMemoriesFilter] = useState('all');
  const [memoriesYear, setMemoriesYear] = useState('all');
  const [showBookPreview, setShowBookPreview] = useState(false);

  // AI Trip Planner state
  const [planStep, setPlanStep] = useState('activity');
  const [planDates, setPlanDates] = useState('this_weekend');
  const [planRegion, setPlanRegion] = useState('');
  const [planBudget, setPlanBudget] = useState('moderate');
  const [planResults, setPlanResults] = useState(null);
  const [selectedPlanOption, setSelectedPlanOption] = useState(null);
  const [planError, setPlanError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [tripCreated, setTripCreated] = useState(false);
  const [previousDestinations, setPreviousDestinations] = useState([]);

  // Trips state
  const [allTrips, setAllTrips] = useState(defaultTrips);

  // Crews state (mutable copy of static data)
  const [crewsData, setCrewsData] = useState(crews);

  // Update a trip by ID (merge updates into existing trip)
  const updateTrip = (tripId, updates) => {
    setAllTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updates } : t));
  };

  // Crew member mutations
  const updateMember = (crewId, memberId, updates) => {
    setCrewsData(prev => ({
      ...prev,
      [crewId]: {
        ...prev[crewId],
        members: prev[crewId].members.map(m =>
          m.id === memberId ? { ...m, ...updates } : m
        ),
      },
    }));
  };

  const addMember = (crewId, newMember) => {
    setCrewsData(prev => ({
      ...prev,
      [crewId]: {
        ...prev[crewId],
        members: [...prev[crewId].members, newMember],
      },
    }));
  };

  const removeMember = (crewId, memberId) => {
    setCrewsData(prev => ({
      ...prev,
      [crewId]: {
        ...prev[crewId],
        members: prev[crewId].members.filter(m => m.id !== memberId),
      },
    }));
  };

  const renameMember = (crewId, memberId, oldName, newName) => {
    updateMember(crewId, memberId, { name: newName });
    setAllTrips(prev => prev.map(trip => {
      if (trip.crewId !== crewId) return trip;
      const updated = { ...trip };
      if (trip.attendees) {
        updated.attendees = trip.attendees.map(n => n === oldName ? newName : n);
      }
      if (trip.awards) {
        updated.awards = trip.awards.map(a =>
          a.recipient === oldName ? { ...a, recipient: newName } : a
        );
      }
      if (trip.gamesPlayed) {
        updated.gamesPlayed = trip.gamesPlayed.map(g =>
          g.winner === oldName ? { ...g, winner: newName } : g
        );
      }
      if (trip.planData?.travel?.memberDriveTimes) {
        updated.planData = {
          ...trip.planData,
          travel: {
            ...trip.planData.travel,
            memberDriveTimes: trip.planData.travel.memberDriveTimes.map(m =>
              m.name === oldName ? { ...m, name: newName } : m
            ),
          },
        };
      }
      return updated;
    }));
  };

  // Derived state
  const currentCrew = crewsData[activeCrew];
  const crewTrips = allTrips.filter(t => t.crewId === activeCrew);
  const crewYears = [...new Set(crewTrips.map(t => t.year))].sort((a, b) => b - a);

  // Current trip = most recent trip for active crew (sorted by year desc, then id desc)
  const sortedCrewTrips = [...crewTrips].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.id.localeCompare(a.id);
  });
  const currentTrip = sortedCrewTrips.length > 0 ? sortedCrewTrips[0] : null;

  const filteredTrips = crewTrips.filter(trip => {
    const yearMatch = memoriesYear === 'all' || trip.year.toString() === memoriesYear;
    const activityMatch = memoriesFilter === 'all' || trip.activityName.toLowerCase().includes(memoriesFilter.toLowerCase());
    return yearMatch && activityMatch;
  });

  // Member lookup by name (for current crew)
  const getMemberByName = (name) => {
    return currentCrew?.members.find(m => m.name === name) || null;
  };

  const filteredActivities = activityFilter === 'all'
    ? activities
    : activities.filter(a => a.category === activityFilter);

  const value = {
    // Navigation
    activeTab, setActiveTab,
    activeCrew, setActiveCrew,

    // Crew switcher
    showCrewSwitcher, setShowCrewSwitcher,

    // Activities
    tripActivity, setTripActivity,
    activityFilter, setActivityFilter,
    filteredActivities,

    // AI
    aiResponse, setAiResponse,
    isLoading, setIsLoading,

    // Awards
    showAwardModal, setShowAwardModal,
    selectedAward, setSelectedAward,

    // Trip detail
    selectedTrip, setSelectedTrip,

    // Memories
    memoriesFilter, setMemoriesFilter,
    memoriesYear, setMemoriesYear,

    // Book
    showBookPreview, setShowBookPreview,

    // Plan
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

    // Trips
    allTrips, setAllTrips,
    updateTrip,
    currentTrip,

    // Crew mutations
    crewsData,
    updateMember,
    addMember,
    removeMember,
    renameMember,
    getMemberByName,

    // Derived
    currentCrew,
    crewTrips,
    crewYears,
    filteredTrips,
    activities,
    activityCategories,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
