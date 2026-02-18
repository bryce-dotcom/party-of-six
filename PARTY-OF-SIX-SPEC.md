# PARTY OF SIX - Complete Project Specification

> **Read this document at the start of every response in the Party of Six project.**

---

## 🎯 PROJECT VISION

**Party of Six** is a premium PWA for friend groups to plan adventures, track trips, share memories, and build lasting traditions together. Think "Strava meets GroupMe meets AI travel agent" - wrapped in a classy, Ritz-Carlton aesthetic.

---

## 🏛️ BRAND IDENTITY

### Logo
```
          ─── EST. 2026 ───
      
         PARTY  of  SIX
         (gold)  (gray) (gold)
      
           ────◆────
        
         ADVENTURES AWAIT
```

### Design System

| Element | Value |
|---------|-------|
| **Primary Gold** | `#C9A962` |
| **Dark Background** | `#0D0D0D` |
| **Card Background** | `rgba(255,255,255,0.02)` |
| **Border Gold** | `rgba(201,169,98,0.15)` |
| **Text Primary** | `#E6EDF3` |
| **Text Secondary** | `#8B949E` |
| **Text Muted** | `#6E7681` |
| **Success Green** | `#6BCB77` |
| **Error Red** | `#B56565` / `#FF6B6B` |
| **Warning Yellow** | `#FFD93D` |

### Typography
| Use | Font |
|-----|------|
| **Headlines** | Playfair Display, serif (weight 300) |
| **Body** | Outfit / SF Pro Display, sans-serif |
| **Accent/Italic** | Cormorant Garamond, serif |

### UI Principles
- Dark theme with gold accents
- Subtle borders, no harsh lines
- Generous letter-spacing on headers
- Uppercase + tracking for section labels
- Glassmorphism for cards
- Mobile-first (max-width 430px)

---

## 👥 MULTI-CREW SYSTEM

Users can belong to multiple crews. Each crew is independent with its own:
- Members & roles
- Trip history & memories
- Awards & leaderboards
- Chat history
- Statistics

### Sample Crews
| ID | Name | Icon | Tagline | Est. |
|----|------|------|---------|------|
| `boyz` | The Boyz | 🏔️ | Send it or go home | 2019 |
| `girls` | Wine & Wanderlust | 🥂 | Sip, explore, repeat | 2021 |
| `family` | The Fam | 👨‍👩‍👧‍👦 | Adventure is a family affair | 2016 |
| `couples` | The Couples Club | 💑 | Double the fun | 2022 |

### Crew Data Structure
```javascript
{
  id: 'boyz',
  name: 'The Boyz',
  established: 'Est. 2019',
  icon: '🏔️',
  tagline: 'Send it or go home',
  color: '#C9A962',
  members: [...],
  stats: { totalTrips: 23, totalAwards: 47, totalPhotos: 342 }
}
```

---

## 📱 APP STRUCTURE (7 Tabs)

| Tab | Icon | Purpose |
|-----|------|---------|
| **Home** | 🏠 | Dashboard, quick actions, recent trips |
| **Plan** | 🗺️ | AI trip planner with activities |
| **Live** | 📍 | Real-time location, map, chat |
| **Memories** | 📸 | Trip history, photos, awards |
| **Crew** | 👥 | Member profiles, birthdays |
| **Awards** | 🏆 | Binki leaderboard, give awards |
| **Games** | 🎮 | Drinking games, challenges, tools |

---

