# PARTY OF SIX - Claude Development Prompt

> **⚠️ READ THIS AT THE START OF EVERY PARTY OF SIX SESSION**

---

## 🎯 WHAT IS PARTY OF SIX?

A premium PWA for friend groups to plan adventures, track trips in real-time, share memories, and build traditions. Think **"Strava meets GroupMe meets AI travel agent"** with a classy Ritz-Carlton aesthetic.

---

## 📋 BEFORE EVERY RESPONSE

1. **Read `/mnt/project/PARTY-OF-SIX-SPEC.md`** for full specifications
2. **Check the current codebase** in `/home/claude/party-of-six/`
3. **Maintain consistency** with existing code and design system
4. **Follow the Ritz aesthetic** - gold accents, dark theme, serif headlines

---

## 🎨 DESIGN SYSTEM (Quick Reference)

```javascript
// COLORS
const colors = {
  gold: '#C9A962',           // Primary accent
  darkBg: '#0D0D0D',         // Main background
  cardBg: 'rgba(255,255,255,0.02)',
  borderGold: 'rgba(201,169,98,0.15)',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  success: '#6BCB77',
  error: '#B56565',
  warning: '#FFD93D',
};

// TYPOGRAPHY
const fonts = {
  headline: "'Playfair Display', Georgia, serif",  // weight 300
  body: "'Outfit', -apple-system, sans-serif",
  accent: "'Cormorant Garamond', serif",  // italics
};

// SPACING
const layout = {
  maxWidth: '430px',
  borderRadius: '12px',
  padding: '16px',
};
```

---

## 🏛️ LOGO (Always Use This Format)

```
        ─── EST. 2026 ───
      
       PARTY  of  SIX
       (gold)  (gray) (gold)
      
         ────◆────
        
       ADVENTURES AWAIT
```

