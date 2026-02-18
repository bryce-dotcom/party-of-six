import React, { useState } from 'react';
import { planTrip, getCityAirport } from './services/claude.js';

// Party of Six - Adventure Planning PWA v2
// Multi-crew support, trip memories, printable yearbook

const PartyOfSixApp = () => {
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
  const [planStep, setPlanStep] = useState('activity'); // activity | configure | loading | results | detail
  const [planDates, setPlanDates] = useState('this_weekend');
  const [planRegion, setPlanRegion] = useState('');
  const [planBudget, setPlanBudget] = useState('moderate');
  const [planResults, setPlanResults] = useState(null);
  const [selectedPlanOption, setSelectedPlanOption] = useState(null);
  const [planError, setPlanError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [tripCreated, setTripCreated] = useState(false);
  const [previousDestinations, setPreviousDestinations] = useState([]);

  // ============================================
  // MULTIPLE CREWS DATA
  // ============================================
  const crews = {
    boyz: {
      id: 'boyz',
      name: 'The Boyz',
      established: 'Est. 2019',
      icon: '🏔️',
      tagline: 'Send it or go home',
      color: '#C9A962',
      homeBase: 'Lehi, UT',
      members: [
        { id: 1, name: 'Bryce', avatar: '🏔️', role: 'Trip Captain', birthday: 'Mar 15', awards: ['🏆', '🎯', '🧭'], binki: 0, tripsAttended: 23, city: 'Highland, UT', airport: 'SLC' },
        { id: 2, name: 'Jake', avatar: '🎿', role: 'Gear Master', birthday: 'Jul 22', awards: ['🔧', '💥'], binki: 2, tripsAttended: 19, city: 'Mapleton, UT', airport: 'SLC' },
        { id: 3, name: 'Mike', avatar: '🛷', role: 'Navigator', birthday: 'Nov 8', awards: ['🧭', '⭐', '📸'], binki: 1, tripsAttended: 21, city: 'Lehi, UT', airport: 'SLC' },
        { id: 4, name: 'Tyler', avatar: '🏂', role: 'Photographer', birthday: 'Feb 14', awards: ['📸', '📸', '📸'], binki: 3, tripsAttended: 18, city: 'Saratoga Springs, UT', airport: 'SLC' },
        { id: 5, name: 'Dave', avatar: '🎣', role: 'Safety Officer', birthday: 'Sep 30', awards: ['🩹', '🏅', '🐟'], binki: 0, tripsAttended: 22, city: 'Monticello, UT', airport: 'CNY' },
        { id: 6, name: 'Chris', avatar: '⛵', role: 'Provisions', birthday: 'May 5', awards: ['🍺', '🍺', '🦾'], binki: 4, tripsAttended: 20, city: 'Lehi, UT', airport: 'SLC' },
      ],
      stats: { totalTrips: 23, totalAwards: 47, totalPhotos: 342 },
    },
    girls: {
      id: 'girls',
      name: 'Wine & Wanderlust',
      established: 'Est. 2021',
      icon: '🥂',
      tagline: 'Sip, explore, repeat',
      color: '#D4A5A5',
      homeBase: 'Draper, UT',
      members: [
        { id: 1, name: 'Sarah', avatar: '💅', role: 'Chief Organizer', birthday: 'Apr 12', awards: ['📋', '🏆'], binki: 1, tripsAttended: 15, city: 'Draper, UT', airport: 'SLC' },
        { id: 2, name: 'Emily', avatar: '📸', role: 'Photographer', birthday: 'Jun 3', awards: ['📸', '✨'], binki: 0, tripsAttended: 14, city: 'Sandy, UT', airport: 'SLC' },
        { id: 3, name: 'Jessica', avatar: '🍷', role: 'Sommelier', birthday: 'Sep 18', awards: ['🍷', '🍷'], binki: 2, tripsAttended: 15, city: 'South Jordan, UT', airport: 'SLC' },
        { id: 4, name: 'Amanda', avatar: '🧘‍♀️', role: 'Wellness Guide', birthday: 'Jan 5', awards: ['🧘‍♀️', '🌅'], binki: 0, tripsAttended: 12, city: 'Cottonwood Heights, UT', airport: 'SLC' },
        { id: 5, name: 'Rachel', avatar: '🎉', role: 'Party Starter', birthday: 'Dec 22', awards: ['🎉', '🎤'], binki: 3, tripsAttended: 13, city: 'Riverton, UT', airport: 'SLC' },
        { id: 6, name: 'Nicole', avatar: '🛍️', role: 'Shopping Scout', birthday: 'Aug 9', awards: ['🛍️'], binki: 1, tripsAttended: 11, city: 'Herriman, UT', airport: 'SLC' },
      ],
      stats: { totalTrips: 15, totalAwards: 32, totalPhotos: 1247 },
    },
    family: {
      id: 'family',
      name: 'The Fam',
      established: 'Est. 2016',
      icon: '👨‍👩‍👧‍👦',
      tagline: 'Adventure is a family affair',
      color: '#7EB5A6',
      homeBase: 'Highland, UT',
      members: [
        { id: 1, name: 'Dad', avatar: '👨', role: 'Trip Lead', birthday: 'Mar 15', awards: ['🏆', '🚗', '🧭'], binki: 0, tripsAttended: 31, city: 'Highland, UT', airport: 'SLC' },
        { id: 2, name: 'Mom', avatar: '👩', role: 'Planner', birthday: 'May 22', awards: ['📋', '❤️', '👩‍🍳'], binki: 0, tripsAttended: 31, city: 'Highland, UT', airport: 'SLC' },
        { id: 3, name: 'Emma', avatar: '👧', role: 'Navigator', birthday: 'Feb 8', awards: ['🗺️', '📸'], binki: 2, tripsAttended: 28, city: 'Highland, UT', airport: 'SLC' },
        { id: 4, name: 'Olivia', avatar: '👧', role: 'DJ', birthday: 'Oct 14', awards: ['🎵', '🎤'], binki: 4, tripsAttended: 24, city: 'Highland, UT', airport: 'SLC' },
        { id: 5, name: 'Lily', avatar: '👶', role: 'Snack Master', birthday: 'Jul 30', awards: ['🍿', '😴'], binki: 5, tripsAttended: 18, city: 'Highland, UT', airport: 'SLC' },
      ],
      stats: { totalTrips: 31, totalAwards: 28, totalPhotos: 2103 },
    },
    couples: {
      id: 'couples',
      name: 'The Couples Club',
      established: 'Est. 2022',
      icon: '💑',
      tagline: 'Double the fun',
      color: '#B8A9C9',
      homeBase: 'Lehi, UT',
      members: [
        { id: 1, name: 'Us', avatar: '💑', role: 'Hosts', birthday: 'Mar 15', awards: ['🏠', '🏆'], binki: 1, tripsAttended: 8, city: 'Highland, UT', airport: 'SLC' },
        { id: 2, name: 'Jake & Lisa', avatar: '💑', role: 'Adventure Duo', birthday: 'Jul 22', awards: ['🚀'], binki: 2, tripsAttended: 7, city: 'Mapleton, UT', airport: 'SLC' },
        { id: 3, name: 'Mike & Sara', avatar: '💑', role: 'Foodies', birthday: 'Nov 8', awards: ['👨‍🍳', '🍷'], binki: 0, tripsAttended: 8, city: 'Lehi, UT', airport: 'SLC' },
      ],
      stats: { totalTrips: 8, totalAwards: 14, totalPhotos: 456 },
    },
  };

  // ============================================
  // TRIP MEMORIES / HISTORY
  // ============================================
  const [allTrips, setAllTrips] = useState([
    // BOYZ TRIPS
    {
      id: 'trip-001',
      crewId: 'boyz',
      name: 'Togwotee Epic Weekend',
      date: 'Feb 21-22, 2026',
      year: 2026,
      activity: '🛷',
      activityName: 'Snowmobile',
      location: 'Togwotee Pass, WY',
      coverPhoto: '🏔️',
      attendees: ['Bryce', 'Jake', 'Mike', 'Tyler', 'Dave', 'Chris'],
      highlights: [
        '18 inches of fresh powder',
        'Tyler got stuck 3 times',
        'Found the secret meadow',
        'Chris brought the good whiskey',
      ],
      awards: [
        { recipient: 'Tyler', award: '🪨', name: 'Stuck Award' },
        { recipient: 'Chris', award: '🍺', name: 'Best Provisions' },
        { recipient: 'Bryce', award: '🗺️', name: 'Trailblazer' },
        { recipient: 'Mike', award: '📸', name: 'Shot of the Trip' },
      ],
      photos: [
        { id: 1, emoji: '🌅', caption: 'Fresh tracks at sunrise' },
        { id: 2, emoji: '😅', caption: "Tyler's famous stuck moment" },
        { id: 3, emoji: '👥', caption: 'The whole crew at the summit' },
        { id: 4, emoji: '🥃', caption: 'Whiskey at the cabin' },
      ],
      stats: { miles: 127, maxElevation: '9,600 ft', conditions: 'Powder' },
      tripNotes: 'Best trip of the season. Tyler will never live down getting stuck in that creek bed. Already planning the return trip.',
    },
    {
      id: 'trip-002',
      crewId: 'boyz',
      name: 'Franklin Basin Day Trip',
      date: 'Jan 24, 2026',
      year: 2026,
      activity: '🛷',
      activityName: 'Snowmobile',
      location: 'Franklin Basin, UT',
      coverPhoto: '❄️',
      attendees: ['Bryce', 'Jake', 'Mike', 'Dave'],
      highlights: [
        'Competition Hill was firing',
        'Found untouched powder in Steep Canyon',
        'Jake broke a ski',
      ],
      awards: [
        { recipient: 'Jake', award: '💥', name: 'Yard Sale' },
        { recipient: 'Bryce', award: '🧭', name: 'Navigator' },
      ],
      photos: [
        { id: 1, emoji: '🏔️', caption: 'Competition Hill sends' },
        { id: 2, emoji: '❄️', caption: 'Steep Canyon powder' },
      ],
      stats: { miles: 68, maxElevation: '9,200 ft', conditions: 'Packed Powder' },
      tripNotes: 'Quick day trip but totally worth it. Jake owes everyone lunch for the yard sale.',
    },
    {
      id: 'trip-003',
      crewId: 'boyz',
      name: 'Lake Powell Houseboat',
      date: 'May 15-18, 2025',
      year: 2025,
      activity: '⛵',
      activityName: 'Boating',
      location: 'Lake Powell, UT/AZ',
      coverPhoto: '🚤',
      attendees: ['Bryce', 'Jake', 'Mike', 'Tyler', 'Dave', 'Chris'],
      highlights: [
        '4 days on the water',
        'Dave caught a 22" striper',
        'Cliff jumping at Labyrinth Canyon',
        'Chris fell asleep on the paddleboard',
      ],
      awards: [
        { recipient: 'Dave', award: '🐟', name: 'Big Catch' },
        { recipient: 'Chris', award: '🌊', name: 'Man Overboard' },
        { recipient: 'Tyler', award: '📸', name: 'Shot of the Trip' },
        { recipient: 'Bryce', award: '⚓', name: 'Captain' },
      ],
      photos: [
        { id: 1, emoji: '🚤', caption: 'Houseboat base camp' },
        { id: 2, emoji: '🐟', caption: "Dave's trophy striper" },
        { id: 3, emoji: '🏊', caption: 'Cliff jumping competition' },
        { id: 4, emoji: '🌅', caption: 'Sunset on the lake' },
        { id: 5, emoji: '😴', caption: 'Chris sleeping on paddleboard' },
      ],
      stats: { miles: 89, waterTemp: '76°F', conditions: 'Perfect' },
      tripNotes: 'Annual Powell trip never disappoints. Already planning next year.',
    },
    {
      id: 'trip-004',
      crewId: 'boyz',
      name: 'Moab RZR Weekend',
      date: 'Oct 10-12, 2025',
      year: 2025,
      activity: '🏎️',
      activityName: 'Side x Side',
      location: 'Moab, UT',
      coverPhoto: '🏜️',
      attendees: ['Bryce', 'Jake', 'Mike', 'Tyler'],
      highlights: [
        "Hell's Revenge was insane",
        'Jake rolled his RZR (everyone ok)',
        'Sand Flats at golden hour',
      ],
      awards: [
        { recipient: 'Jake', award: '💥', name: 'Yard Sale' },
        { recipient: 'Jake', award: '👶', name: 'Binki Award' },
        { recipient: 'Tyler', award: '📸', name: 'Shot of the Trip' },
      ],
      photos: [
        { id: 1, emoji: '🏜️', caption: "Hell's Revenge climb" },
        { id: 2, emoji: '🔄', caption: 'The infamous roll' },
        { id: 3, emoji: '🌅', caption: 'Sand Flats sunset' },
      ],
      stats: { miles: 112, maxElevation: '4,500 ft', conditions: 'Dry & Hot' },
      tripNotes: "Jake's roll was scary but made for a great story. He got the binki for his reaction.",
    },
    {
      id: 'trip-005',
      crewId: 'boyz',
      name: 'Greys River Expedition',
      date: 'Feb 8-9, 2025',
      year: 2025,
      activity: '🛷',
      activityName: 'Snowmobile',
      location: 'Greys River, WY',
      coverPhoto: '🌲',
      attendees: ['Bryce', 'Mike', 'Dave', 'Chris'],
      highlights: [
        'Box Y Lodge lunch stop',
        '141% snowpack - deepest ever',
        'Spotted a moose family',
      ],
      awards: [
        { recipient: 'Dave', award: '🦌', name: 'Wildlife Spotter' },
        { recipient: 'Bryce', award: '🧭', name: 'Navigator' },
      ],
      photos: [
        { id: 1, emoji: '🌲', caption: 'Deep in Greys River' },
        { id: 2, emoji: '🫎', caption: 'Moose encounter' },
        { id: 3, emoji: '🏠', caption: 'Box Y Lodge' },
      ],
      stats: { miles: 94, maxElevation: '8,800 ft', conditions: 'Deep Powder' },
      tripNotes: 'The snowpack was absolutely insane this year. Best conditions we\'ve ever seen.',
    },
    // GIRLS TRIPS
    {
      id: 'trip-101',
      crewId: 'girls',
      name: 'Napa Valley Escape',
      date: 'Sep 20-23, 2025',
      year: 2025,
      activity: '🍷',
      activityName: 'Wine Tasting',
      location: 'Napa Valley, CA',
      coverPhoto: '🍇',
      attendees: ['Sarah', 'Emily', 'Jessica', 'Amanda', 'Rachel', 'Nicole'],
      highlights: [
        '12 wineries in 3 days',
        'Private tasting at Opus One',
        "Rachel's karaoke performance",
        'Spa day at Calistoga',
      ],
      awards: [
        { recipient: 'Jessica', award: '🍷', name: 'Sommelier' },
        { recipient: 'Rachel', award: '🎉', name: 'Life of the Party' },
        { recipient: 'Emily', award: '📸', name: 'Shot of the Trip' },
        { recipient: 'Sarah', award: '📋', name: 'Trip Planner' },
      ],
      photos: [
        { id: 1, emoji: '🍇', caption: 'Vineyard views' },
        { id: 2, emoji: '🥂', caption: 'Cheers at Opus One' },
        { id: 3, emoji: '💆‍♀️', caption: 'Spa day bliss' },
        { id: 4, emoji: '🎤', caption: "Rachel's karaoke moment" },
      ],
      stats: { wineries: 12, bottles: 8, spaDays: 1 },
      tripNotes: 'The perfect girls getaway. Jessica really knows her wine. Rachel... not so much her singing.',
    },
    {
      id: 'trip-102',
      crewId: 'girls',
      name: 'Scottsdale Spa Weekend',
      date: 'Mar 5-7, 2025',
      year: 2025,
      activity: '💆‍♀️',
      activityName: 'Spa Day',
      location: 'Scottsdale, AZ',
      coverPhoto: '🌵',
      attendees: ['Sarah', 'Emily', 'Jessica', 'Amanda', 'Rachel'],
      highlights: [
        'Sanctuary on Camelback',
        'Desert sunrise yoga',
        'Nicole missed her flight',
      ],
      awards: [
        { recipient: 'Amanda', award: '🧘‍♀️', name: 'Zen Master' },
        { recipient: 'Nicole', award: '🤦', name: 'The Forgetter' },
        { recipient: 'Emily', award: '✨', name: 'Glow Up' },
      ],
      photos: [
        { id: 1, emoji: '🌅', caption: 'Sunrise yoga' },
        { id: 2, emoji: '💆‍♀️', caption: 'Spa treatments' },
        { id: 3, emoji: '🌵', caption: 'Desert hike' },
      ],
      stats: { treatments: 18, mimosas: 'countless', sunrises: 2 },
      tripNotes: 'We needed this. Nicole still owes us for the drama of missing her flight.',
    },
    {
      id: 'trip-103',
      crewId: 'girls',
      name: "Sarah's Bachelorette",
      date: 'Jun 10-13, 2024',
      year: 2024,
      activity: '👰',
      activityName: 'Bachelorette',
      location: 'Nashville, TN',
      coverPhoto: '🎸',
      attendees: ['Sarah', 'Emily', 'Jessica', 'Amanda', 'Rachel', 'Nicole'],
      highlights: [
        'Broadway bar crawl',
        'Matching cowboy boots',
        'Private honky tonk party',
        'Sarah cried happy tears',
      ],
      awards: [
        { recipient: 'Sarah', award: '👰', name: 'Bride to Be' },
        { recipient: 'Rachel', award: '📣', name: 'Hype Queen' },
        { recipient: 'Jessica', award: '🍷', name: 'Lightweight' },
      ],
      photos: [
        { id: 1, emoji: '🤠', caption: 'Cowgirls on Broadway' },
        { id: 2, emoji: '👰', caption: 'The bride squad' },
        { id: 3, emoji: '🎸', caption: 'Honky tonk night' },
        { id: 4, emoji: '😭', caption: 'Happy tears' },
      ],
      stats: { bars: 11, boots: 6, tears: 'many' },
      tripNotes: 'Best bachelorette ever. Nashville was made for us.',
    },
    // FAMILY TRIPS
    {
      id: 'trip-201',
      crewId: 'family',
      name: 'Yellowstone Adventure',
      date: 'Jul 4-10, 2025',
      year: 2025,
      activity: '🏕️',
      activityName: 'Camping',
      location: 'Yellowstone NP, WY',
      coverPhoto: '🦬',
      attendees: ['Dad', 'Mom', 'Emma', 'Olivia', 'Lily'],
      highlights: [
        'Old Faithful at sunset',
        'Bear sighting (from safe distance)',
        'Lily\'s first camping trip',
        'Emma navigated the whole park',
      ],
      awards: [
        { recipient: 'Emma', award: '🗺️', name: 'Navigator' },
        { recipient: 'Lily', award: '🌟', name: 'Rookie of the Trip' },
        { recipient: 'Mom', award: '👩‍🍳', name: 'Camp Chef' },
        { recipient: 'Dad', award: '🏕️', name: 'Tent Master' },
      ],
      photos: [
        { id: 1, emoji: '💨', caption: 'Old Faithful eruption' },
        { id: 2, emoji: '🐻', caption: 'Bear in the meadow' },
        { id: 3, emoji: '🏕️', caption: 'Campsite setup' },
        { id: 4, emoji: '👨‍👩‍👧‍👦', caption: 'Family at the geyser' },
        { id: 5, emoji: '🌌', caption: 'Stargazing night' },
      ],
      stats: { miles: 340, wildlife: 12, smores: 47 },
      tripNotes: 'The trip that started Lily\'s love of camping. Emma was an amazing navigator.',
    },
    {
      id: 'trip-202',
      crewId: 'family',
      name: 'Disney Magic',
      date: 'Dec 20-27, 2024',
      year: 2024,
      activity: '🎢',
      activityName: 'Theme Park',
      location: 'Orlando, FL',
      coverPhoto: '🏰',
      attendees: ['Dad', 'Mom', 'Emma', 'Olivia', 'Lily'],
      highlights: [
        'Christmas at Magic Kingdom',
        'Olivia met her favorite princess',
        'Space Mountain 5 times',
        'Lily slept through fireworks',
      ],
      awards: [
        { recipient: 'Olivia', award: '👸', name: 'Princess of the Day' },
        { recipient: 'Emma', award: '🎢', name: 'Thrill Seeker' },
        { recipient: 'Lily', award: '😴', name: 'Sleepyhead' },
      ],
      photos: [
        { id: 1, emoji: '🏰', caption: 'Castle at Christmas' },
        { id: 2, emoji: '👸', caption: 'Princess meet & greet' },
        { id: 3, emoji: '🎆', caption: 'Fireworks spectacular' },
        { id: 4, emoji: '🎢', caption: 'Space Mountain crew' },
      ],
      stats: { rides: 34, characters: 8, churros: 12 },
      tripNotes: 'Christmas at Disney is truly magical. Worth every penny.',
    },
    // COUPLES TRIPS
    {
      id: 'trip-301',
      crewId: 'couples',
      name: 'Park City Ski Weekend',
      date: 'Jan 15-17, 2026',
      year: 2026,
      activity: '🎿',
      activityName: 'Skiing',
      location: 'Park City, UT',
      coverPhoto: '⛷️',
      attendees: ['Us', 'Jake & Lisa', 'Mike & Sara'],
      highlights: [
        'Fresh powder day',
        'Après-ski at High West',
        'Mike & Sara\'s fondue dinner',
      ],
      awards: [
        { recipient: 'Jake & Lisa', award: '🎿', name: 'Best Ski Duo' },
        { recipient: 'Mike & Sara', award: '👨‍🍳', name: 'Dinner Hosts' },
      ],
      photos: [
        { id: 1, emoji: '⛷️', caption: 'Powder day!' },
        { id: 2, emoji: '🥃', caption: 'High West après' },
        { id: 3, emoji: '🫕', caption: 'Fondue night' },
      ],
      stats: { runs: 42, drinks: 'several', fondue: '1 amazing' },
      tripNotes: 'The perfect couples ski trip. Need to do this every year.',
    },
  ]);

  // Get current crew data
  const currentCrew = crews[activeCrew];
  const crewTrips = allTrips.filter(t => t.crewId === activeCrew);
  const crewYears = [...new Set(crewTrips.map(t => t.year))].sort((a, b) => b - a);
  
  const filteredTrips = crewTrips.filter(trip => {
    const yearMatch = memoriesYear === 'all' || trip.year.toString() === memoriesYear;
    const activityMatch = memoriesFilter === 'all' || trip.activityName.toLowerCase().includes(memoriesFilter.toLowerCase());
    return yearMatch && activityMatch;
  });

  // Awards list (condensed for space)
  const awards = [
    // Classic Awards
    { id: 'binki', icon: '👶', name: 'Binki Award', desc: 'Lost their cool', color: '#B56565' },
    { id: 'mvp', icon: '🏆', name: 'MVP', desc: 'Most valuable member', color: '#C9A962' },
    { id: 'rookie', icon: '🌟', name: 'Rookie of Trip', desc: 'First timer who crushed it', color: '#C9A962' },
    
    // Adventure / Motorsports
    { id: 'sendIt', icon: '🚀', name: 'Send It!', desc: 'Committed to something sketchy', color: '#C9A962' },
    { id: 'yardsale', icon: '💥', name: 'Yard Sale', desc: 'Epic wipeout, gear everywhere', color: '#B56565' },
    { id: 'mechanic', icon: '🔧', name: 'Trail Mechanic', desc: 'Saved the day with repairs', color: '#C9A962' },
    { id: 'stuck', icon: '🪨', name: 'Stuck Award', desc: 'Most creative way to get stuck', color: '#B56565' },
    { id: 'leadfoot', icon: '⚡', name: 'Lead Foot', desc: 'Fastest of the trip', color: '#C9A962' },
    { id: 'tortoise', icon: '🐢', name: 'The Tortoise', desc: 'Slowest but made it', color: '#8B949E' },
    
    // Navigation & Outdoors
    { id: 'navigator', icon: '🧭', name: 'Navigator', desc: 'Never gets lost', color: '#C9A962' },
    { id: 'lost', icon: '❓', name: 'Where Am I?', desc: 'Got everyone lost', color: '#B56565' },
    { id: 'trailblazer', icon: '🗺️', name: 'Trailblazer', desc: 'Found the best spot', color: '#C9A962' },
    { id: 'earlybird', icon: '🌅', name: 'Early Bird', desc: 'First one ready', color: '#C9A962' },
    { id: 'sleepyhead', icon: '😴', name: 'Sleepyhead', desc: 'Last one out of bed', color: '#8B949E' },
    
    // Safety & Survival
    { id: 'medic', icon: '🩹', name: 'Trail Medic', desc: 'Patched someone up', color: '#C9A962' },
    { id: 'survivor', icon: '🏕️', name: 'Survivor', desc: 'Powered through adversity', color: '#C9A962' },
    { id: 'weatherman', icon: '🌧️', name: 'Weatherman', desc: 'Called conditions right', color: '#C9A962' },
    { id: 'jinx', icon: '🌩️', name: 'The Jinx', desc: 'Brought bad luck', color: '#B56565' },
    
    // Water Sports
    { id: 'captain', icon: '⚓', name: 'Captain', desc: 'Best boat handling', color: '#C9A962' },
    { id: 'overboard', icon: '🌊', name: 'Man Overboard', desc: 'Took an unexpected swim', color: '#B56565' },
    { id: 'bigcatch', icon: '🐟', name: 'Big Catch', desc: 'Landed the biggest fish', color: '#C9A962' },
    { id: 'skunked', icon: '🦨', name: 'Skunked', desc: "Didn't catch anything", color: '#8B949E' },
    { id: 'wakeking', icon: '🏄', name: 'Wake King/Queen', desc: 'Best on the water', color: '#C9A962' },
    
    // Winter Sports
    { id: 'powderhound', icon: '❄️', name: 'Powder Hound', desc: 'Found the best snow', color: '#C9A962' },
    { id: 'frostbite', icon: '🥶', name: 'Frostbite', desc: 'Forgot proper gear', color: '#B56565' },
    
    // Photography
    { id: 'photographer', icon: '📸', name: 'Shot of Trip', desc: 'Best photo', color: '#C9A962' },
    { id: 'influencer', icon: '📱', name: 'The Influencer', desc: 'Most time on phone', color: '#8B949E' },
    
    // Food & Provisions
    { id: 'provisions', icon: '🍺', name: 'Best Provisions', desc: 'Best snacks/drinks', color: '#C9A962' },
    { id: 'chef', icon: '👨‍🍳', name: 'Camp Chef', desc: 'Cooked the best meal', color: '#C9A962' },
    { id: 'hangry', icon: '😤', name: 'Hangry Award', desc: 'Got cranky before food', color: '#B56565' },
    
    // Social & Party
    { id: 'life', icon: '🎉', name: 'Life of Party', desc: 'Kept everyone entertained', color: '#C9A962' },
    { id: 'storyteller', icon: '📖', name: 'Storyteller', desc: 'Best campfire stories', color: '#C9A962' },
    { id: 'dj', icon: '🎵', name: 'DJ Award', desc: 'Best playlist', color: '#C9A962' },
    { id: 'lightweight', icon: '🍷', name: 'Lightweight', desc: 'First one down', color: '#B56565' },
    { id: 'ironliver', icon: '🦾', name: 'Iron Liver', desc: 'Last one standing', color: '#C9A962' },
    
    // Girls Trip Specific
    { id: 'glowup', icon: '✨', name: 'Glow Up', desc: 'Best transformation', color: '#C9A962' },
    { id: 'therapist', icon: '💆‍♀️', name: 'Group Therapist', desc: 'Best listener', color: '#C9A962' },
    { id: 'hype', icon: '📣', name: 'Hype Queen', desc: 'Best at gassing up', color: '#C9A962' },
    { id: 'drama', icon: '🎭', name: 'Drama Award', desc: 'Most dramatic moment', color: '#B56565' },
    { id: 'shopaholic', icon: '🛍️', name: 'Shopaholic', desc: 'Spent the most', color: '#8B949E' },
    { id: 'sommelier', icon: '🍷', name: 'Sommelier', desc: 'Best wine picks', color: '#C9A962' },
    
    // Travel
    { id: 'planner', icon: '📋', name: 'Trip Planner', desc: 'Organized everything', color: '#C9A962' },
    { id: 'flexible', icon: '🧘', name: 'Go With Flow', desc: 'Most adaptable', color: '#C9A962' },
    { id: 'complainer', icon: '😩', name: 'Complainy Pants', desc: 'Found fault in everything', color: '#B56565' },
    { id: 'forgetter', icon: '🤦', name: 'The Forgetter', desc: 'Left something behind', color: '#B56565' },
    
    // Celebrations
    { id: 'birthday', icon: '🎂', name: 'Birthday Star', desc: "It's their day!", color: '#C9A962' },
    { id: 'newlywed', icon: '💍', name: 'Newlywed', desc: 'Just got married!', color: '#C9A962' },
  ];

  // EXPANDED Activities list - organized by category
  const allActivities = [
    // Adventure / Motorsports
    { id: 'snowmobile', icon: '🛷', label: 'Snowmobile', category: 'adventure' },
    { id: 'sxs', icon: '🏎️', label: 'Side x Side', category: 'adventure' },
    { id: 'atv', icon: '🏍️', label: 'ATV', category: 'adventure' },
    { id: 'dirtbike', icon: '🏁', label: 'Dirt Bikes', category: 'adventure' },
    { id: 'jeep', icon: '🚙', label: 'Jeep Trail', category: 'adventure' },
    
    // Winter Sports
    { id: 'ski', icon: '🎿', label: 'Skiing', category: 'winter' },
    { id: 'snowboard', icon: '🏂', label: 'Snowboard', category: 'winter' },
    { id: 'xcski', icon: '⛷️', label: 'Cross Country', category: 'winter' },
    { id: 'snowshoe', icon: '🥾', label: 'Snowshoe', category: 'winter' },
    { id: 'tubing', icon: '🛞', label: 'Snow Tubing', category: 'winter' },
    { id: 'icefish', icon: '🧊', label: 'Ice Fishing', category: 'winter' },
    
    // Water
    { id: 'fish', icon: '🎣', label: 'Fishing', category: 'water' },
    { id: 'boat', icon: '⛵', label: 'Boating', category: 'water' },
    { id: 'jetski', icon: '🚤', label: 'Jet Ski', category: 'water' },
    { id: 'kayak', icon: '🛶', label: 'Kayak/SUP', category: 'water' },
    { id: 'wakeboard', icon: '🏄', label: 'Wakeboard', category: 'water' },
    { id: 'rafting', icon: '🌊', label: 'Rafting', category: 'water' },
    { id: 'sailing', icon: '⛵', label: 'Sailing', category: 'water' },
    { id: 'scuba', icon: '🤿', label: 'Scuba/Snorkel', category: 'water' },
    
    // Outdoor
    { id: 'camping', icon: '🏕️', label: 'Camping', category: 'outdoor' },
    { id: 'hiking', icon: '🥾', label: 'Hiking', category: 'outdoor' },
    { id: 'hunting', icon: '🦌', label: 'Hunting', category: 'outdoor' },
    { id: 'golf', icon: '⛳', label: 'Golf Trip', category: 'outdoor' },
    { id: 'mtb', icon: '🚵', label: 'Mountain Bike', category: 'outdoor' },
    { id: 'climbing', icon: '🧗', label: 'Rock Climbing', category: 'outdoor' },
    { id: 'horseback', icon: '🐴', label: 'Horseback', category: 'outdoor' },
    
    // Travel & Events
    { id: 'travel', icon: '✈️', label: 'Travel', category: 'travel' },
    { id: 'roadtrip', icon: '🚗', label: 'Road Trip', category: 'travel' },
    { id: 'cruise', icon: '🚢', label: 'Cruise', category: 'travel' },
    { id: 'concert', icon: '🎸', label: 'Concert', category: 'events' },
    { id: 'sports', icon: '🏟️', label: 'Sports Game', category: 'events' },
    { id: 'vegas', icon: '🎰', label: 'Vegas Trip', category: 'travel' },
    { id: 'festival', icon: '🎪', label: 'Festival', category: 'events' },
    { id: 'theme', icon: '🎢', label: 'Theme Park', category: 'events' },
    
    // Girls Trips / Wellness
    { id: 'spa', icon: '💆‍♀️', label: 'Spa Day', category: 'girlstrip' },
    { id: 'winery', icon: '🍷', label: 'Wine Tasting', category: 'girlstrip' },
    { id: 'brunch', icon: '🥂', label: 'Brunch Crawl', category: 'girlstrip' },
    { id: 'yoga', icon: '🧘‍♀️', label: 'Yoga Retreat', category: 'girlstrip' },
    { id: 'shopping', icon: '🛍️', label: 'Shopping Trip', category: 'girlstrip' },
    { id: 'bachelorette', icon: '👰', label: 'Bachelorette', category: 'girlstrip' },
    { id: 'girlsnight', icon: '💅', label: 'Girls Night', category: 'girlstrip' },
    { id: 'bookclub', icon: '📚', label: 'Book Club', category: 'girlstrip' },
    { id: 'crafts', icon: '🎨', label: 'Craft Retreat', category: 'girlstrip' },
    { id: 'cooking', icon: '👩‍🍳', label: 'Cooking Class', category: 'girlstrip' },
    { id: 'photoshoot', icon: '📸', label: 'Photo Session', category: 'girlstrip' },
    { id: 'teatime', icon: '🫖', label: 'High Tea', category: 'girlstrip' },
    { id: 'dance', icon: '💃', label: 'Dance Class', category: 'girlstrip' },
    { id: 'skincare', icon: '✨', label: 'Beauty Day', category: 'girlstrip' },
    { id: 'meditation', icon: '🕯️', label: 'Wellness Retreat', category: 'girlstrip' },
    { id: 'nailsalon', icon: '💅', label: 'Mani/Pedi', category: 'girlstrip' },
    { id: 'karaoke', icon: '🎤', label: 'Karaoke Night', category: 'girlstrip' },
    { id: 'pottery', icon: '🏺', label: 'Pottery Class', category: 'girlstrip' },
    { id: 'picnic', icon: '🧺', label: 'Fancy Picnic', category: 'girlstrip' },
    { id: 'broadway', icon: '🎭', label: 'Theater/Show', category: 'girlstrip' },
    
    // Celebrations
    { id: 'birthday', icon: '🎂', label: 'Birthday Trip', category: 'celebration' },
    { id: 'bachelor', icon: '🎉', label: 'Bachelor Party', category: 'celebration' },
    { id: 'anniversary', icon: '💕', label: 'Anniversary', category: 'celebration' },
    { id: 'reunion', icon: '👨‍👩‍👧‍👦', label: 'Reunion', category: 'celebration' },
    { id: 'graduation', icon: '🎓', label: 'Graduation', category: 'celebration' },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'adventure', label: 'Adventure', icon: '🏎️' },
    { id: 'winter', label: 'Winter', icon: '❄️' },
    { id: 'water', label: 'Water', icon: '🌊' },
    { id: 'outdoor', label: 'Outdoor', icon: '🏕️' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'events', label: 'Events', icon: '🎸' },
    { id: 'girlstrip', label: 'Girls Trip', icon: '💅' },
    { id: 'celebration', label: 'Celebrate', icon: '🎉' },
  ];

  const filteredActivities = activityFilter === 'all' 
    ? allActivities 
    : allActivities.filter(a => a.category === activityFilter);

  // ============================================
  // COMPONENTS
  // ============================================

  // Main Party of Six Logo - Classic Ritz Gold Style
  const Logo = () => (
    <div style={styles.logoContainer}>
      {/* Top decorative line with EST */}
      <div style={styles.logoTopLine}>
        <div style={styles.logoLineGradientLeft} />
        <span style={styles.logoEstText}>EST. 2026</span>
        <div style={styles.logoLineGradientRight} />
      </div>
      
      {/* Main Party of Six - Gold Serif Typography */}
      <div style={styles.logoMain}>
        <span style={styles.logoParty}>PARTY</span>
        <span style={styles.logoOf}>of</span>
        <span style={styles.logoSix}>SIX</span>
      </div>

      {/* Decorative underline with diamond */}
      <div style={styles.logoDivider}>
        <div style={styles.logoDividerLineLeft} />
        <div style={styles.logoDividerDiamond} />
        <div style={styles.logoDividerLineRight} />
      </div>

      {/* Tagline */}
      <p style={styles.logoTagline}>ADVENTURES AWAIT</p>
    </div>
  );

  // Small Crew Selector - Subtle pill below the logo
  const CrewSelector = () => (
    <button 
      style={styles.crewSelector} 
      onClick={() => setShowCrewSwitcher(true)}
    >
      <span style={styles.crewSelectorIcon}>{currentCrew.icon}</span>
      <span style={styles.crewSelectorName}>{currentCrew.name}</span>
      <span style={styles.crewSelectorDot}>•</span>
      <span style={styles.crewSelectorEst}>{currentCrew.established}</span>
      <span style={styles.crewSelectorArrow}>▾</span>
    </button>
  );

  // Crew Switcher Modal
  const CrewSwitcher = () => (
    <div style={styles.modalOverlay} onClick={() => setShowCrewSwitcher(false)}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Switch Crew</h2>
        <div style={styles.crewList}>
          {Object.values(crews).map(crew => (
            <button
              key={crew.id}
              style={{
                ...styles.crewOption,
                ...(activeCrew === crew.id ? styles.crewOptionActive : {}),
                borderColor: crew.color,
              }}
              onClick={() => {
                setActiveCrew(crew.id);
                setShowCrewSwitcher(false);
              }}
            >
              <span style={styles.crewOptionIcon}>{crew.icon}</span>
              <div style={styles.crewOptionInfo}>
                <span style={styles.crewOptionName}>{crew.name}</span>
                <span style={styles.crewOptionTagline}>{crew.tagline}</span>
                <span style={styles.crewOptionStats}>
                  {crew.stats.totalTrips} trips • {crew.members.length} members
                </span>
              </div>
              <span style={styles.crewOptionEstablished}>{crew.established}</span>
            </button>
          ))}
        </div>
        <button style={styles.addCrewButton}>
          <span>+</span> Create New Crew
        </button>
        <button style={styles.closeButton} onClick={() => setShowCrewSwitcher(false)}>
          Cancel
        </button>
      </div>
    </div>
  );

  // Trip Detail Modal
  const TripDetail = ({ trip }) => {
    const pd = trip.planData; // AI plan data (may not exist for older/manual trips)
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

    return (
    <div style={styles.modalOverlay} onClick={() => setSelectedTrip(null)}>
      <div style={styles.tripDetailModal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.tripDetailHeader}>
          <div style={styles.tripDetailCover}>{trip.coverPhoto}</div>
          <div style={styles.tripDetailHeaderContent}>
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

        {/* === AI PLAN DATA: Conditions === */}
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

        {/* === AI PLAN DATA: Travel === */}
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

        {/* === AI PLAN DATA: Where to Stay === */}
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

        {/* === AI PLAN DATA: Where to Eat === */}
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

        {/* === AI PLAN DATA: Activities === */}
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

        {/* === AI PLAN DATA: Rentals === */}
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

        {/* === AI PLAN DATA: Cost Breakdown === */}
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

        {/* === AI PLAN DATA: Permits === */}
        {pd?.permits?.required && (
          <div style={styles.tripDetailSection}>
            <h3 style={styles.tripDetailSectionTitle}>Permits Required</h3>
            <p style={styles.tdCondExtra}>📋 {pd.permits.details}</p>
            {pd.permits.cost > 0 && <p style={{fontSize:'12px', color:'#C9A962', marginTop:'4px'}}>Cost: ${pd.permits.cost}</p>}
          </div>
        )}

        {/* === AI PLAN DATA: Packing List === */}
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

        {/* Highlights (for non-AI trips or additional context) */}
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

        <button style={styles.closeButton} onClick={() => setSelectedTrip(null)}>
          Close
        </button>
      </div>
    </div>
    );
  };

  // Book Preview Modal
  const BookPreview = () => (
    <div style={styles.modalOverlay} onClick={() => setShowBookPreview(false)}>
      <div style={styles.bookPreviewModal} onClick={e => e.stopPropagation()}>
        <div style={styles.bookCover}>
          <div style={styles.bookCoverInner}>
            <div style={styles.bookEstablished}>{currentCrew.established}</div>
            <div style={styles.bookIcon}>{currentCrew.icon}</div>
            <h1 style={styles.bookTitle}>{currentCrew.name}</h1>
            <div style={styles.bookSubtitle}>Adventure Book</div>
            <div style={styles.bookDivider}>◆</div>
            <div style={styles.bookStats}>
              {currentCrew.stats.totalTrips} Trips • {currentCrew.stats.totalPhotos} Photos
            </div>
            <div style={styles.bookYears}>
              {Math.min(...crewYears)} - {Math.max(...crewYears)}
            </div>
          </div>
        </div>
        
        <div style={styles.bookOptions}>
          <h3 style={styles.bookOptionsTitle}>Create Your Book</h3>
          <p style={styles.bookOptionsDesc}>
            Turn your adventures into a beautiful printed book
          </p>
          
          <div style={styles.bookFormats}>
            <button style={styles.bookFormatOption}>
              <span style={styles.bookFormatIcon}>📖</span>
              <span style={styles.bookFormatName}>Softcover</span>
              <span style={styles.bookFormatPrice}>$29.99</span>
            </button>
            <button style={styles.bookFormatOptionPremium}>
              <span style={styles.bookFormatIcon}>📚</span>
              <span style={styles.bookFormatName}>Hardcover</span>
              <span style={styles.bookFormatPrice}>$49.99</span>
              <span style={styles.bookFormatBadge}>Premium</span>
            </button>
            <button style={styles.bookFormatOption}>
              <span style={styles.bookFormatIcon}>📄</span>
              <span style={styles.bookFormatName}>PDF</span>
              <span style={styles.bookFormatPrice}>Free</span>
            </button>
          </div>

          <div style={styles.bookIncluded}>
            <h4 style={styles.bookIncludedTitle}>What's Included</h4>
            <ul style={styles.bookIncludedList}>
              <li>✓ All {crewTrips.length} trip summaries</li>
              <li>✓ {currentCrew.stats.totalPhotos}+ photos</li>
              <li>✓ Award history & leaderboards</li>
              <li>✓ Member profiles & stats</li>
              <li>✓ Trip notes & highlights</li>
              <li>✓ Custom cover with crew name</li>
            </ul>
          </div>

          <button style={styles.bookCreateButton}>
            Create Adventure Book
          </button>
        </div>

        <button style={styles.closeButton} onClick={() => setShowBookPreview(false)}>
          Cancel
        </button>
      </div>
    </div>
  );

  const TabBar = () => (
    <div style={styles.tabBar}>
      {[
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'plan', icon: '🗺️', label: 'Plan' },
        { id: 'live', icon: '📍', label: 'Live' },
        { id: 'memories', icon: '📸', label: 'Memories' },
        { id: 'crew', icon: '👥', label: 'Crew' },
        { id: 'awards', icon: '🏆', label: 'Awards' },
        { id: 'games', icon: '🎮', label: 'Games' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab.id ? styles.tabButtonActive : {}),
          }}
        >
          <span style={styles.tabIcon}>{tab.icon}</span>
          <span style={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  // ============================================
  // SCREENS
  // ============================================

  const HomeScreen = () => (
    <div style={styles.screen}>
      {/* Hero with Main Party of Six Logo */}
      <div style={styles.heroSection}>
        <Logo />
        
        {/* Crew Selector - subtle, below the main brand */}
        <CrewSelector />
        
        {/* Stats for current crew */}
        <div style={styles.quickStats}>
          <div style={styles.quickStat}>
            <span style={styles.statNumber}>{currentCrew.stats.totalTrips}</span>
            <span style={styles.statLabel}>Trips</span>
          </div>
          <div style={styles.quickStat}>
            <span style={styles.statNumber}>{currentCrew.members.length}</span>
            <span style={styles.statLabel}>Members</span>
          </div>
          <div style={styles.quickStat}>
            <span style={styles.statNumber}>{currentCrew.stats.totalPhotos}</span>
            <span style={styles.statLabel}>Photos</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <button style={styles.primaryAction} onClick={() => setActiveTab('plan')}>
          <span>🚀</span><span>Plan Trip</span>
        </button>
        <button style={styles.secondaryAction} onClick={() => setShowBookPreview(true)}>
          <span>📖</span><span>Create Book</span>
        </button>
      </div>

      {/* Recent Trips */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Adventures</h2>
        <div style={styles.tripCards}>
          {crewTrips.slice(0, 4).map(trip => (
            <div 
              key={trip.id} 
              style={styles.tripCard}
              onClick={() => setSelectedTrip(trip)}
            >
              <div style={styles.tripCardCover}>{trip.coverPhoto}</div>
              <div style={styles.tripCardContent}>
                <span style={styles.tripCardActivity}>{trip.activity}</span>
                <h3 style={styles.tripCardName}>{trip.name}</h3>
                <p style={styles.tripCardDate}>{trip.date}</p>
                <div style={styles.tripCardMeta}>
                  <span>{trip.photos.length} 📷</span>
                  <span>{trip.awards.length} 🏆</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Birthdays */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Birthdays</h2>
        <div style={styles.birthdayList}>
          {currentCrew.members.slice(0, 3).map(member => (
            <div key={member.id} style={styles.birthdayItem}>
              <span style={styles.birthdayAvatar}>{member.avatar}</span>
              <span style={styles.birthdayName}>{member.name}</span>
              <span style={styles.birthdayDate}>{member.birthday}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MemoriesScreen = () => (
    <div style={styles.screen}>
      <div style={styles.memoriesHeader}>
        <h1 style={styles.memoriesTitle}>Memories</h1>
        <button style={styles.bookButton} onClick={() => setShowBookPreview(true)}>
          📖 Create Book
        </button>
      </div>

      {/* Year Filter */}
      <div style={styles.yearFilter}>
        <button
          style={{
            ...styles.yearButton,
            ...(memoriesYear === 'all' ? styles.yearButtonActive : {}),
          }}
          onClick={() => setMemoriesYear('all')}
        >
          All Years
        </button>
        {crewYears.map(year => (
          <button
            key={year}
            style={{
              ...styles.yearButton,
              ...(memoriesYear === year.toString() ? styles.yearButtonActive : {}),
            }}
            onClick={() => setMemoriesYear(year.toString())}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div style={styles.memoriesGrid}>
        {filteredTrips.map(trip => (
          <div 
            key={trip.id} 
            style={styles.memoryCard}
            onClick={() => setSelectedTrip(trip)}
          >
            <div style={styles.memoryCardCover}>
              <span style={styles.memoryCardEmoji}>{trip.coverPhoto}</span>
              <div style={styles.memoryCardOverlay}>
                <span style={styles.memoryCardPhotoCount}>{trip.photos.length} 📷</span>
              </div>
            </div>
            <div style={styles.memoryCardContent}>
              <div style={styles.memoryCardTop}>
                <span style={styles.memoryCardActivity}>{trip.activity}</span>
                <span style={styles.memoryCardYear}>{trip.year}</span>
              </div>
              <h3 style={styles.memoryCardName}>{trip.name}</h3>
              <p style={styles.memoryCardLocation}>{trip.location}</p>
              <p style={styles.memoryCardDate}>{trip.date}</p>
              {trip.awards.length > 0 && (
                <div style={styles.memoryCardAwards}>
                  {trip.awards.slice(0, 3).map((a, idx) => (
                    <span key={idx} style={styles.memoryCardAwardIcon}>{a.award}</span>
                  ))}
                  {trip.awards.length > 3 && (
                    <span style={styles.memoryCardAwardMore}>+{trip.awards.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyStateIcon}>📸</span>
          <p style={styles.emptyStateText}>No trips found for this filter</p>
        </div>
      )}
    </div>
  );

  const PlanScreen = () => {
    // Group activities by category
    const activityGroups = [
      { id: 'adventure', label: 'Adventure & Motorsports', icon: '🏎️', activities: allActivities.filter(a => a.category === 'adventure') },
      { id: 'winter', label: 'Winter Sports', icon: '❄️', activities: allActivities.filter(a => a.category === 'winter') },
      { id: 'water', label: 'Water Activities', icon: '🌊', activities: allActivities.filter(a => a.category === 'water') },
      { id: 'outdoor', label: 'Outdoor & Nature', icon: '🏕️', activities: allActivities.filter(a => a.category === 'outdoor') },
      { id: 'travel', label: 'Travel', icon: '✈️', activities: allActivities.filter(a => a.category === 'travel') },
      { id: 'events', label: 'Events & Entertainment', icon: '🎸', activities: allActivities.filter(a => a.category === 'events') },
      { id: 'girlstrip', label: 'Girls Trip & Wellness', icon: '💅', activities: allActivities.filter(a => a.category === 'girlstrip') },
      { id: 'celebration', label: 'Celebrations', icon: '🎉', activities: allActivities.filter(a => a.category === 'celebration') },
    ];

    const displayGroups = activityFilter === 'all'
      ? activityGroups
      : activityGroups.filter(g => g.id === activityFilter);

    const regions = [
      { id: 'utah', label: 'Utah', icon: '🏔️' },
      { id: 'wyoming', label: 'Wyoming', icon: '🦬' },
      { id: 'idaho', label: 'Idaho', icon: '🌲' },
      { id: 'colorado', label: 'Colorado', icon: '⛰️' },
      { id: 'anywhere', label: 'Anywhere < 6hrs', icon: '🗺️' },
    ];

    const budgetOptions = [
      { id: 'budget', label: 'Budget', range: '$50-100/person', icon: '💵' },
      { id: 'moderate', label: 'Moderate', range: '$100-250/person', icon: '💰' },
      { id: 'premium', label: 'Premium', range: '$250-500/person', icon: '💎' },
      { id: 'nolimit', label: 'No Limit', range: "Sky's the limit", icon: '🥂' },
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
      const activityObj = allActivities.find(a => a.label === tripActivity);
      const newTrip = {
        id: `trip-${Date.now()}`,
        crewId: activeCrew,
        name: `${option.destination.split(',')[0]} Trip`,
        date: getDateLabel(),
        year: new Date().getFullYear(),
        activity: activityObj?.icon || '🎯',
        activityName: tripActivity,
        location: option.destination,
        coverPhoto: activityObj?.icon || '🎯',
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

    const optionIcon = (type) => type === 'best_conditions' ? '🎯' : type === 'closest' ? '📍' : '💰';
    const optionLabel = (type) => type === 'best_conditions' ? 'Best Conditions' : type === 'closest' ? 'Closest' : 'Best Value';

    return (
      <div style={styles.screen}>
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
                  <span style={{fontSize: '24px'}}>{allActivities.find(a => a.label === tripActivity)?.icon || '🎯'}</span>
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
                <div style={styles.categoryTabs}>
                  {categoryFilters.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActivityFilter(cat.id)}
                      style={{ ...styles.categoryTab, ...(activityFilter === cat.id ? styles.categoryTabActive : {}) }}
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
                  <span>🤖</span><span>AI Trip Assistant</span>
                </div>
                <div style={styles.aiPrompt}>
                  <p style={styles.aiQuestion}>
                    Planning a <strong style={{color: '#C9A962'}}>{tripActivity}</strong> trip for <strong style={{color: '#C9A962'}}>{currentCrew.name}</strong>
                  </p>

                  {/* Date Selection */}
                  <div style={styles.configLabel}>When are you going?</div>
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
                  <div style={styles.configLabel}>Where do you want to go?</div>
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
                  <div style={styles.configLabel}>Budget per person</div>
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
                  <div style={styles.configRow}>
                    <span style={styles.configLabel}>Group size</span>
                    <span style={styles.groupSizeValue}>👥 {currentCrew.members.length} people</span>
                  </div>

                  {/* Driving From */}
                  <div style={styles.configRow}>
                    <span style={styles.configLabel}>Driving from</span>
                    <span style={styles.groupSizeValue}>📍 {currentCrew.homeBase || 'Salt Lake City, UT'}</span>
                  </div>

                  {planError && (
                    <div style={styles.errorBanner}>
                      <span>⚠️</span>
                      <span>{planError}</span>
                    </div>
                  )}

                  <button
                    style={{ ...styles.aiButton, opacity: planDates ? 1 : 0.5 }}
                    onClick={planDates ? handleFindOptions : undefined}
                  >
                    🔍 Find Best Options
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
                <span style={styles.loadingIcon}>🤖</span>
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
                {['🔍 Conditions', '🌤️ Weather', '🏨 Lodging', '🚗 Routes', '💰 Costs'].map((step, idx) => (
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
              <button style={styles.backButton} onClick={handleBack}>← Back</button>
              <div>
                <h1 style={styles.resultsTitle}>Recommendations</h1>
                <p style={styles.resultsSubtitle}>
                  {tripActivity} · {currentCrew.name} · {getDateLabel()}
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
                    <span style={styles.resultMeta}>🚗 {option.travel?.driveTime}</span>
                    <span style={styles.resultMeta}>💰 ${option.costs?.perPerson}/person</span>
                  </div>

                  {option.conditions && (
                    <div style={styles.resultCondRow}>
                      {(() => {
                        // Show the 2 most relevant condition fields as preview
                        const skip = ['forecast', 'specialNotes', 'trailStatus'];
                        const entries = Object.entries(option.conditions).filter(([k, v]) => v && !skip.includes(k));
                        const condIcons = { freshSnow: '❄️', baseDepth: '📏', snowpack: '🏔️', avalanche: '⚠️', temperature: '🌡️',
                          waterTemp: '🌊', flowRate: '💧', clarity: '👁️', hatches: '🪰', fishActivity: '🐟',
                          waterLevel: '📊', waveHeight: '🌊', windSpeed: '💨', trailConditions: '🥾', snowLine: '⛰️',
                          courseConditions: '⛳', gameActivity: '🦌', season: '📅', nighttimeLow: '🌙',
                          crowdLevel: '👥', conditions: '📋', bestTime: '⏰', bugLevel: '🦟', dustLevel: '💨',
                          campgroundStatus: '🏕️', availability: '📅', moonPhase: '🌕' };
                        return entries.slice(0, 2).map(([key, val]) => (
                          <span key={key} style={styles.resultCond}>{condIcons[key] || '📋'} {val}</span>
                        ));
                      })()}
                    </div>
                  )}

                  <div style={styles.resultAction}>View Details →</div>
                </button>
              ))}
            </div>

            {planResults.notes && (
              <div style={styles.aiNote}>
                <span style={{fontSize: '16px'}}>💡</span>
                <p style={styles.aiNoteText}>{planResults.notes}</p>
              </div>
            )}

            <div style={styles.redoRow}>
              <button style={styles.redoButton} onClick={handleFindOptions}>
                🔄 Redo Search
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
            <button style={styles.backButton} onClick={handleBack}>← Back to Options</button>

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
                <h3 style={styles.detailCardTitle}>📊 CONDITIONS</h3>
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
                  <p style={styles.condForecast}>🌤️ {selectedPlanOption.conditions.forecast}</p>
                )}
                {selectedPlanOption.conditions.trailStatus && (
                  <p style={styles.condTrail}>Trail: {selectedPlanOption.conditions.trailStatus}</p>
                )}
                {selectedPlanOption.conditions.regulations && (
                  <p style={styles.condTrail}>📋 {selectedPlanOption.conditions.regulations}</p>
                )}
                {selectedPlanOption.conditions.launchAccess && (
                  <p style={styles.condTrail}>🚤 {selectedPlanOption.conditions.launchAccess}</p>
                )}
                {selectedPlanOption.conditions.specialNotes && (
                  <p style={styles.condNote}>{selectedPlanOption.conditions.specialNotes}</p>
                )}
              </div>
            )}

            {/* Travel */}
            <div style={styles.detailCard}>
              <h3 style={styles.detailCardTitle}>🚗 TRAVEL</h3>
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
                  <div style={{fontSize: '11px', color: '#8B949E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>✈️ Flight Estimates</div>
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
                <h3 style={styles.detailCardTitle}>🏨 LODGING OPTIONS</h3>
                <div style={styles.lodgingList}>
                  {selectedPlanOption.lodging.map((lodge, idx) => (
                    <div key={idx} style={styles.lodgeCard}>
                      <div style={styles.lodgeTop}>
                        <span style={styles.lodgeName}>{lodge.name}</span>
                        <span style={styles.lodgePrice}>${lodge.pricePerNight}<span style={{fontSize: '10px', color: '#6E7681'}}>/night</span></span>
                      </div>
                      {lodge.rating && (
                        <div style={styles.lodgeRating}>{'⭐'.repeat(Math.min(Math.round(lodge.rating), 5))} <span style={{color: '#6E7681', fontSize: '11px'}}>{lodge.rating}</span></div>
                      )}
                      <p style={styles.lodgeHighlights}>{lodge.highlights}</p>
                      {lodge.bookingNote && <p style={styles.lodgeBooking}>💡 {lodge.bookingNote}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dining */}
            {selectedPlanOption.dining && selectedPlanOption.dining.length > 0 && (
              <div style={styles.detailCard}>
                <h3 style={styles.detailCardTitle}>🍽️ DINING</h3>
                {selectedPlanOption.dining.map((place, idx) => (
                  <div key={idx} style={styles.diningRow}>
                    <div style={styles.diningTop}>
                      <span style={styles.diningName}>{place.name}</span>
                      <span style={styles.diningPrice}>{place.priceRange}</span>
                    </div>
                    <p style={styles.diningNote}>{place.type} · {place.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rentals */}
            {selectedPlanOption.rentals?.available && (
              <div style={styles.detailCard}>
                <h3 style={styles.detailCardTitle}>🎿 RENTALS & GEAR</h3>
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
                <h3 style={styles.detailCardTitle}>💰 ESTIMATED COST</h3>
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
                <h3 style={styles.detailCardTitle}>📋 PERMITS REQUIRED</h3>
                <p style={styles.infoNote}>{selectedPlanOption.permits.details}</p>
                {selectedPlanOption.permits.cost > 0 && (
                  <p style={{...styles.condTrail, marginTop: '8px'}}>Cost: ${selectedPlanOption.permits.cost}</p>
                )}
              </div>
            )}

            {/* Packing List */}
            {selectedPlanOption.packingList && selectedPlanOption.packingList.length > 0 && (
              <div style={styles.detailCard}>
                <h3 style={styles.detailCardTitle}>🎒 PACKING LIST</h3>
                <div style={styles.packingGrid}>
                  {selectedPlanOption.packingList.map((item, idx) => (
                    <div key={idx} style={styles.packingItem}>
                      <span style={{color: '#C9A962', marginRight: '8px'}}>○</span>
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
                    🚀 Create Trip
                  </button>
                  <div style={styles.redoRow}>
                    <button style={styles.digDeeperBtn} onClick={() => { setSelectedPlanOption(null); handleFindOptions(); }}>
                      🔍 Dig Deeper
                    </button>
                    <button style={styles.redoButton} onClick={() => { setSelectedPlanOption(null); handleFindOptions(); }}>
                      🔄 Redo Search
                    </button>
                  </div>
                </>
              ) : (
                <div style={styles.tripCreatedBanner}>
                  <span style={{fontSize: '24px'}}>✅</span>
                  <div>
                    <strong style={{display: 'block', marginBottom: '4px'}}>Trip Created!</strong>
                    <span style={{fontSize: '12px', color: '#8B949E'}}>Added to {currentCrew.name}'s upcoming trips</span>
                  </div>
                </div>
              )}
              {tripCreated && (
                <div style={{display: 'flex', gap: '8px'}}>
                  <button style={styles.viewTripBtn} onClick={() => { setActiveTab('home'); handleReset(); }}>
                    🏠 View on Home
                  </button>
                  <button style={styles.planAnotherBtn} onClick={handleReset}>
                    🗺️ Plan Another
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const CrewScreen = () => (
    <div style={styles.screen}>
      <div style={styles.crewHeader}>
        <h1 style={styles.crewTitle}>{currentCrew.name}</h1>
        <button style={styles.inviteButton}>+ Invite</button>
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
          <div key={member.id} style={styles.memberCard}>
            <div style={styles.memberAvatar}>{member.avatar}</div>
            <h3 style={styles.memberName}>{member.name}</h3>
            <p style={styles.memberRole}>{member.role}</p>
            {member.city && (
              <p style={{fontSize: '10px', color: '#6E7681', margin: '2px 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'}}>
                <span>📍</span> {member.city}
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
                <div style={styles.memberBinki}>👶 x{member.binki}</div>
              )}
            </div>
            <p style={styles.memberBirthday}>🎂 {member.birthday}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const AwardsScreen = () => (
    <div style={styles.screen}>
      <div style={styles.awardsHeader}>
        <h1 style={styles.awardsTitle}>Awards</h1>
      </div>

      <div style={styles.binkiSection}>
        <div style={styles.binkiHeader}>
          <span style={styles.binkiIcon}>👶</span>
          <h2 style={styles.binkiTitle}>Binki Leaderboard</h2>
        </div>
        <p style={styles.binkiDesc}>Who's lost their cool the most?</p>
        <div style={styles.binkiList}>
          {[...currentCrew.members].sort((a, b) => b.binki - a.binki).map((member, idx) => (
            <div key={member.id} style={styles.binkiRow}>
              <span style={styles.binkiRank}>#{idx + 1}</span>
              <span style={styles.binkiAvatar}>{member.avatar}</span>
              <span style={styles.binkiName}>{member.name}</span>
              <span style={styles.binkiCount}>
                {member.binki > 0 ? Array(Math.min(member.binki, 5)).fill('👶').join('') : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Awards</h2>
        <div style={styles.awardsGrid}>
          {awards.slice(0, 18).map(award => (
            <button
              key={award.id}
              style={{
                ...styles.awardCard,
                borderColor: award.color === '#C9A962' ? 'rgba(201,169,98,0.3)' : 
                             award.color === '#B56565' ? 'rgba(181,101,101,0.3)' : 'rgba(139,148,158,0.2)',
              }}
              onClick={() => { setSelectedAward(award); setShowAwardModal(true); }}
            >
              <span style={styles.awardIconLarge}>{award.icon}</span>
              <span style={styles.awardName}>{award.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // LIVE SCREEN - Map + Chat + Location Sharing
  // ============================================
  const LiveScreen = () => {
    const [liveTab, setLiveTab] = useState('map');
    const [messageText, setMessageText] = useState('');
    const [sharingLocation, setSharingLocation] = useState(true);

    // Simulated crew locations (would be real GPS in production)
    const crewLocations = [
      { id: 1, name: 'Bryce', avatar: '🏔️', lat: 43.8231, lng: -110.0725, status: 'moving', speed: '35 mph', lastUpdate: '1m ago', battery: 78 },
      { id: 2, name: 'Jake', avatar: '🎿', lat: 43.8245, lng: -110.0698, status: 'stopped', speed: '0 mph', lastUpdate: '2m ago', battery: 45 },
      { id: 3, name: 'Mike', avatar: '🛷', lat: 43.8198, lng: -110.0751, status: 'moving', speed: '28 mph', lastUpdate: '30s ago', battery: 92 },
      { id: 4, name: 'Tyler', avatar: '🏂', lat: 43.8212, lng: -110.0680, status: 'moving', speed: '42 mph', lastUpdate: '1m ago', battery: 63 },
      { id: 5, name: 'Dave', avatar: '🎣', lat: 43.8267, lng: -110.0712, status: 'stopped', speed: '0 mph', lastUpdate: '5m ago', battery: 34 },
      { id: 6, name: 'Chris', avatar: '⛵', lat: 43.8189, lng: -110.0695, status: 'moving', speed: '31 mph', lastUpdate: '45s ago', battery: 81 },
    ];

    // Simulated chat messages
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

    // Quick message presets
    const quickMessages = [
      { icon: '👍', text: 'All good!' },
      { icon: '⏸️', text: 'Stopping' },
      { icon: '⛽', text: 'Need fuel' },
      { icon: '🔧', text: 'Mech issue' },
      { icon: '📍', text: 'Meet here' },
      { icon: '🚨', text: 'SOS' },
    ];

    return (
      <div style={styles.screen}>
        {/* Header */}
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
          
          {/* Toggle */}
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
          <div style={styles.mapContainer}>
            <div style={styles.mapView}>
              {/* Crew markers */}
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
              
              {/* Map controls */}
              <div style={styles.mapControls}>
                <button style={styles.mapControlButton}>+</button>
                <button style={styles.mapControlButton}>−</button>
                <button style={styles.mapControlButton}>◎</button>
              </div>
            </div>

            {/* Quick Actions */}
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

            {/* Quick Messages */}
            <div style={styles.quickMessages}>
              {quickMessages.map((qm, idx) => (
                <button key={idx} style={{
                  ...styles.quickMessageButton,
                  ...(qm.text === 'SOS' ? {background: 'rgba(181,101,101,0.2)', borderColor: '#B56565'} : {}),
                }}>
                  {qm.icon}
                </button>
              ))}
            </div>

            {/* Input */}
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

            {/* Group Stats */}
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

  // ============================================
  // GAMES SCREEN - Correlated with Activities
  // ============================================
  const GamesScreen = () => {
    const [gamesFilter, setGamesFilter] = useState('all');
    
    // Games organized by category - correlated with activities
    const allGames = [
      // Drinking Games
      { id: 'roulette', icon: '🎲', name: 'Trip Roulette', desc: 'Spin to see who buys next round', category: 'drinking', players: '2+' },
      { id: 'wyr', icon: '❓', name: 'Would You Rather', desc: 'Adventure edition dilemmas', category: 'drinking', players: '3+' },
      { id: 'truth', icon: '🎯', name: 'Truth or Dare', desc: 'Custom trip dares', category: 'drinking', players: '3+' },
      { id: 'never', icon: '🙅', name: 'Never Have I Ever', desc: 'Outdoor adventure edition', category: 'drinking', players: '4+' },
      { id: 'kings', icon: '👑', name: 'Kings Cup', desc: 'Classic card drinking game', category: 'drinking', players: '4+' },
      { id: 'flip', icon: '🍺', name: 'Flip Cup', desc: 'Team relay race', category: 'drinking', players: '6+' },
      { id: 'beer', icon: '🏓', name: 'Beer Pong', desc: 'Tournament brackets', category: 'drinking', players: '4+' },
      { id: 'waterfall', icon: '💧', name: 'Waterfall', desc: 'Sync drinking challenge', category: 'drinking', players: '4+' },
      
      // Adventure/Motorsport Games
      { id: 'stuckbet', icon: '🪨', name: 'Stuck Bets', desc: 'Bet on who gets stuck first', category: 'adventure', players: '2+' },
      { id: 'leadfoot', icon: '⚡', name: 'Lead Foot Race', desc: 'Timed trail competition', category: 'adventure', players: '2+' },
      { id: 'mechanic', icon: '🔧', name: 'Mechanic Challenge', desc: 'First to fix wins', category: 'adventure', players: '2+' },
      { id: 'yardsale', icon: '💥', name: 'Yard Sale Bingo', desc: 'Mark off wipeout types', category: 'adventure', players: '2+' },
      
      // Water Sports Games
      { id: 'fishderby', icon: '🎣', name: 'Fishing Derby', desc: 'Track catches & points', category: 'water', players: '2+' },
      { id: 'biggestfish', icon: '🐟', name: 'Biggest Catch', desc: 'Measure and compete', category: 'water', players: '2+' },
      { id: 'wakegames', icon: '🏄', name: 'Wake Olympics', desc: 'Trick competition', category: 'water', players: '2+' },
      { id: 'captain', icon: '⚓', name: 'Captain Challenge', desc: 'Docking competition', category: 'water', players: '2+' },
      { id: 'tubing', icon: '🛟', name: 'Tubing Survivor', desc: 'Last one on wins', category: 'water', players: '2+' },
      
      // Winter Sports Games
      { id: 'firstchair', icon: '🎿', name: 'First Chair', desc: 'Most runs wins', category: 'winter', players: '2+' },
      { id: 'powderhunt', icon: '❄️', name: 'Powder Hunt', desc: 'Find the best stash', category: 'winter', players: '2+' },
      { id: 'treerun', icon: '🌲', name: 'Tree Run Race', desc: 'Timed tree skiing', category: 'winter', players: '2+' },
      
      // Girls Trip Games
      { id: 'winebingo', icon: '🍷', name: 'Wine Bingo', desc: 'Tasting note bingo', category: 'girlstrip', players: '2+' },
      { id: 'hotgoss', icon: '☕', name: 'Hot Goss', desc: 'Spill the tea game', category: 'girlstrip', players: '3+' },
      { id: 'compliment', icon: '💕', name: 'Compliment Battle', desc: 'Hype each other up', category: 'girlstrip', players: '3+' },
      { id: 'confessions', icon: '🤫', name: 'Confessions', desc: 'Anonymous secrets reveal', category: 'girlstrip', players: '4+' },
      { id: 'bestdressed', icon: '👗', name: 'Best Dressed', desc: 'Daily outfit vote', category: 'girlstrip', players: '3+' },
      { id: 'photochallenge', icon: '📸', name: 'Photo Challenge', desc: 'Daily photo prompts', category: 'girlstrip', players: '2+' },
      { id: 'tworoses', icon: '🌹', name: 'Rose & Thorn', desc: 'Share highs and lows', category: 'girlstrip', players: '3+' },
      
      // Betting & Competition
      { id: 'predict', icon: '🔮', name: 'Trip Predictions', desc: 'Bet on who does what', category: 'betting', players: '3+' },
      { id: 'bingo', icon: '📋', name: 'Trip Bingo', desc: 'Mark off things that happen', category: 'betting', players: '2+' },
      { id: 'over', icon: '📊', name: 'Over/Under', desc: 'Guess stats for the day', category: 'betting', players: '2+' },
      { id: 'brackets', icon: '🏅', name: 'Brackets', desc: 'Tournament style anything', category: 'betting', players: '4+' },
      
      // Decision Making
      { id: 'picker', icon: '🎰', name: 'Random Picker', desc: 'Who does what?', category: 'decide', players: '2+' },
      { id: 'vote', icon: '👆', name: 'Quick Vote', desc: 'Group decisions fast', category: 'decide', players: '3+' },
      { id: 'dice', icon: '🎲', name: 'Dice Roll', desc: 'Let fate decide', category: 'decide', players: '1+' },
      { id: 'spinner', icon: '🎡', name: 'Custom Spinner', desc: 'Add your own options', category: 'decide', players: '2+' },
      
      // Social & Icebreakers
      { id: 'hot', icon: '🔥', name: 'Hot Takes', desc: 'Controversial opinions', category: 'social', players: '3+' },
      { id: 'superlatives', icon: '🏆', name: 'Superlatives', desc: 'Vote most likely to...', category: 'social', players: '4+' },
      { id: 'secrets', icon: '🤫', name: 'Two Truths One Lie', desc: 'Guess the lie', category: 'social', players: '3+' },
      { id: 'roast', icon: '🔥', name: 'Roast Battle', desc: 'Friendly roasting', category: 'social', players: '4+' },
      
      // Wellness Challenges
      { id: 'dry', icon: '🚫', name: 'Dry Challenge', desc: 'No alcohol tracker', category: 'wellness', players: '1+' },
      { id: 'steps', icon: '👟', name: 'Step Challenge', desc: 'Daily step competition', category: 'wellness', players: '2+' },
      { id: 'sunrise', icon: '🌅', name: 'Sunrise Club', desc: 'Early riser points', category: 'wellness', players: '2+' },
      { id: 'unplug', icon: '📵', name: 'Phone Stack', desc: 'First to touch pays', category: 'wellness', players: '3+' },
    ];
    
    const gameCategories = [
      { id: 'all', label: 'All', icon: '🎮' },
      { id: 'drinking', label: 'Drinking', icon: '🍺' },
      { id: 'adventure', label: 'Adventure', icon: '🏎️' },
      { id: 'water', label: 'Water', icon: '🌊' },
      { id: 'winter', label: 'Winter', icon: '❄️' },
      { id: 'girlstrip', label: 'Girls Trip', icon: '💅' },
      { id: 'betting', label: 'Betting', icon: '🎲' },
      { id: 'social', label: 'Social', icon: '💬' },
      { id: 'decide', label: 'Decide', icon: '🎰' },
      { id: 'wellness', label: 'Wellness', icon: '💪' },
    ];
    
    const filteredGames = gamesFilter === 'all' 
      ? allGames 
      : allGames.filter(g => g.category === gamesFilter);

    const challenges = [
      { icon: '🚫🍺', name: 'Dry Month', desc: 'No alcohol for 30 days', duration: '30 days' },
      { icon: '🏃', name: 'Trip Leader', desc: 'Everyone leads one trip', duration: 'Year' },
      { icon: '📸', name: 'Photo of Month', desc: 'Best photo wins', duration: 'Monthly' },
      { icon: '💪', name: '10K Steps', desc: 'Daily step goal', duration: 'Per trip' },
      { icon: '🌅', name: 'Early Bird', desc: 'First up makes coffee', duration: 'Per trip' },
      { icon: '👨‍🍳', name: 'Iron Chef', desc: 'Camp cooking competition', duration: 'Per trip' },
    ];

    return (
      <div style={styles.screen}>
        <div style={styles.gamesHeader}>
          <h1 style={styles.gamesTitle}>Games</h1>
        </div>

        {/* Game Category Filters */}
        <div style={styles.categoryTabs}>
          {gameCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setGamesFilter(cat.id)}
              style={{
                ...styles.categoryTab,
                ...(gamesFilter === cat.id ? styles.categoryTabActive : {}),
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div style={styles.gamesGrid}>
          {filteredGames.map((game) => (
            <div key={game.id} style={styles.gameCard}>
              <div style={styles.gameCardTop}>
                <span style={styles.gameIcon}>{game.icon}</span>
                <span style={styles.gamePlayers}>{game.players}</span>
              </div>
              <h3 style={styles.gameName}>{game.name}</h3>
              <p style={styles.gameDesc}>{game.desc}</p>
              <button style={styles.gameButton}>Play</button>
            </div>
          ))}
        </div>

        {/* Challenges Section */}
        <div style={{...styles.section, marginTop: '28px'}}>
          <h2 style={styles.sectionTitle}>Group Challenges</h2>
          <div style={styles.challengesList}>
            {challenges.map((challenge, idx) => (
              <div key={idx} style={styles.challengeRow}>
                <span style={styles.challengeIcon}>{challenge.icon}</span>
                <div style={styles.challengeInfo}>
                  <span style={styles.challengeName}>{challenge.name}</span>
                  <span style={styles.challengeDesc}>{challenge.desc}</span>
                </div>
                <span style={styles.challengeDuration}>{challenge.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Tools</h2>
          <div style={styles.quickTools}>
            {[
              { icon: '🎰', name: 'Picker' },
              { icon: '👆', name: 'Vote' },
              { icon: '🎲', name: 'Dice' },
              { icon: '🪙', name: 'Flip' },
              { icon: '⏱️', name: 'Timer' },
              { icon: '🔢', name: 'Score' },
            ].map((tool, idx) => (
              <button key={idx} style={styles.quickToolButton}>
                <span style={styles.quickToolIcon}>{tool.icon}</span>
                <span style={styles.quickToolName}>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={styles.app}>
      <div style={styles.statusBar} />
      <div style={styles.content}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'plan' && <PlanScreen />}
        {activeTab === 'live' && <LiveScreen />}
        {activeTab === 'memories' && <MemoriesScreen />}
        {activeTab === 'crew' && <CrewScreen />}
        {activeTab === 'awards' && <AwardsScreen />}
        {activeTab === 'games' && <GamesScreen />}
      </div>
      <TabBar />
      
      {/* Modals */}
      {showCrewSwitcher && <CrewSwitcher />}
      {selectedTrip && <TripDetail trip={selectedTrip} />}
      {showBookPreview && <BookPreview />}
    </div>
  );
};

// ============================================
// STYLES
// ============================================

const styles = {
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

  // Logo - Classic Ritz "Party of Six" Gold Branding
  logoContainer: { textAlign: 'center', paddingTop: '4px' },
  logoTopLine: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  logoLineGradientLeft: { 
    width: '40px', 
    height: '1px', 
    background: 'linear-gradient(90deg, transparent, #C9A962)',
  },
  logoLineGradientRight: { 
    width: '40px', 
    height: '1px', 
    background: 'linear-gradient(90deg, #C9A962, transparent)',
  },
  logoEstText: { 
    fontSize: '9px', 
    letterSpacing: '3px', 
    color: '#C9A962',
    fontWeight: '400',
  },
  logoMain: { 
    display: 'flex', 
    alignItems: 'baseline', 
    justifyContent: 'center',
    gap: '10px',
  },
  logoParty: { 
    fontSize: '32px', 
    fontWeight: '300', 
    letterSpacing: '6px',
    color: '#C9A962',
    fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
  },
  logoOf: { 
    fontSize: '20px', 
    fontStyle: 'italic',
    fontWeight: '300',
    color: '#8B949E',
    fontFamily: "'Cormorant Garamond', 'Times New Roman', Georgia, serif",
    margin: '0 2px',
  },
  logoSix: { 
    fontSize: '32px', 
    fontWeight: '300', 
    letterSpacing: '6px',
    color: '#C9A962',
    fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
  },
  logoDivider: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: '10px',
    marginTop: '12px',
  },
  logoDividerLineLeft: { 
    width: '50px', 
    height: '1px', 
    background: 'linear-gradient(90deg, transparent, #C9A962)',
  },
  logoDividerLineRight: { 
    width: '50px', 
    height: '1px', 
    background: 'linear-gradient(90deg, #C9A962, transparent)',
  },
  logoDividerDiamond: { 
    width: '6px', 
    height: '6px', 
    background: '#C9A962', 
    transform: 'rotate(45deg)',
  },
  logoTagline: { 
    fontSize: '9px', 
    letterSpacing: '4px', 
    color: '#6E7681',
    marginTop: '12px',
    marginBottom: '0',
    fontWeight: '400',
  },

  // Crew Selector - Subtle pill below logo
  crewSelector: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(201,169,98,0.08)',
    border: '1px solid rgba(201,169,98,0.2)',
    borderRadius: '20px',
    color: '#C9A962',
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  crewSelectorIcon: { fontSize: '14px' },
  crewSelectorName: { fontWeight: '500', letterSpacing: '0.5px' },
  crewSelectorDot: { color: '#6E7681', fontSize: '8px' },
  crewSelectorEst: { color: '#6E7681', fontSize: '10px', fontWeight: '400' },
  crewSelectorArrow: { color: '#6E7681', fontSize: '10px', marginLeft: '4px' },

  // Tab Bar
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 8px 28px',
    background: 'linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.95) 20%, #0D0D0D 100%)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    color: '#6E7681',
    cursor: 'pointer',
    borderRadius: '12px',
  },
  tabButtonActive: { color: '#C9A962', background: 'rgba(201,169,98,0.1)' },
  tabIcon: { fontSize: '22px' },
  tabLabel: { fontSize: '10px', fontWeight: '500', letterSpacing: '0.5px' },

  // Hero
  heroSection: {
    padding: '28px 20px 24px',
    marginBottom: '20px',
    borderRadius: '16px',
    background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(13,13,13,0.95) 100%)',
    border: '1px solid rgba(201,169,98,0.15)',
  },
  quickStats: { display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' },
  quickStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNumber: { fontSize: '28px', fontWeight: '300', color: '#C9A962', fontFamily: "'Playfair Display', Georgia, serif" },
  statLabel: { fontSize: '9px', color: '#6E7681', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '2px' },

  // Quick Actions
  quickActions: { display: 'flex', gap: '12px', marginBottom: '28px' },
  primaryAction: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
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
  secondaryAction: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },

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

  // Trip Cards
  tripCards: { display: 'flex', gap: '12px', overflowX: 'auto', margin: '0 -16px', padding: '0 16px' },
  tripCard: {
    minWidth: '160px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  tripCardCover: {
    height: '80px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
  },
  tripCardContent: { padding: '12px' },
  tripCardActivity: { fontSize: '16px' },
  tripCardName: { fontSize: '14px', fontWeight: '600', margin: '4px 0', letterSpacing: '0.3px' },
  tripCardDate: { fontSize: '11px', color: '#6E7681', margin: 0 },
  tripCardMeta: { display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', color: '#8B949E' },

  // Birthday List
  birthdayList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  birthdayItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  birthdayAvatar: { fontSize: '24px' },
  birthdayName: { flex: 1, fontSize: '14px', fontWeight: '500' },
  birthdayDate: { fontSize: '12px', color: '#C9A962' },

  // Memories Screen
  memoriesHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '16px 0',
  },
  memoriesTitle: { 
    fontSize: '24px', 
    fontWeight: '300', 
    margin: 0, 
    letterSpacing: '2px',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  bookButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  yearFilter: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
    padding: '4px 0',
  },
  yearButton: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    color: '#8B949E',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  yearButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },
  memoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  memoryCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(201,169,98,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  memoryCardCover: {
    height: '100px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  memoryCardEmoji: { fontSize: '40px' },
  memoryCardOverlay: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.6)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  memoryCardPhotoCount: { fontSize: '10px', color: '#fff' },
  memoryCardContent: { padding: '12px' },
  memoryCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  memoryCardActivity: { fontSize: '16px' },
  memoryCardYear: { fontSize: '11px', color: '#6E7681' },
  memoryCardName: { fontSize: '13px', fontWeight: '600', margin: '0 0 4px', letterSpacing: '0.3px' },
  memoryCardLocation: { fontSize: '11px', color: '#8B949E', margin: '0 0 2px' },
  memoryCardDate: { fontSize: '10px', color: '#6E7681', margin: 0 },
  memoryCardAwards: { display: 'flex', gap: '4px', marginTop: '8px', alignItems: 'center' },
  memoryCardAwardIcon: { fontSize: '14px' },
  memoryCardAwardMore: { fontSize: '10px', color: '#6E7681' },
  emptyState: { textAlign: 'center', padding: '40px 20px' },
  emptyStateIcon: { fontSize: '48px', opacity: 0.5 },
  emptyStateText: { color: '#6E7681', marginTop: '12px' },

  // Plan Screen
  planHeader: { textAlign: 'center', padding: '16px 0 16px' },
  planTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  planSubtitle: { fontSize: '12px', color: '#6E7681', margin: '8px 0 0', letterSpacing: '1px' },
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
  activityGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '10px', 
    marginBottom: '20px',
  },
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
  dateButtonActive: {
    background: 'rgba(201,169,98,0.15)',
    borderColor: '#C9A962',
    color: '#C9A962',
  },
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

  // AI Trip Planner - Configure
  configLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#C9A962',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '10px',
    marginTop: '4px',
  },
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

  // AI Trip Planner - Loading
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

  // AI Trip Planner - Results
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

  // AI Trip Planner - Detail View
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

  // Crew Screen
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
  },
  memberAvatar: { fontSize: '36px', marginBottom: '8px' },
  memberName: { fontSize: '15px', fontWeight: '500', margin: '0 0 2px' },
  memberRole: { fontSize: '11px', color: '#6E7681', margin: '0 0 10px' },
  memberAwards: { display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '10px', fontSize: '16px' },
  memberStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  memberStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  memberStatNum: { fontSize: '16px', fontWeight: '600' },
  memberStatLabel: { fontSize: '9px', color: '#6E7681' },
  memberBinki: { padding: '3px 6px', background: 'rgba(181,101,101,0.2)', borderRadius: '6px', fontSize: '11px' },
  memberBirthday: { fontSize: '11px', color: '#6E7681', margin: 0 },

  // Awards Screen
  awardsHeader: { textAlign: 'center', padding: '16px 0 24px' },
  awardsTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  binkiSection: {
    background: 'linear-gradient(135deg, rgba(181,101,101,0.1) 0%, rgba(181,101,101,0.05) 100%)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '28px',
    border: '1px solid rgba(181,101,101,0.2)',
  },
  binkiHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
  binkiIcon: { fontSize: '28px' },
  binkiTitle: { fontSize: '16px', fontWeight: '500', margin: 0 },
  binkiDesc: { fontSize: '12px', color: '#8B949E', margin: '0 0 16px' },
  binkiList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  binkiRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' },
  binkiRank: { fontSize: '12px', fontWeight: '600', color: '#B56565', width: '28px' },
  binkiAvatar: { fontSize: '20px' },
  binkiName: { flex: 1, fontSize: '13px', fontWeight: '500' },
  binkiCount: { fontSize: '14px' },
  awardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  awardCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  awardIconLarge: { fontSize: '28px', marginBottom: '6px' },
  awardName: { fontSize: '10px', color: '#8B949E', textAlign: 'center' },

  // Games Screen
  gamesHeader: { textAlign: 'center', padding: '16px 0 20px' },
  gamesTitle: { fontSize: '24px', fontWeight: '300', margin: 0, letterSpacing: '2px', fontFamily: "'Playfair Display', Georgia, serif" },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  gameCard: {
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(201,169,98,0.12)',
  },
  gameCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  gameIcon: { fontSize: '24px' },
  gamePlayers: { 
    fontSize: '10px', 
    color: '#6E7681', 
    background: 'rgba(255,255,255,0.05)', 
    padding: '3px 8px', 
    borderRadius: '4px',
  },
  gameName: { fontSize: '13px', fontWeight: '600', margin: '0 0 4px', letterSpacing: '0.3px' },
  gameDesc: { fontSize: '11px', color: '#6E7681', margin: '0 0 10px', lineHeight: '1.3' },
  gameButton: {
    width: '100%',
    padding: '8px',
    background: 'transparent',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '6px',
    color: '#C9A962',
    fontWeight: '500',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  challengesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  challengeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(201,169,98,0.08)',
  },
  challengeIcon: { fontSize: '24px' },
  challengeInfo: { flex: 1 },
  challengeName: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '2px' },
  challengeDesc: { display: 'block', fontSize: '11px', color: '#6E7681' },
  challengeDuration: { 
    fontSize: '9px', 
    color: '#C9A962', 
    background: 'rgba(201,169,98,0.1)', 
    padding: '4px 8px', 
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  quickTools: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
  },
  quickToolButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 6px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(201,169,98,0.1)',
    borderRadius: '8px',
    color: '#E6EDF3',
    cursor: 'pointer',
  },
  quickToolIcon: { fontSize: '20px' },
  quickToolName: { fontSize: '9px', color: '#6E7681' },

  // Live Screen - Map & Chat
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

  // Map View
  mapContainer: {},
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

  // Chat View
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
  quickMessages: {
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

  // List View
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

  // Crew Switcher Modal
  crewList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  crewOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '2px solid transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  crewOptionActive: { background: 'rgba(201,169,98,0.1)' },
  crewOptionIcon: { fontSize: '32px' },
  crewOptionInfo: { flex: 1 },
  crewOptionName: { display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '2px' },
  crewOptionTagline: { display: 'block', fontSize: '11px', color: '#8B949E', marginBottom: '4px' },
  crewOptionStats: { display: 'block', fontSize: '10px', color: '#6E7681' },
  crewOptionEstablished: { fontSize: '10px', color: '#C9A962', alignSelf: 'flex-start' },
  addCrewButton: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '1px dashed rgba(201,169,98,0.3)',
    borderRadius: '10px',
    color: '#C9A962',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  // Trip Detail Modal
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
  tripDetailHeaderContent: {},
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

  // Trip Detail - AI Plan Data
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

  // Book Preview Modal
  bookPreviewModal: {
    width: '100%',
    maxWidth: '400px',
    maxHeight: '85vh',
    background: '#1A1A1A',
    borderRadius: '16px',
    border: '1px solid rgba(201,169,98,0.2)',
    overflowY: 'auto',
  },
  bookCover: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    padding: '32px 24px',
    borderBottom: '1px solid rgba(201,169,98,0.2)',
  },
  bookCoverInner: {
    border: '2px solid #C9A962',
    borderRadius: '4px',
    padding: '32px 24px',
    textAlign: 'center',
  },
  bookEstablished: { fontSize: '10px', color: '#C9A962', letterSpacing: '3px', marginBottom: '16px' },
  bookIcon: { fontSize: '48px', marginBottom: '12px' },
  bookTitle: { fontSize: '24px', fontWeight: '300', margin: '0 0 4px', fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '2px' },
  bookSubtitle: { fontSize: '12px', color: '#8B949E', letterSpacing: '2px', textTransform: 'uppercase' },
  bookDivider: { color: '#C9A962', margin: '16px 0', fontSize: '12px' },
  bookStats: { fontSize: '11px', color: '#6E7681' },
  bookYears: { fontSize: '12px', color: '#C9A962', marginTop: '8px' },
  bookOptions: { padding: '24px' },
  bookOptionsTitle: { fontSize: '16px', fontWeight: '500', margin: '0 0 8px', textAlign: 'center' },
  bookOptionsDesc: { fontSize: '12px', color: '#8B949E', textAlign: 'center', marginBottom: '20px' },
  bookFormats: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  bookFormatOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  bookFormatOptionPremium: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(201,169,98,0.1)',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
  },
  bookFormatIcon: { fontSize: '24px' },
  bookFormatName: { flex: 1, fontSize: '14px', fontWeight: '500' },
  bookFormatPrice: { fontSize: '14px', color: '#C9A962', fontWeight: '500' },
  bookFormatBadge: {
    position: 'absolute',
    top: '-8px',
    right: '12px',
    background: '#C9A962',
    color: '#0D0D0D',
    fontSize: '9px',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bookIncluded: { marginBottom: '20px' },
  bookIncludedTitle: { fontSize: '12px', color: '#8B949E', marginBottom: '10px' },
  bookIncludedList: { margin: 0, padding: 0, listStyle: 'none' },
  bookCreateButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0D0D0D',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default PartyOfSixApp;