## 🗺️ AI TRIP PLANNER (Core Feature)

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    USER SELECTS                         │
│                                                         │
│   1. Activity (from 55+ options)                       │
│   2. Dates (this weekend / next weekend / custom)      │
│   3. Crew (which group is going)                       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    AI ANALYZES                          │
│                                                         │
│   • Weather & conditions at destinations               │
│   • Snowpack / water levels / trail conditions         │
│   • Distance from crew's home base                     │
│   • Permit requirements & costs                        │
│   • Group size & skill levels                          │
│   • Past trips (avoid repeats or revisit favorites)    │
│   • Budget preferences                                  │
│   • Availability conflicts                             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              AI GENERATES OPTIONS                       │
│                                                         │
│   DESTINATION RECOMMENDATIONS:                         │
│   ├── Option 1: [Best Conditions]                      │
│   ├── Option 2: [Closest]                              │
│   └── Option 3: [Best Value]                           │
│                                                         │
│   For each option:                                     │
│   ├── 🏨 Lodging options (cabin, hotel, camping)       │
│   ├── ✈️ Travel options (drive time, flights)          │
│   ├── 🎿 Activities & rentals                          │
│   ├── 🍽️ Dining recommendations                        │
│   ├── 💰 Cost estimate per person                      │
│   └── 📋 Packing list & permits needed                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              USER SELECTS & CUSTOMIZES                  │
│                                                         │
│   • Pick destination                                   │
│   • Choose lodging                                     │
│   • Select activities                                  │
│   • Set budget per person                              │
│   • Add custom notes                                   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              TRIP CREATED & SHARED                      │
│                                                         │
│   • Push notification to all crew members              │
│   • Voting opens (confirm attendance)                  │
│   • Shared itinerary with all details                  │
│   • Countdown begins                                   │
│   • Packing list assigned                              │
│   • Calendar invites sent                              │
└─────────────────────────────────────────────────────────┘
```

### AI Trip Planner UI Sections

```
┌─────────────────────────────────────────┐
│            PLAN TRIP                    │
│   Choose an activity for The Boyz      │
├─────────────────────────────────────────┤
│ [All][Adventure][Winter][Water][...]   │  ← Category filters
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🏎️ ADVENTURE & MOTORSPORTS         │ │  ← Grouped activities
│ ├─────────────────────────────────────┤ │
│ │ 🛷  🏎️  🏍️  🏁  🚙                 │ │
│ │Sled SxS ATV Dirt Jeep              │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ❄️ WINTER SPORTS                    │ │
│ ├─────────────────────────────────────┤ │
│ │ 🎿  🏂  ⛷️  🥾  🛞  🧊              │ │
│ │Ski Board XC Shoe Tube Ice          │ │
│ └─────────────────────────────────────┘ │
│           ... more groups ...           │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🤖 AI TRIP ASSISTANT               │ │  ← AI section (appears after selection)
│ ├─────────────────────────────────────┤ │
│ │ Planning: Snowmobile for The Boyz  │ │
│ │                                     │ │
│ │ [This Wknd] [Next Wknd] [Custom]   │ │
│ │                                     │ │
│ │ [🔍 Find Best Options]             │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### AI Recommendation Card (Expanded)

```
┌─────────────────────────────────────────┐
│ 🎯 TOP RECOMMENDATION                   │
├─────────────────────────────────────────┤
│ 🏔️ Togwotee Pass, WY                   │
│ ⭐⭐⭐⭐⭐ Best Conditions               │
├─────────────────────────────────────────┤
│ 📊 CONDITIONS                           │
│ • 18" fresh snow this week             │
│ • 85" base (121% of normal)            │
│ • Avalanche: Moderate                   │
│ • Temp: 22-28°F                        │
├─────────────────────────────────────────┤
│ 🚗 TRAVEL                               │
│ • 4.5 hrs from Salt Lake City          │
│ • Gas estimate: $85                    │
│ • [View Route]                         │
├─────────────────────────────────────────┤
│ 🏨 LODGING OPTIONS                      │
│ ┌─────────────────────────────────────┐│
│ │ Togwotee Mountain Lodge    $189/n  ││
│ │ ⭐⭐⭐⭐ Ride from door, restaurant  ││
│ │ [Select]                           ││
│ ├─────────────────────────────────────┤│
│ │ Cowboy Village Resort      $129/n  ││
│ │ ⭐⭐⭐ 20 min to trailhead          ││
│ │ [Select]                           ││
│ ├─────────────────────────────────────┤│
│ │ Airbnb Cabin               $249/n  ││
│ │ ⭐⭐⭐⭐⭐ Sleeps 8, hot tub         ││
│ │ [Select]                           ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ 🎿 RENTALS & GEAR                       │
│ • Sled rentals available: $350/day    │
│ • Gear shop on-site                    │
│ • Avalanche gear required             │
├─────────────────────────────────────────┤
│ 🍽️ DINING                              │
│ • Lodge restaurant (great burgers)    │
│ • Dornan's in Moose (25 min)          │
│ • Pack cooler for trail lunch         │
├─────────────────────────────────────────┤
│ 💰 ESTIMATED COST                       │
│ ┌─────────────────────────────────────┐│
│ │ Lodging (2 nights)      $378       ││
│ │ Gas (round trip)        $85        ││
│ │ WY Permits (2 sleds)    $70        ││
│ │ Food & drinks           $150       ││
│ ├─────────────────────────────────────┤│
│ │ TOTAL                   $683       ││
│ │ Per person (6)          $114       ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ 📋 PACKING LIST                         │
│ [View List] [Assign Items]             │
├─────────────────────────────────────────┤
│ [Create Trip] [Ask AI Follow-up]       │
└─────────────────────────────────────────┘
```

