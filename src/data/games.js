// Party of Six - Games Data
// Correlates with Activities - games for different trip types

export const gameCategories = [
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

export const games = [
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

// Group challenges (longer term)
export const challenges = [
  { id: 'drymonth', icon: '🚫🍺', name: 'Dry Month', desc: 'No alcohol for 30 days', duration: '30 days' },
  { id: 'tripleader', icon: '🏃', name: 'Trip Leader', desc: 'Everyone leads one trip', duration: 'Year' },
  { id: 'photomonth', icon: '📸', name: 'Photo of Month', desc: 'Best photo wins', duration: 'Monthly' },
  { id: 'fitness', icon: '💪', name: '10K Steps', desc: 'Daily step goal', duration: 'Per trip' },
  { id: 'earlybird', icon: '🌅', name: 'Early Bird', desc: 'First up makes coffee', duration: 'Per trip' },
  { id: 'ironchef', icon: '👨‍🍳', name: 'Iron Chef', desc: 'Camp cooking competition', duration: 'Per trip' },
];

// Quick tools
export const quickTools = [
  { id: 'picker', icon: '🎰', name: 'Picker' },
  { id: 'vote', icon: '👆', name: 'Vote' },
  { id: 'dice', icon: '🎲', name: 'Dice' },
  { id: 'flip', icon: '🪙', name: 'Flip' },
  { id: 'timer', icon: '⏱️', name: 'Timer' },
  { id: 'score', icon: '🔢', name: 'Score' },
];

export default games;
