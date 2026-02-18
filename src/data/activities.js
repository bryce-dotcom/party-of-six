// Party of Six - Activities Data
// Organized by category, correlates with Awards and Games

export const activityCategories = [
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

export const activities = [
  // Adventure & Motorsports
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
  
  // Travel
  { id: 'travel', icon: '✈️', label: 'Travel', category: 'travel' },
  { id: 'roadtrip', icon: '🚗', label: 'Road Trip', category: 'travel' },
  { id: 'cruise', icon: '🚢', label: 'Cruise', category: 'travel' },
  { id: 'vegas', icon: '🎰', label: 'Vegas Trip', category: 'travel' },
  
  // Events & Entertainment
  { id: 'concert', icon: '🎸', label: 'Concert', category: 'events' },
  { id: 'sports', icon: '🏟️', label: 'Sports Game', category: 'events' },
  { id: 'festival', icon: '🎪', label: 'Festival', category: 'events' },
  { id: 'theme', icon: '🎢', label: 'Theme Park', category: 'events' },
  
  // Girls Trips & Wellness
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

// Group activities by category
export const getActivityGroups = () => {
  const groups = [
    { id: 'adventure', label: 'Adventure & Motorsports', icon: '🏎️' },
    { id: 'winter', label: 'Winter Sports', icon: '❄️' },
    { id: 'water', label: 'Water Activities', icon: '🌊' },
    { id: 'outdoor', label: 'Outdoor & Nature', icon: '🏕️' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'events', label: 'Events & Entertainment', icon: '🎸' },
    { id: 'girlstrip', label: 'Girls Trip & Wellness', icon: '💅' },
    { id: 'celebration', label: 'Celebrations', icon: '🎉' },
  ];
  
  return groups.map(group => ({
    ...group,
    activities: activities.filter(a => a.category === group.id),
  }));
};

export default activities;