---

## 🎯 ACTIVITIES (55+ Options)

### Grouped by Category

**🏎️ Adventure & Motorsports**
- 🛷 Snowmobile
- 🏎️ Side x Side
- 🏍️ ATV
- 🏁 Dirt Bikes
- 🚙 Jeep Trail

**❄️ Winter Sports**
- 🎿 Skiing
- 🏂 Snowboard
- ⛷️ Cross Country
- 🥾 Snowshoe
- 🛞 Snow Tubing
- 🧊 Ice Fishing

**🌊 Water Activities**
- 🎣 Fishing
- ⛵ Boating
- 🚤 Jet Ski
- 🛶 Kayak/SUP
- 🏄 Wakeboard
- 🌊 Rafting
- ⛵ Sailing
- 🤿 Scuba/Snorkel

**🏕️ Outdoor & Nature**
- 🏕️ Camping
- 🥾 Hiking
- 🦌 Hunting
- ⛳ Golf Trip
- 🚵 Mountain Bike
- 🧗 Rock Climbing
- 🐴 Horseback

**✈️ Travel**
- ✈️ Travel
- 🚗 Road Trip
- 🚢 Cruise
- 🎰 Vegas Trip

**🎸 Events & Entertainment**
- 🎸 Concert
- 🏟️ Sports Game
- 🎪 Festival
- 🎢 Theme Park

**💅 Girls Trip & Wellness**
- 💆‍♀️ Spa Day
- 🍷 Wine Tasting
- 🥂 Brunch Crawl
- 🧘‍♀️ Yoga Retreat
- 🛍️ Shopping Trip
- 👰 Bachelorette
- 💅 Girls Night
- 📚 Book Club
- 🎨 Craft Retreat
- 👩‍🍳 Cooking Class
- 📸 Photo Session
- 🫖 High Tea
- 💃 Dance Class
- ✨ Beauty Day
- 🕯️ Wellness Retreat
- 💅 Mani/Pedi
- 🎤 Karaoke Night
- 🏺 Pottery Class
- 🧺 Fancy Picnic
- 🎭 Theater/Show

**🎉 Celebrations**
- 🎂 Birthday Trip
- 🎉 Bachelor Party
- 💕 Anniversary
- 👨‍👩‍👧‍👦 Reunion
- 🎓 Graduation

---

## 🏆 AWARDS SYSTEM (45+ Awards)

Awards correlate with activities and can be given during or after trips.

### Award Categories

**Classic**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 👶 | Binki Award | Lost their cool | Shame |
| 🏆 | MVP | Most valuable member | Gold |
| 🌟 | Rookie of Trip | First timer who crushed it | Gold |

**Adventure / Motorsports**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 🚀 | Send It! | Committed to something sketchy | Gold |
| 💥 | Yard Sale | Epic wipeout, gear everywhere | Shame |
| 🔧 | Trail Mechanic | Saved the day with repairs | Gold |
| 🪨 | Stuck Award | Most creative way to get stuck | Shame |
| ⚡ | Lead Foot | Fastest of the trip | Gold |
| 🐢 | The Tortoise | Slowest but made it | Neutral |

