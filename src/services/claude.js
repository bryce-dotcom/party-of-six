// Party of Six - Claude AI Trip Planner Service
// Calls the Anthropic API via server proxy with web_search enabled
// for real-time conditions, pricing, and recommendations

const SYSTEM_PROMPT = `You are a trip planner for adventure groups. The user will specify their meeting point and member locations. Respond with ONLY valid JSON (no markdown, no code blocks). Start with { end with }.

Rules: Use REAL business names, accurate drive times from the specified meeting point, realistic pricing, typical conditions for the time of year.

Return JSON: {"options":[3 items],"notes":"trip tips"}
Each option has: type ("best_conditions"|"closest"|"best_value"), label, destination ("Place, ST"), tagline,
conditions (activity-specific fields per user message),
travel {driveTime (from meeting point), distance, gasEstimate, routeNotes, memberDriveTimes (array of {name, from, driveTime} for each member)},
lodging [4+ items with: name, type (Hotel/Lodge/Airbnb/Motel), pricePerNight (number), rating, highlights, bookingNote — always include an Airbnb/cabin that sleeps the group],
dining [4+ items with: name, type, priceRange, note — mix of price ranges, include a bar/après spot],
activities [2-3 nearby things to do with: name, description, cost],
rentals {available, provider, pricePerDay, notes},
costs {lodging (group total), gas, permits, rentals, food, total, perPerson (÷ group), nights},
permits {required, details, cost},
packingList [8-10 essential items including clothing/gear advice],
flights (only for fly-out trips — include if destination is 8+ hrs drive: {nearestAirport, estimatedRT, memberFlights [{name, airport, estimatedCost}]})

3 options must be genuinely different destinations.`;

