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

  // Update a trip by ID (merge updates into existing trip)
  const updateTrip = (tripId, updates) => {
    setAllTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updates } : t));
  };

  // Derived state
  const currentCrew = crews[activeCrew];
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

    // Derived
    crews,
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