**Navigation & Outdoors**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 🧭 | Navigator | Never gets lost | Gold |
| ❓ | Where Am I? | Got everyone lost | Shame |
| 🗺️ | Trailblazer | Found the best spot | Gold |
| 🌅 | Early Bird | First one ready | Gold |
| 😴 | Sleepyhead | Last one out of bed | Neutral |

**Safety & Survival**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 🩹 | Trail Medic | Patched someone up | Gold |
| 🏕️ | Survivor | Powered through adversity | Gold |
| 🌧️ | Weatherman | Called conditions right | Gold |
| 🌩️ | The Jinx | Brought bad luck | Shame |

**Water Sports**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| ⚓ | Captain | Best boat handling | Gold |
| 🌊 | Man Overboard | Took an unexpected swim | Shame |
| 🐟 | Big Catch | Landed the biggest fish | Gold |
| 🦨 | Skunked | Didn't catch anything | Neutral |
| 🏄 | Wake King/Queen | Best on the water | Gold |

**Winter Sports**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| ❄️ | Powder Hound | Found the best snow | Gold |
| 🥶 | Frostbite | Forgot proper gear | Shame |

**Photography**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 📸 | Shot of Trip | Best photo | Gold |
| 📱 | The Influencer | Most time on phone | Neutral |

**Food & Provisions**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 🍺 | Best Provisions | Best snacks/drinks | Gold |
| 👨‍🍳 | Camp Chef | Cooked the best meal | Gold |
| 😤 | Hangry Award | Got cranky before food | Shame |

**Social & Party**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 🎉 | Life of Party | Kept everyone entertained | Gold |
| 📖 | Storyteller | Best campfire stories | Gold |
| 🎵 | DJ Award | Best playlist | Gold |
| 🍷 | Lightweight | First one down | Shame |
| 🦾 | Iron Liver | Last one standing | Gold |

**Girls Trip**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| ✨ | Glow Up | Best transformation | Gold |
| 💆‍♀️ | Group Therapist | Best listener | Gold |
| 📣 | Hype Queen | Best at gassing up | Gold |
| 🎭 | Drama Award | Most dramatic moment | Shame |
| 🛍️ | Shopaholic | Spent the most | Neutral |
| 🍷 | Sommelier | Best wine picks | Gold |

**Travel**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 📋 | Trip Planner | Organized everything | Gold |
| 🧘 | Go With Flow | Most adaptable | Gold |
| 😩 | Complainy Pants | Found fault in everything | Shame |
| 🤦 | The Forgetter | Left something behind | Shame |

**Celebration**
| Icon | Name | Description | Type |
|------|------|-------------|------|
| 🎂 | Birthday Star | It's their day! | Gold |
| 💍 | Newlywed | Just got married! | Gold |

---

## 🎮 GAMES SYSTEM (45+ Games)

Games correlate with activities for contextual fun.

### Game Categories

**🍺 Drinking Games**
- Trip Roulette, Would You Rather, Truth or Dare
- Never Have I Ever, Kings Cup, Flip Cup
- Beer Pong, Waterfall

**🏎️ Adventure Games**
- Stuck Bets, Lead Foot Race, Mechanic Challenge, Yard Sale Bingo

**🌊 Water Games**
- Fishing Derby, Biggest Catch, Wake Olympics, Captain Challenge, Tubing Survivor

**❄️ Winter Games**
- First Chair, Powder Hunt, Tree Run Race

**💅 Girls Trip Games**
- Wine Bingo, Hot Goss, Compliment Battle, Confessions
- Best Dressed, Photo Challenge, Rose & Thorn

**🎲 Betting Games**
- Trip Predictions, Trip Bingo, Over/Under, Brackets

**🎰 Decision Tools**
- Random Picker, Quick Vote, Dice Roll, Custom Spinner

**💬 Social Games**
- Hot Takes, Superlatives, Two Truths One Lie, Roast Battle

**💪 Wellness Challenges**
- Dry Challenge, Step Challenge, Sunrise Club, Phone Stack

### Quick Tools
- 🎰 Picker
- 👆 Vote
- 🎲 Dice
- 🪙 Flip
- ⏱️ Timer
- 🔢 Score

---

## 📍 LIVE TRACKING SYSTEM