// Activity-specific condition fields that Claude should include
function getActivityConditions(activity) {
  const act = activity.toLowerCase();

  // Snow/winter activities
  if (['snowmobile', 'snowmobiling', 'skiing', 'snowboarding', 'cross-country skiing',
       'backcountry skiing', 'snowshoeing', 'ice climbing'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "snowpack": Snowpack percentage of normal (e.g. "125% of normal")
- "baseDepth": Base depth in inches with % of normal (e.g. "72 inches (110% of normal)")
- "freshSnow": TOTAL expected fresh snow accumulation from now through the trip dates. Add up the daily snowfall forecasts for the entire week leading into and including the trip. Example: "18-24 inches expected by Saturday (4-6" Mon, 2-4" Tue, 6-8" Thu-Fri, 4-6" Sat)". Riders want to know how much powder will be stacked up when they arrive.
- "avalanche": Avalanche danger level (Low/Moderate/Considerable/High)
- "temperature": Expected temperature range during the trip
- "forecast": Day-by-day forecast leading up to and including the trip dates — show each day's expected snowfall so riders can see the accumulation building
- "trailStatus": Trail/grooming status
- "specialNotes": Any notable conditions or safety alerts`,
      previewFields: ['freshSnow', 'baseDepth'],
    };
  }

  // Fishing
  if (['fishing', 'fly fishing', 'ice fishing', 'deep sea fishing'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "waterTemp": Water temperature (e.g. "42-48°F")
- "flowRate": River flow rate in CFS if applicable (e.g. "850 CFS - ideal")
- "clarity": Water clarity (e.g. "Clear, 4-6ft visibility")
- "hatches": Current or expected hatches/bait activity (e.g. "Blue-winged olives, midges")
- "fishActivity": Fish activity level and what's biting (e.g. "Trout active on nymphs, streamers in deep pools")
- "temperature": Air temperature range
- "forecast": 2-3 day weather forecast
- "regulations": Season status, slot limits, catch-and-release rules
- "specialNotes": Hot spots, recent reports, or tips`,
      previewFields: ['waterTemp', 'fishActivity'],
    };
  }

  // Water activities (boating, kayaking, paddleboarding, etc.)
  if (['boating', 'kayaking', 'canoeing', 'paddleboard', 'sup', 'rafting', 'whitewater',
       'jet ski', 'wakeboarding', 'water skiing', 'surfing', 'sailing'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "waterTemp": Water temperature (e.g. "58°F")
- "waterLevel": Lake/reservoir level or river flow (e.g. "78% capacity" or "1200 CFS")
- "waveHeight": Expected wave/chop conditions (e.g. "Calm, 0-1ft chop")
- "windSpeed": Expected wind (e.g. "5-15 mph, gusts to 20")
- "temperature": Air temperature range
- "forecast": 2-3 day weather forecast
- "launchAccess": Boat ramp / put-in status
- "specialNotes": Any water advisories, algae, or conditions to note`,
      previewFields: ['waterTemp', 'waterLevel'],
    };
  }

  // Hiking / backpacking / climbing
  if (['hiking', 'backpacking', 'rock climbing', 'bouldering', 'mountaineering',
       'canyoneering', 'trail running'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "trailConditions": Current trail state (e.g. "Dry and clear", "Muddy in spots", "Snow above 9000ft")
- "snowLine": Elevation of snow line if applicable
- "temperature": Expected temperature range at trailhead and summit
- "sunrise": Sunrise/sunset times
- "forecast": 2-3 day weather forecast
- "trailStatus": Open/Closed/Partial — any closures or detours
- "crowdLevel": Expected crowd level (Low/Moderate/High)
- "specialNotes": Hazards, wildlife activity, fire restrictions, or seasonal notes`,
      previewFields: ['trailConditions', 'temperature'],
    };
  }

  // Mountain biking / cycling
  if (['mountain biking', 'biking', 'cycling', 'road biking', 'gravel biking'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "trailConditions": Current trail/road surface (e.g. "Dry, hero dirt", "Tacky", "Loose gravel")
- "temperature": Expected temperature range
- "forecast": 2-3 day weather forecast
- "trailStatus": Open/Closed status, any detours
- "difficulty": Trail difficulty and notable features
- "crowdLevel": Expected crowd level
- "specialNotes": Any closures, construction, or seasonal notes`,
      previewFields: ['trailConditions', 'temperature'],
    };
  }

  // Hunting
  if (['hunting', 'elk hunting', 'deer hunting', 'duck hunting', 'pheasant hunting',
       'upland hunting'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "season": Current season status and dates
- "gameActivity": Game activity and recent sighting reports
- "temperature": Expected temperature range
- "forecast": 2-3 day weather forecast
- "terrain": Ground conditions (e.g. "Light snow cover, good tracking")
- "moonPhase": Moon phase and its effect on activity
- "tagInfo": Tag/license requirements and availability
- "specialNotes": Migration patterns, public land access, CWD zones`,
      previewFields: ['season', 'gameActivity'],
    };
  }

  // Golf
  if (act.includes('golf')) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "courseConditions": Course conditions (e.g. "Greens: Fast, Fairways: Firm")
- "temperature": Expected temperature range
- "forecast": 2-3 day weather forecast
- "windSpeed": Expected wind conditions
- "greenFees": Typical green fee range
- "teeTimeAvail": Tee time availability notes
- "specialNotes": Any course events, aerification, or seasonal notes`,
      previewFields: ['courseConditions', 'temperature'],
    };
  }

  // Camping
  if (['camping', 'glamping', 'car camping', 'overlanding'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "temperature": Expected high/low temperature range
- "nighttimeLow": Overnight low temperature
- "forecast": 2-3 day weather forecast
- "campgroundStatus": Open/Closed, reservation status
- "fireBan": Fire restriction status
- "bugLevel": Mosquito/bug activity level
- "crowdLevel": Expected crowd level
- "specialNotes": Water availability, bear activity, road access notes`,
      previewFields: ['temperature', 'nighttimeLow'],
    };
  }

  // ATV / OHV / dirt biking
  if (['atv', 'ohv', 'utv', 'dirt bike', 'side-by-side', 'off-road',
       'four wheeling', '4x4'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "trailConditions": Current trail surface conditions (e.g. "Dry, dusty", "Packed, some mud")
- "temperature": Expected temperature range
- "forecast": 2-3 day weather forecast
- "trailStatus": Open/Closed status
- "dustLevel": Dust level (Low/Moderate/High)
- "difficulty": Trail difficulty rating
- "specialNotes": Any closures, seasonal notes, or hazards`,
      previewFields: ['trailConditions', 'temperature'],
    };
  }

  // Spa / wellness / girls trip
  if (['spa', 'wellness', 'yoga retreat', 'hot springs'].some(s => act.includes(s))) {
    return {
      instructions: `For conditions, include these EXACT fields in the "conditions" object:
- "temperature": Expected temperature range
- "forecast": 2-3 day weather forecast
- "availability": Booking availability and popular time slots
- "peakTimes": Peak vs off-peak timing
- "specialOffers": Any current packages or seasonal specials
- "specialNotes": Dress code, what to bring, reservation tips`,
      previewFields: ['availability', 'temperature'],
    };
  }

  // Default / generic activities
  return {
    instructions: `For conditions, include these fields in the "conditions" object:
- "temperature": Expected temperature range
- "forecast": 2-3 day weather forecast
- "conditions": Current conditions relevant to the activity
- "crowdLevel": Expected crowd level (Low/Moderate/High)
- "bestTime": Best time of day for this activity
- "specialNotes": Any relevant alerts, tips, or seasonal notes`,
    previewFields: ['conditions', 'temperature'],
  };
}

function buildUserMessage(params) {
  const { activity, dates, region, budget, groupSize, crewName, excludeDestinations, homeBase, memberLocations } = params;

  const baseCity = homeBase || 'Salt Lake City, UT';

  const regionMap = {
    utah: 'Utah (Wasatch Range, Park City, Logan, Moab, Southern Utah)',
    wyoming: 'Wyoming (Jackson Hole, Togwotee Pass, Yellowstone, Wind River Range)',
    idaho: 'Idaho (Bear Lake, Sun Valley, McCall, Boise area)',
    colorado: 'Colorado (Steamboat Springs, Vail, Aspen, Moab area)',
    anywhere: `Anywhere within a 6-hour drive of ${baseCity}`,
  };

  const budgetMap = {
    budget: '$50-100 per person total (budget-friendly, minimize costs)',
    moderate: '$100-250 per person total (good balance of quality and value)',
    premium: '$250-500 per person total (premium experience, nice lodging)',
    nolimit: 'No budget limit (find the best experience regardless of cost)',
  };

  const dateText = dates === 'this_weekend'
    ? 'This coming weekend (Friday-Sunday)'
    : dates === 'next_weekend'
      ? 'Next weekend (the weekend after this one)'
      : 'Flexible dates in the next 2-3 weeks';

  const activityConds = getActivityConditions(activity);

  const excludeNote = excludeDestinations?.length > 0
    ? `\n\nIMPORTANT: Do NOT suggest these destinations (already shown): ${excludeDestinations.join(', ')}. Pick completely different locations.`
    : '';

  // Build member location info for individual drive times
  let memberLocationText = '';
  if (memberLocations?.length > 0) {
    const memberLines = memberLocations.map(m => `  - ${m.name}: ${m.city} (airport: ${m.airport})`).join('\n');
    memberLocationText = `\n\nCrew member home cities (provide individual drive times for each in travel.memberDriveTimes):\n${memberLines}`;
  }

  return `Plan a ${activity} trip for ${groupSize} people ("${crewName}") from ${baseCity}.

Dates: ${dateText}
Region preference: ${regionMap[region] || regionMap.anywhere}
Budget: ${budgetMap[budget] || budgetMap.moderate}

ACTIVITY-SPECIFIC CONDITIONS:
${activityConds.instructions}

I need:
- 4+ lodging options per destination: include hotels, lodges, Airbnb/VRBO cabins, and a budget option. Always include at least one Airbnb/cabin that sleeps the group.
- 4+ restaurant/bar options per destination: include a mix of price ranges, cuisines, and at least one good après/bar spot
- 2-3 nearby activities or attractions at each destination (things to do besides the main activity)
- Accurate drive times from ${baseCity} (the crew meeting point)
- Individual drive times for each crew member from their home city in travel.memberDriveTimes array [{name, from, driveTime}]
- Typical conditions for this time of year at each destination — use the activity-specific fields listed above
- Specific permit requirements and costs
- Gear rental availability and pricing
- If any destination requires flying (8+ hrs drive), include a "flights" object with nearestAirport, estimatedRT cost, and memberFlights array [{name, airport, estimatedCost}]

Give me 3 options: best conditions, closest to ${baseCity}, and best value. Make each option a genuinely different destination - not 3 lodges at the same place. Respond with ONLY valid JSON.${memberLocationText}${excludeNote}`;
}

// Map city names to nearest airport codes
export function getCityAirport(city) {
  if (!city) return 'SLC';
  const c = city.toLowerCase();

  // St. George area
  if (['st. george', 'st george', 'washington', 'ivins', 'santa clara', 'hurricane', 'la verkin'].some(s => c.includes(s))) return 'SGU';
  // Cedar City
  if (c.includes('cedar city') || c.includes('brian head') || c.includes('parowan')) return 'CDC';
  // Moab / Monticello / Canyonlands area
  if (['moab', 'monticello', 'blanding', 'green river', 'canyonlands'].some(s => c.includes(s))) return 'CNY';
  // Jackson Hole
  if (['jackson', 'teton village', 'wilson, wy'].some(s => c.includes(s))) return 'JAC';
  // Boise area
  if (['boise', 'meridian', 'nampa', 'eagle, id', 'caldwell'].some(s => c.includes(s))) return 'BOI';
  // Grand Junction
  if (['grand junction', 'fruita', 'palisade'].some(s => c.includes(s))) return 'GJT';
  // Twin Falls
  if (c.includes('twin falls')) return 'TWF';
  // Yellowstone / West Yellowstone
  if (c.includes('west yellowstone')) return 'WYS';

  // Default: SLC covers Wasatch Front, Utah County, Logan, etc.
  return 'SLC';
}

// Mock data for demo/fallback when API is unavailable
function getMockResults(activity, groupSize) {
  return {
    options: [
      {
        type: 'best_conditions',
        label: 'Best Conditions',
        destination: 'Togwotee Pass, WY',
        tagline: 'Deep powder and pristine groomed trails with 18" of fresh snow this week',
        conditions: {
          snowpack: '121% of normal',
          freshSnow: '22-28" expected by Saturday (4-6" Mon, 6-8" Wed-Thu, 8-10" Fri, 2-4" Sat)',
          baseDepth: '85 inches (121% of normal)',
          avalanche: 'Moderate',
          temperature: '22-28°F',
          forecast: 'Mon: 4-6" snow. Tue: Flurries. Wed-Thu: 6-8" storm cycle. Fri: 8-10" powder day. Sat: 2-4" morning snow, clearing. Sun: Sunny, cold.',
          trailStatus: 'Groomed daily, backcountry excellent',
          specialNotes: 'Best conditions of the season - snowpack well above average',
        },
        travel: {
          driveTime: '4.5 hrs from Lehi, UT',
          distance: '280 miles',
          gasEstimate: '$85',
          routeNotes: 'I-15 N to US-89 through Star Valley, then US-26/287. Road plowed but bring chains.',
          memberDriveTimes: [
            { name: 'Bryce', from: 'Highland, UT', driveTime: '4.4 hrs' },
            { name: 'Jake', from: 'Mapleton, UT', driveTime: '5.0 hrs' },
            { name: 'Mike', from: 'Lehi, UT', driveTime: '4.5 hrs' },
            { name: 'Tyler', from: 'Saratoga Springs, UT', driveTime: '4.6 hrs' },
            { name: 'Dave', from: 'Monticello, UT', driveTime: '7.5 hrs' },
            { name: 'Chris', from: 'Lehi, UT', driveTime: '4.5 hrs' },
          ],
        },
        lodging: [
          { name: 'Togwotee Mountain Lodge', pricePerNight: 189, rating: 4.5, highlights: 'Ride from the door, on-site restaurant, gear storage, hot tub', bookingNote: 'Book early - weekends fill fast in Feb' },
          { name: 'Cowboy Village Resort (Jackson)', pricePerNight: 139, rating: 4.0, highlights: 'Log cabin suites, 45 min to trailhead, downtown Jackson location', bookingNote: 'Good availability mid-week' },
          { name: 'Airbnb Cabin - Moran Junction', pricePerNight: 279, rating: 4.8, highlights: 'Sleeps 8, hot tub, mountain views, full kitchen, garage for sleds', bookingNote: 'Minimum 2-night stay on weekends' },
        ],
        dining: [
          { name: 'Togwotee Lodge Restaurant', type: 'American', priceRange: '$$', note: 'Great burgers and steaks, only option at the pass' },
          { name: "Dornan's Chuckwagon", type: 'BBQ/Western', priceRange: '$$', note: 'Iconic Teton views, 25 min south in Moose' },
          { name: 'Bin 22 Wine Bar', type: 'Wine Bar/Tapas', priceRange: '$$$', note: 'Excellent après spot in Jackson, craft cocktails' },
        ],
        rentals: {
          available: true,
          provider: 'Togwotee Adventures / High Country Snowmobile',
          pricePerDay: 350,
          notes: 'Full-day guided and unguided rentals. Includes helmet and boots. Avalanche beacon rental $25/day extra. Reserve 1 week ahead.',
        },
        costs: {
          lodging: 378, gas: 85, permits: 70, rentals: 700, food: 200, total: 1433, perPerson: 239, nights: 2,
        },
        permits: {
          required: true,
          details: 'Wyoming snowmobile registration required ($35/sled). Available at the lodge or online at wgfd.wyo.gov.',
          cost: 70,
        },
        packingList: [
          'Snowmobile suit or bibs + jacket',
          'Helmet with heated visor (or rent)',
          'Avalanche beacon, probe, shovel',
          'Hand/toe warmers (lots)',
          'Balaclava and goggles',
          'Waterproof gloves (2 pairs)',
          'Boot dryers',
          'Cooler with trail lunch and drinks',
          'Tow strap and basic tools',
          'Phone mount for GPS/maps',
        ],
      },
      {
        type: 'closest',
        label: 'Closest',
        destination: 'Logan / Franklin Basin, UT',
        tagline: 'Just 90 minutes from SLC with great terrain and easy day-trip access',
        conditions: {
          snowpack: '98% of normal',
          freshSnow: '10-14" expected by Saturday (2-3" Tue, 4-6" Thu, 4-5" Fri-Sat)',
          baseDepth: '62 inches (98% of normal)',
          avalanche: 'Low',
          temperature: '25-32°F',
          forecast: 'Mon-Wed: Partly cloudy, 2-3" Tue. Thu: 4-6" storm. Fri: 3-4" lingering snow. Sat: 1-2" morning, clearing. Sun: Sunny.',
          trailStatus: 'Groomed trails, meadows in good shape',
          specialNotes: 'Great for day trips - ride in, ride out same day',
        },
        travel: {
          driveTime: '1.5 hrs from Lehi, UT',
          distance: '85 miles',
          gasEstimate: '$35',
          routeNotes: 'I-15 N to Logan, then up Logan Canyon. Easy highway drive.',
          memberDriveTimes: [
            { name: 'Bryce', from: 'Highland, UT', driveTime: '1.4 hrs' },
            { name: 'Jake', from: 'Mapleton, UT', driveTime: '2.1 hrs' },
            { name: 'Mike', from: 'Lehi, UT', driveTime: '1.5 hrs' },
            { name: 'Tyler', from: 'Saratoga Springs, UT', driveTime: '1.6 hrs' },
            { name: 'Dave', from: 'Monticello, UT', driveTime: '6.5 hrs' },
            { name: 'Chris', from: 'Lehi, UT', driveTime: '1.5 hrs' },
          ],
        },
        lodging: [
          { name: 'SpringHill Suites Logan', pricePerNight: 119, rating: 4.2, highlights: 'Clean rooms, breakfast included, pool, 25 min to trailhead', bookingNote: 'Good availability' },
          { name: 'Anniversary Inn Logan', pricePerNight: 149, rating: 4.5, highlights: 'Themed suites, jetted tubs, great for groups wanting separate rooms', bookingNote: 'Book themed rooms early' },
          { name: 'Beaver Creek Lodge', pricePerNight: 179, rating: 4.3, highlights: 'Right at the mouth of Logan Canyon, rustic cabin feel', bookingNote: 'Limited rooms - call ahead' },
        ],
        dining: [
          { name: 'Cafe Sabor', type: 'Mexican', priceRange: '$', note: 'Best burritos in Logan, perfect post-ride fuel' },
          { name: 'Tandoori Oven', type: 'Indian', priceRange: '$$', note: 'Excellent naan and curry, warm up after a cold ride' },
          { name: "Jack's Wood Fired Oven", type: 'Pizza/Italian', priceRange: '$$', note: 'Wood-fired pizza and craft beer, great group spot' },
        ],
        rentals: {
          available: true,
          provider: 'Logan Canyon Snowmobile Rentals',
          pricePerDay: 275,
          notes: 'Half-day and full-day options. Includes helmet. Trailers available for rent if you have your own sleds.',
        },
        costs: {
          lodging: 238, gas: 35, permits: 0, rentals: 550, food: 120, total: 943, perPerson: 157, nights: 1,
        },
        permits: {
          required: false,
          details: 'Utah registration required if bringing your own sled ($40). Rentals include registration.',
          cost: 0,
        },
        packingList: [
          'Snowmobile bibs and jacket',
          'Warm boots and gloves',
          'Balaclava and goggles',
          'Hand warmers',
          'Packed lunch and thermos',
          'Extra dry socks',
          'Phone with trail maps downloaded',
          'First aid kit',
        ],
      },
      {
        type: 'best_value',
        label: 'Best Value',
        destination: 'Bear Lake / Montpelier, ID',
        tagline: 'Affordable riding with great snow and lower crowds than Wyoming destinations',
        conditions: {
          snowpack: '110% of normal',
          freshSnow: '16-20" expected by Saturday (3-5" Mon-Tue, 6-8" Wed-Thu, 5-7" Fri, 2" Sat)',
          baseDepth: '72 inches (110% of normal)',
          avalanche: 'Low',
          temperature: '20-28°F',
          forecast: 'Mon-Tue: 3-5" steady snow. Wed-Thu: 6-8" big storm. Fri: 5-7" powder. Sat: 2" morning flurries, clearing. Sun: Bluebird.',
          trailStatus: 'Well-groomed, 200+ miles of trails',
          specialNotes: 'Less crowded than Togwotee with nearly as good snow',
        },
        travel: {
          driveTime: '2.5 hrs from Lehi, UT',
          distance: '155 miles',
          gasEstimate: '$55',
          routeNotes: 'I-15 N through Logan, then US-89 to Bear Lake. Beautiful drive through Logan Canyon.',
          memberDriveTimes: [
            { name: 'Bryce', from: 'Highland, UT', driveTime: '2.4 hrs' },
            { name: 'Jake', from: 'Mapleton, UT', driveTime: '3.1 hrs' },
            { name: 'Mike', from: 'Lehi, UT', driveTime: '2.5 hrs' },
            { name: 'Tyler', from: 'Saratoga Springs, UT', driveTime: '2.6 hrs' },
            { name: 'Dave', from: 'Monticello, UT', driveTime: '7.0 hrs' },
            { name: 'Chris', from: 'Lehi, UT', driveTime: '2.5 hrs' },
          ],
        },
        lodging: [
          { name: 'Bear Lake Motor Lodge', pricePerNight: 89, rating: 3.8, highlights: 'Budget-friendly, clean rooms, close to trails, parking for trailers', bookingNote: 'Best deal in the area' },
          { name: 'Conestoga Ranch', pricePerNight: 159, rating: 4.5, highlights: 'Glamping tents with heaters, unique experience, group discounts', bookingNote: 'Winter glamping is a unique experience' },
          { name: 'Ideal Beach Resort', pricePerNight: 109, rating: 4.0, highlights: 'Condos sleep 6-8, kitchen, lakeside, good group option', bookingNote: 'Winter rates are much lower than summer' },
        ],
        dining: [
          { name: 'Bear Lake Pizza Company', type: 'Pizza', priceRange: '$', note: 'Huge pizzas, casual atmosphere, local favorite' },
          { name: "Butch Cassidy's Hideout", type: 'American/Burgers', priceRange: '$', note: 'Great burgers, Old West theme, fun for groups' },
          { name: "LaBeau's", type: 'American', priceRange: '$$', note: 'Known for raspberry shakes (Bear Lake raspberries are famous)' },
        ],
        rentals: {
          available: true,
          provider: 'Bear Lake Rentals / Epic Recreation',
          pricePerDay: 225,
          notes: 'Best rates in the region. Full-day rentals include safety gear. Guided tours available at extra cost.',
        },
        costs: {
          lodging: 178, gas: 55, permits: 40, rentals: 450, food: 100, total: 823, perPerson: 137, nights: 1,
        },
        permits: {
          required: true,
          details: 'Idaho snowmobile registration required for riding in Idaho ($35). Can purchase at the rental shop.',
          cost: 40,
        },
        packingList: [
          'Snowmobile bibs and jacket',
          'Warm boots (rated -20°F or below)',
          'Gloves and balaclava',
          'Goggles (amber lens for flat light)',
          'Hand/toe warmers',
          'Cooler with food and drinks',
          'Extra layers (it gets cold at Bear Lake)',
          'Camera for lake views',
        ],
      },
    ],
    searchDate: new Date().toISOString().split('T')[0],
    activity: 'Snowmobile',
    groupSize: groupSize,
    notes: 'Demo data shown — connect your Anthropic API key in .env for real-time recommendations with current conditions, live pricing, and weather forecasts.',
  };
}

function parseJsonResponse(fullText) {
  let parsed;
  const trimmed = fullText.trim();

  // Try direct JSON parse
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    // Try to extract from markdown code block
    const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[1].trim()); } catch { /* fall through */ }
    }
    // Try to find the outermost JSON object
    if (!parsed) {
      const start = trimmed.indexOf('{');
      const end = trimmed.lastIndexOf('}');
      if (start !== -1 && end > start) {
        try { parsed = JSON.parse(trimmed.substring(start, end + 1)); } catch { /* fall through */ }
      }
    }
    if (!parsed) {
      console.error('[Claude] Could not parse JSON from:', trimmed.substring(0, 500));
      throw new Error('Could not parse AI response as JSON');
    }
  }

  // Validate structure
  if (!parsed.options || !Array.isArray(parsed.options) || parsed.options.length === 0) {
    console.error('[Claude] Invalid structure:', JSON.stringify(parsed).substring(0, 500));
    throw new Error('AI response missing options array');
  }

  return parsed;
}

export async function planTrip(params) {
  const userMessage = buildUserMessage(params);

  try {
    const response = await fetch('/api/plan-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // If API key not configured, fall back to mock data
      if (response.status === 500 && errorData.error?.includes('ANTHROPIC_API_KEY')) {
        console.warn('API key not set, using demo data');
        return getMockResults(params.activity, params.groupSize);
      }

      // Rate limited — wait and retry once
      if (response.status === 429) {
        console.warn('[Claude] Rate limited, waiting 60s and retrying...');
        await new Promise(r => setTimeout(r, 60000));
        return planTrip(params); // retry
      }

      throw new Error(errorData.error?.message || errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Claude] Response type:', data.type, 'stop_reason:', data.stop_reason);
    console.log('[Claude] Content blocks:', (data.content || []).map(b => b.type));

    // Extract text content from the response
    // With web_search, there are multiple text blocks - intro text, then the JSON result
    const textBlocks = (data.content || []).filter(block => block.type === 'text');
    console.log('[Claude] Found', textBlocks.length, 'text blocks, lengths:', textBlocks.map(b => b.text.length));

    if (textBlocks.length === 0) {
      throw new Error('No text response from AI');
    }

    // Try each text block individually to find the one with valid JSON
    // The JSON block is usually the last/longest text block
    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const text = textBlocks[i].text.trim();
      if (text.includes('"options"') && text.includes('"destination"')) {
        console.log('[Claude] Found JSON in text block', i, '- length:', text.length);
        try {
          return parseJsonResponse(text);
        } catch (e) {
          console.warn('[Claude] Block', i, 'looked like JSON but failed to parse:', e.message);
        }
      }
    }

    // Fallback: concatenate all text and try to parse
    const fullText = textBlocks.map(block => block.text).join('\n');
    console.log('[Claude] Trying full concatenated text, length:', fullText.length);
    return parseJsonResponse(fullText);
  } catch (error) {
    // If it's a network error, timeout, or API unavailable, use mock data
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('timeout') || msg.includes('anthropic_api_key')) {
      console.warn('API unavailable, using demo data:', error.message);
      return getMockResults(params.activity, params.groupSize);
    }
    throw error;
  }
}
