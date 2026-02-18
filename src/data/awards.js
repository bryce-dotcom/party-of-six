// Party of Six - Awards Data
// Correlates with Activities - awards are given after trips

export const awardTypes = {
  GOLD: 'gold',     // Positive achievements
  SHAME: 'shame',   // Funny fails (like Binki)
  NEUTRAL: 'neutral', // Funny/neutral observations
};

export const awardCategories = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'classic', label: 'Classic', icon: '⭐' },
  { id: 'adventure', label: 'Adventure', icon: '🏎️' },
  { id: 'navigation', label: 'Navigation', icon: '🧭' },
  { id: 'safety', label: 'Safety', icon: '🩹' },
  { id: 'water', label: 'Water', icon: '🌊' },
  { id: 'winter', label: 'Winter', icon: '❄️' },
  { id: 'social', label: 'Social', icon: '🎉' },
  { id: 'girlstrip', label: 'Girls Trip', icon: '💅' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'shame', label: 'Wall of Shame', icon: '👶' },
];

export const awards = [
  // Classic Awards
  { id: 'binki', icon: '👶', name: 'Binki Award', desc: 'Lost their cool', type: awardTypes.SHAME, category: 'classic' },
  { id: 'mvp', icon: '🏆', name: 'MVP', desc: 'Most valuable member', type: awardTypes.GOLD, category: 'classic' },
  { id: 'rookie', icon: '🌟', name: 'Rookie of Trip', desc: 'First timer who crushed it', type: awardTypes.GOLD, category: 'classic' },
  
  // Adventure / Motorsports
  { id: 'sendIt', icon: '🚀', name: 'Send It!', desc: 'Committed to something sketchy', type: awardTypes.GOLD, category: 'adventure' },
  { id: 'yardsale', icon: '💥', name: 'Yard Sale', desc: 'Epic wipeout, gear everywhere', type: awardTypes.SHAME, category: 'adventure' },
  { id: 'mechanic', icon: '🔧', name: 'Trail Mechanic', desc: 'Saved the day with repairs', type: awardTypes.GOLD, category: 'adventure' },
  { id: 'stuck', icon: '🪨', name: 'Stuck Award', desc: 'Most creative way to get stuck', type: awardTypes.SHAME, category: 'adventure' },
  { id: 'leadfoot', icon: '⚡', name: 'Lead Foot', desc: 'Fastest of the trip', type: awardTypes.GOLD, category: 'adventure' },
  { id: 'tortoise', icon: '🐢', name: 'The Tortoise', desc: 'Slowest but made it', type: awardTypes.NEUTRAL, category: 'adventure' },
  
  // Navigation & Outdoors
  { id: 'navigator', icon: '🧭', name: 'Navigator', desc: 'Never gets lost', type: awardTypes.GOLD, category: 'navigation' },
  { id: 'lost', icon: '❓', name: 'Where Am I?', desc: 'Got everyone lost', type: awardTypes.SHAME, category: 'navigation' },
  { id: 'trailblazer', icon: '🗺️', name: 'Trailblazer', desc: 'Found the best spot', type: awardTypes.GOLD, category: 'navigation' },
  { id: 'earlybird', icon: '🌅', name: 'Early Bird', desc: 'First one ready', type: awardTypes.GOLD, category: 'navigation' },
  { id: 'sleepyhead', icon: '😴', name: 'Sleepyhead', desc: 'Last one out of bed', type: awardTypes.NEUTRAL, category: 'navigation' },
  
  // Safety & Survival
  { id: 'medic', icon: '🩹', name: 'Trail Medic', desc: 'Patched someone up', type: awardTypes.GOLD, category: 'safety' },
  { id: 'survivor', icon: '🏕️', name: 'Survivor', desc: 'Powered through adversity', type: awardTypes.GOLD, category: 'safety' },
  { id: 'weatherman', icon: '🌧️', name: 'Weatherman', desc: 'Called conditions right', type: awardTypes.GOLD, category: 'safety' },
  { id: 'jinx', icon: '🌩️', name: 'The Jinx', desc: 'Brought bad luck', type: awardTypes.SHAME, category: 'safety' },
  
  // Water Sports
  { id: 'captain', icon: '⚓', name: 'Captain', desc: 'Best boat handling', type: awardTypes.GOLD, category: 'water' },
  { id: 'overboard', icon: '🌊', name: 'Man Overboard', desc: 'Took an unexpected swim', type: awardTypes.SHAME, category: 'water' },
  { id: 'bigcatch', icon: '🐟', name: 'Big Catch', desc: 'Landed the biggest fish', type: awardTypes.GOLD, category: 'water' },
  { id: 'skunked', icon: '🦨', name: 'Skunked', desc: "Didn't catch anything", type: awardTypes.NEUTRAL, category: 'water' },
  { id: 'wakeking', icon: '🏄', name: 'Wake King/Queen', desc: 'Best on the water', type: awardTypes.GOLD, category: 'water' },
  
  // Winter Sports
  { id: 'powderhound', icon: '❄️', name: 'Powder Hound', desc: 'Found the best snow', type: awardTypes.GOLD, category: 'winter' },
  { id: 'frostbite', icon: '🥶', name: 'Frostbite', desc: 'Forgot proper gear', type: awardTypes.SHAME, category: 'winter' },
  
  // Photography
  { id: 'photographer', icon: '📸', name: 'Shot of Trip', desc: 'Best photo', type: awardTypes.GOLD, category: 'social' },
  { id: 'influencer', icon: '📱', name: 'The Influencer', desc: 'Most time on phone', type: awardTypes.NEUTRAL, category: 'social' },
  
  // Food & Provisions
  { id: 'provisions', icon: '🍺', name: 'Best Provisions', desc: 'Best snacks/drinks', type: awardTypes.GOLD, category: 'social' },
  { id: 'chef', icon: '👨‍🍳', name: 'Camp Chef', desc: 'Cooked the best meal', type: awardTypes.GOLD, category: 'social' },
  { id: 'hangry', icon: '😤', name: 'Hangry Award', desc: 'Got cranky before food', type: awardTypes.SHAME, category: 'social' },
  
  // Social & Party
  { id: 'life', icon: '🎉', name: 'Life of Party', desc: 'Kept everyone entertained', type: awardTypes.GOLD, category: 'social' },
  { id: 'storyteller', icon: '📖', name: 'Storyteller', desc: 'Best campfire stories', type: awardTypes.GOLD, category: 'social' },
  { id: 'dj', icon: '🎵', name: 'DJ Award', desc: 'Best playlist', type: awardTypes.GOLD, category: 'social' },
  { id: 'lightweight', icon: '🍷', name: 'Lightweight', desc: 'First one down', type: awardTypes.SHAME, category: 'social' },
  { id: 'ironliver', icon: '🦾', name: 'Iron Liver', desc: 'Last one standing', type: awardTypes.GOLD, category: 'social' },
  
  // Girls Trip Specific
  { id: 'glowup', icon: '✨', name: 'Glow Up', desc: 'Best transformation', type: awardTypes.GOLD, category: 'girlstrip' },
  { id: 'therapist', icon: '💆‍♀️', name: 'Group Therapist', desc: 'Best listener', type: awardTypes.GOLD, category: 'girlstrip' },
  { id: 'hype', icon: '📣', name: 'Hype Queen', desc: 'Best at gassing up', type: awardTypes.GOLD, category: 'girlstrip' },
  { id: 'drama', icon: '🎭', name: 'Drama Award', desc: 'Most dramatic moment', type: awardTypes.SHAME, category: 'girlstrip' },
  { id: 'shopaholic', icon: '🛍️', name: 'Shopaholic', desc: 'Spent the most', type: awardTypes.NEUTRAL, category: 'girlstrip' },
  { id: 'sommelier', icon: '🍷', name: 'Sommelier', desc: 'Best wine picks', type: awardTypes.GOLD, category: 'girlstrip' },
  
  // Travel
  { id: 'planner', icon: '📋', name: 'Trip Planner', desc: 'Organized everything', type: awardTypes.GOLD, category: 'travel' },
  { id: 'flexible', icon: '🧘', name: 'Go With Flow', desc: 'Most adaptable', type: awardTypes.GOLD, category: 'travel' },
  { id: 'complainer', icon: '😩', name: 'Complainy Pants', desc: 'Found fault in everything', type: awardTypes.SHAME, category: 'travel' },
  { id: 'forgetter', icon: '🤦', name: 'The Forgetter', desc: 'Left something behind', type: awardTypes.SHAME, category: 'travel' },
  
  // Celebration
  { id: 'birthday', icon: '🎂', name: 'Birthday Star', desc: "It's their day!", type: awardTypes.GOLD, category: 'classic' },
  { id: 'newlywed', icon: '💍', name: 'Newlywed', desc: 'Just got married!', type: awardTypes.GOLD, category: 'classic' },
];

// Get color for award type
export const getAwardColor = (type) => {
  switch (type) {
    case awardTypes.GOLD: return '#C9A962';
    case awardTypes.SHAME: return '#B56565';
    case awardTypes.NEUTRAL: return '#8B949E';
    default: return '#C9A962';
  }
};

// Get border color for award type
export const getAwardBorderColor = (type) => {
  switch (type) {
    case awardTypes.GOLD: return 'rgba(201,169,98,0.3)';
    case awardTypes.SHAME: return 'rgba(181,101,101,0.3)';
    case awardTypes.NEUTRAL: return 'rgba(139,148,158,0.2)';
    default: return 'rgba(201,169,98,0.3)';
  }
};

export default awards;