### Three Views

**🗺️ Map View**
- Real-time crew locations on topographic/satellite map
- Color-coded markers (green = moving, gold = stopped)
- Speed display for moving members
- Quick actions: Drop Pin, Navigate, SOS, Distance

**💬 Chat View**
- Group messaging
- Location sharing in chat
- SOS alerts (highlighted red)
- Quick message buttons: 👍 ⏸️ ⛽ 🔧 📍 🚨

**👥 List View**
- All members with status
- Battery levels
- Last update times
- Navigate button to each member
- Group stats (furthest apart, avg distance, avg speed)

### Connectivity Modes

| Scenario | Solution |
|----------|----------|
| Cell/WiFi | Real-time WebSocket updates |
| Weak signal | Batch sync, local caching |
| Offline | GPS works, stores locally, syncs later |
| Backcountry | Satellite integration (Garmin inReach) |

### SOS System
- One-tap emergency button
- Sends location to all crew
- Optional satellite relay (Garmin/Zoleo)
- Loud local alarm + strobe option

---

## 📸 MEMORIES & TRIP HISTORY

### Trip Data Structure
```javascript
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
  ],
  awards: [
    { recipient: 'Tyler', award: '🪨', name: 'Stuck Award' },
    { recipient: 'Chris', award: '🍺', name: 'Best Provisions' },
  ],
  photos: [
    { id: 1, emoji: '🌅', caption: 'Fresh tracks at sunrise' },
    { id: 2, emoji: '😅', caption: "Tyler's famous stuck moment" },
  ],
  stats: { miles: 127, maxElevation: '9,600 ft', conditions: 'Powder' },
  tripNotes: 'Best trip of the season...',
}
```

### Filtering
- By year
- By activity type
- By crew

### Photo Book Export
- Softcover ($29.99)
- Hardcover ($49.99)
- PDF (Free)

Includes:
- All trip summaries
- Photos with captions
- Award history
- Member profiles
- Trip notes & highlights
- Custom cover with crew name

---

## 🔌 TECHNICAL ARCHITECTURE

### Frontend Stack
| Layer | Technology |
|-------|------------|
| Framework | React PWA |
| Styling | Inline styles (CSS-in-JS) |
| Maps | Mapbox with offline tiles |
| State | React hooks (useState, useContext) |
| Offline | Service Worker + IndexedDB |

### Backend Stack
| Layer | Technology |
|-------|------------|
| Database | Supabase (PostgreSQL + PostGIS) |
| Realtime | Supabase Realtime (WebSockets) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (photos) |
| Push | Firebase Cloud Messaging |
| AI | Claude API (trip planning) |