- **PARTY & SIX**: Gold (#C9A962), Playfair Display, 32px, letter-spacing 6px
- **of**: Gray (#8B949E), Cormorant Garamond italic, 20px
- **Lines**: Gold gradient fading from center
- **Diamond**: Gold, rotated 45°

---

## 📱 APP STRUCTURE (7 Tabs)

| Tab | Icon | Screen | Key Features |
|-----|------|--------|--------------|
| Home | 🏠 | `HomeScreen` | Logo, crew selector, stats, recent trips |
| Plan | 🗺️ | `PlanScreen` | Activity groups, AI planner, date selection |
| Live | 📍 | `LiveScreen` | Map, chat, location list, SOS |
| Memories | 📸 | `MemoriesScreen` | Trip history, photos, year filter |
| Crew | 👥 | `CrewScreen` | Member cards, birthdays, roles |
| Awards | 🏆 | `AwardsScreen` | Binki leaderboard, award grid |
| Games | 🎮 | `GamesScreen` | Game cards, challenges, quick tools |

---

## 🗺️ AI TRIP PLANNER FLOW

```
Activity Selected → Dates Selected → AI Analyzes:
  • Weather/conditions
  • Distance from home
  • Permits required
  • Past trips
  • Budget
  
→ AI Returns 3 Options:
  1. Best Conditions
  2. Closest  
  3. Best Value

Each Option Includes:
  • 🏨 Lodging (3 choices with prices)
  • 🚗 Travel (drive time, gas, or flights)
  • 🎿 Rentals & gear
  • 🍽️ Dining recommendations
  • 💰 Cost breakdown per person
  • 📋 Packing list

→ User Selects & Customizes
→ Trip Created
→ Crew Notified (push, calendar, voting)
```

---

## 👥 MULTI-CREW SYSTEM

Users can switch between crews. Each crew is independent:

| Crew ID | Name | Icon | Color |
|---------|------|------|-------|
| `boyz` | The Boyz | 🏔️ | Gold `#C9A962` |
| `girls` | Wine & Wanderlust | 🥂 | Rose `#D4A5A5` |
| `family` | The Fam | 👨‍👩‍👧‍👦 | Sage `#7EB5A6` |
| `couples` | The Couples Club | 💑 | Lavender `#B8A9C9` |

---

## 📂 FILE STRUCTURE

```
party-of-six/
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
├── src/
│   ├── components/
│   │   ├── Logo.jsx
│   │   ├── TabBar.jsx
│   │   ├── CrewSelector.jsx
│   │   ├── TripCard.jsx
│   │   ├── AwardCard.jsx
│   │   ├── GameCard.jsx
│   │   ├── ActivityButton.jsx
│   │   ├── MapMarker.jsx
│   │   ├── ChatBubble.jsx
│   │   └── Modal.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── PlanScreen.jsx
│   │   ├── LiveScreen.jsx
│   │   ├── MemoriesScreen.jsx
│   │   ├── CrewScreen.jsx
│   │   ├── AwardsScreen.jsx
│   │   └── GamesScreen.jsx
│   ├── hooks/
│   │   ├── useLocation.js
│   │   ├── useRealtime.js
│   │   ├── useOffline.js
│   │   └── useCrew.js
│   ├── services/
│   │   ├── supabase.js
│   │   ├── claude.js
│   │   ├── mapbox.js
│   │   └── weather.js
│   ├── data/
│   │   ├── activities.js
│   │   ├── awards.js
│   │   ├── games.js
│   │   └── mockData.js
│   ├── styles/
│   │   └── theme.js
│   ├── App.jsx
│   └── index.jsx
├── CLAUDE-PROMPT.md      ← This file
├── PARTY-OF-SIX-SPEC.md  ← Full specification
└── package.json
```

---

## 🔧 TECH STACK

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | CSS-in-JS (inline styles) |
| State | React Context + hooks |
| PWA | Vite PWA plugin |
| Backend | Supabase |
| Realtime | Supabase Realtime |
| Maps | Mapbox GL JS |
| AI | Claude API |
| Push | Firebase Cloud Messaging |

---

## 🚀 CURRENT PHASE

**Phase 1: Core MVP**
- [x] Basic PWA shell
- [x] Multi-crew support (UI)
- [x] Activity selection (grouped)
- [x] 7 tab navigation
- [x] Home screen with logo
- [x] Live screen (map/chat/list)
- [x] Memories screen
- [x] Awards screen + Binki leaderboard
- [x] Games screen
- [ ] Supabase integration
- [ ] Real Claude API for trip planning
- [ ] Authentication

---

## ✅ RESPONSE CHECKLIST

Before submitting code, verify:

- [ ] Uses gold `#C9A962` for accents
- [ ] Dark background `#0D0D0D`
- [ ] Playfair Display for headlines
- [ ] Mobile-first (430px max-width)
- [ ] Follows existing component patterns
- [ ] Maintains "PARTY of SIX" branding
- [ ] Works offline where applicable
- [ ] Consistent with PARTY-OF-SIX-SPEC.md

---

## 💡 COMMON PATTERNS

### Button Styles
```javascript
// Primary (gold gradient)
primaryButton: {
  background: 'linear-gradient(135deg, #C9A962 0%, #A8893D 100%)',
  border: 'none',
  borderRadius: '10px',
  color: '#0D0D0D',
  fontWeight: '600',
  padding: '14px',
  boxShadow: '0 4px 16px rgba(201,169,98,0.2)',
}

// Secondary (outline)
secondaryButton: {
  background: 'transparent',
  border: '1px solid rgba(201,169,98,0.3)',
  borderRadius: '10px',
  color: '#C9A962',
  padding: '14px',
}
```

### Card Styles
```javascript
card: {
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '12px',
  border: '1px solid rgba(201,169,98,0.1)',
  padding: '16px',
}
```

### Section Title
```javascript
sectionTitle: {
  fontSize: '11px',
  fontWeight: '500',
  color: '#C9A962',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '14px',
}
```

---

## 🔗 KEY FILES TO REFERENCE

1. **Spec**: `/mnt/project/PARTY-OF-SIX-SPEC.md`
2. **Current Prototype**: `/mnt/project/party-of-six-v2.jsx`
3. **This Prompt**: `/home/claude/party-of-six/CLAUDE-PROMPT.md`

---

## 🎯 REMEMBER

> **"Party of Six is where friend groups plan adventures, not just trips. It's classy like the Ritz, powerful like having a personal travel agent, and fun like your best group chat."**

Keep it elegant. Keep it useful. Keep it fun. 🥂