### External Integrations
| Service | Purpose |
|---------|---------|
| Mapbox | Maps & offline tiles |
| OpenWeather | Weather data |
| Garmin inReach | Satellite tracking |
| Google Flights | Flight options |
| Booking.com | Lodging options |
| Stripe | Book payments |

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     PARTY OF SIX PWA                    │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │  Home   │  │  Plan   │  │  Live   │  │ Memories│   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
│       │            │            │            │         │
│       └────────────┴────────────┴────────────┘         │
│                         │                               │
│                    Local State                          │
│                    IndexedDB                            │
│                  Service Worker                         │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      SUPABASE                           │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Auth     │  │  Database   │  │   Storage   │    │
│  │   (users)   │  │ (trips,crew)│  │  (photos)   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Realtime (WebSockets)              │   │
│  │         (live locations, chat messages)          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Claude  │    │  Mapbox  │    │  Garmin  │
    │   API    │    │   Maps   │    │ inReach  │
    │(AI trips)│    │(offline) │    │(satellite│
    └──────────┘    └──────────┘    └──────────┘
```

---

## 📊 SUPABASE SCHEMA

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar TEXT,
  home_location GEOGRAPHY(POINT),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crews
CREATE TABLE crews (
  id UUID PRIMARY KEY,
  name TEXT,
  icon TEXT,
  tagline TEXT,
  established DATE,
  color TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crew Members
CREATE TABLE crew_members (
  crew_id UUID REFERENCES crews(id),
  user_id UUID REFERENCES users(id),
  role TEXT,
  birthday DATE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (crew_id, user_id)
);

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  crew_id UUID REFERENCES crews(id),
  name TEXT,
  activity TEXT,
  activity_icon TEXT,
  location TEXT,
  location_geo GEOGRAPHY(POINT),
  start_date DATE,
  end_date DATE,
  status TEXT, -- planning, voting, confirmed, completed
  cover_photo TEXT,
  highlights TEXT[],
  notes TEXT,
  stats JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip Attendees
CREATE TABLE trip_attendees (
  trip_id UUID REFERENCES trips(id),
  user_id UUID REFERENCES users(id),
  status TEXT, -- invited, confirmed, declined
  PRIMARY KEY (trip_id, user_id)
);

-- Awards
CREATE TABLE awards (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips(id),
  recipient_id UUID REFERENCES users(id),
  giver_id UUID REFERENCES users(id),
  award_type TEXT,
  award_icon TEXT,
  award_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips(id),
  uploaded_by UUID REFERENCES users(id),
  url TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live Locations
CREATE TABLE live_locations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  location GEOGRAPHY(POINT),
  speed FLOAT,
  heading FLOAT,
  battery INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips(id),
  sender_id UUID REFERENCES users(id),
  message TEXT,
  type TEXT, -- text, location, sos
  location GEOGRAPHY(POINT),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Core MVP
- [ ] Basic PWA shell
- [ ] Multi-crew support
- [ ] Activity selection
- [ ] Simple trip creation
- [ ] Crew chat

### Phase 2: AI Trip Planning
- [ ] Claude API integration
- [ ] Weather data integration
- [ ] Lodging recommendations
- [ ] Cost estimates
- [ ] Itinerary generation

### Phase 3: Live Tracking
- [ ] Real-time location sharing
- [ ] Map view with crew markers
- [ ] Group chat
- [ ] SOS system
- [ ] Offline GPS recording

### Phase 4: Memories
- [ ] Trip history
- [ ] Photo uploads
- [ ] Award system
- [ ] Binki leaderboard
- [ ] Photo book export

### Phase 5: Advanced Features
- [ ] Satellite integration (Garmin)
- [ ] Flight/lodging booking
- [ ] Packing list management
- [ ] Calendar integration
- [ ] Push notifications

---

## 📁 FILE STRUCTURE

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
│   │   └── ...
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
│   │   └── useOffline.js
│   ├── services/
│   │   ├── supabase.js
│   │   ├── claude.js
│   │   ├── mapbox.js
│   │   └── garmin.js
│   ├── styles/
│   │   └── theme.js
│   ├── data/
│   │   ├── activities.js
│   │   ├── awards.js
│   │   └── games.js
│   ├── App.jsx
│   └── index.js
├── PARTY-OF-SIX-SPEC.md  ← This file
└── package.json
```

---

## ✅ CHECKLIST FOR EVERY RESPONSE

When working on Party of Six, always:

1. **Read this spec first** - Ensure consistency
2. **Use the Ritz aesthetic** - Gold accents, serif headlines, dark theme
3. **Keep "PARTY of SIX" prominent** - It's the brand
4. **Maintain activity correlation** - Activities → Awards → Games
5. **Consider offline use** - Backcountry scenarios
6. **Think multi-crew** - Features work across different groups
7. **AI-first planning** - Trip planner is the core feature
8. **Mobile-first** - 430px max-width, touch-friendly

---

## 🎨 QUICK STYLE REFERENCE

```javascript
// Colors
const gold = '#C9A962';
const darkBg = '#0D0D0D';
const cardBg = 'rgba(255,255,255,0.02)';
const borderGold = 'rgba(201,169,98,0.15)';
const textPrimary = '#E6EDF3';
const textMuted = '#6E7681';
const success = '#6BCB77';
const error = '#B56565';

// Typography
const headlineFont = "'Playfair Display', Georgia, serif";
const bodyFont = "'Outfit', sans-serif";

// Spacing
const maxWidth = '430px';
const borderRadius = '12px';
const padding = '16px';
```

---

*Last updated: February 2026*
*Version: 2.0*
