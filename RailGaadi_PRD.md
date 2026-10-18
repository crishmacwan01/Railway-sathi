# RailGaadi --- Product Requirements Document

**Document status:** Product + Engineering specification\
**Version:** 1.0\
**Product type:** Consumer travel / railway intelligence web
application\
**Primary platform:** Responsive web application, mobile-first\
**Design direction:** Apple Maps × Linear × Stripe × Arc × Notion\
**Core providers:** RailRadar, MapTiler + MapLibre, OpenWeather,
OpenTopography, Turf.js, Overpass / OpenStreetMap

------------------------------------------------------------------------

# 1. Product Vision

## 1.1 Product Overview

RailGaadi is a premium real-time Indian railway journey companion that
turns raw train-running data into a visually rich, understandable
journey experience.

The core experience is:

> **Search a train → see exactly where it is → understand where it is
> going → understand how the journey is progressing → discover what is
> around the route.**

The product combines live railway information with maps, weather,
terrain, geographic points of interest, and journey analytics.

RailGaadi should not feel like a conventional railway-status utility. It
should feel like a modern travel product: fast, calm, visual,
information-dense without being overwhelming, and usable on a phone
while travelling.

## 1.2 Problem Statement

Rail passengers often need several pieces of information simultaneously:

-   Where is my train right now?
-   Is it delayed?
-   Which station are we approaching?
-   When will we arrive?
-   How much of the journey is complete?
-   What is the weather at the next station?
-   What geographical features are nearby?
-   What happened earlier in the journey?

Existing railway tracking experiences often expose individual facts
without creating a coherent journey model.

RailGaadi solves this by creating a single journey timeline and
map-centric interface.

## 1.3 Product Principles

1.  **Live first:** Current train state is the primary information
    hierarchy.
2.  **Map as the canvas:** Geographic context is central rather than
    decorative.
3.  **Progress over raw data:** Convert coordinates and timestamps into
    understandable journey progress.
4.  **Calm information density:** Show important information first;
    progressively disclose secondary detail.
5.  **Truthful freshness:** Always show when live data was last updated.
6.  **Graceful degradation:** A failed weather or POI provider must not
    break train tracking.
7.  **Mobile while travelling:** One-handed operation, large touch
    targets, low cognitive load.
8.  **Premium motion:** Animations explain state changes rather than
    merely decorate the interface.
9.  **Provider abstraction:** External APIs are replaceable behind
    internal provider interfaces.
10. **Scalable foundation:** MVP architecture should not require a
    rewrite for commercial scale.

## 1.4 Target Audience

### Primary

-   Daily and occasional Indian railway passengers
-   Long-distance train passengers
-   Students travelling between cities
-   Families tracking a travelling member
-   Railway enthusiasts

### Secondary

-   Travel planners
-   Train enthusiasts / railfans
-   Developers or organizations consuming railway intelligence
-   Future commercial partners

## 1.5 Goals

### MVP goals

-   Search any supported train by number/name.
-   Display current train position when provider data is available.
-   Show current and next station.
-   Display delay and ETA.
-   Visualize the route on an interactive India map.
-   Provide meaningful journey progress.
-   Show journey analytics.
-   Add contextual weather and geographic information.
-   Support shareable journey links.
-   Deliver a premium responsive experience.

### Non-goals for MVP

-   Ticket booking.
-   Payments.
-   PNR management unless added as a later module.
-   Railway reservations.
-   Official railway customer support.
-   Guaranteed replacement for official railway announcements.
-   Social network functionality.

## 1.6 Success Metrics

### Acquisition

-   Search-to-train-view conversion
-   Shared journey link opens
-   Returning-user rate

### Activation

-   \% of visitors completing a train search
-   \% of users opening live tracking
-   \% of users using map-follow mode
-   \% of users adding a favourite train

### Engagement

-   Average journey-view session duration
-   Sessions per tracked journey
-   Analytics tab opens
-   Weather / route context interactions
-   Favourite-train usage

### Reliability

-   Live-data freshness SLA
-   API success rate
-   Map load success rate
-   Median initial render time
-   Crash/error-free session rate

### Performance targets

-   LCP: ≤ 2.5 s on a reasonable 4G mobile connection
-   INP: ≤ 200 ms target
-   CLS: ≤ 0.1 target
-   Initial application JS should be aggressively code-split.
-   Live-status requests should not unnecessarily re-download static
    route data.

### Product quality

-   Search success rate \> 95% for supported train identifiers
-   Live tracking successfully renders \> 99% when provider data is
    available
-   Provider failures degrade individual modules rather than the entire
    page

------------------------------------------------------------------------

# 2. User Personas

## Persona A --- The Passenger

**Goal:** Know whether the train is on time and when they will arrive.

Pain points: - Uncertainty about current location - Confusing railway
terminology - Delayed updates - Need to repeatedly search the train

Key needs: - Current station - Next station - ETA - Delay - Simple
progress indicator

## Persona B --- The Family Tracker

**Goal:** Follow another person's train journey.

Pain points: - Doesn't know train location - Wants a simple shareable
link - Doesn't need excessive technical information

Key needs: - Share link - Live map - Last updated timestamp -
Destination ETA

## Persona C --- The Rail Enthusiast

**Goal:** Explore the railway journey in detail.

Pain points: - Raw railway data lacks geographic context - Wants route
and terrain information - Interested in stations, elevation and
infrastructure

Key needs: - Route visualization - Timeline - Elevation profile -
Station history - Geographic context

## Persona D --- The Travel Planner

**Goal:** Understand the journey before or during travel.

Key needs: - Route summary - Weather - Nearby cities - Mountains,
rivers, bridges and attractions - Journey duration and distance

------------------------------------------------------------------------

# 3. Functional Requirements

# 3.1 Train Search

## User stories

-   As a passenger, I want to search by train number so I can quickly
    find my train.
-   As a passenger, I want to search by train name so I don't need to
    remember the number.
-   As a returning user, I want recent searches so I can reopen a train
    quickly.
-   As a frequent passenger, I want favourite trains.

## Functional requirements

1.  Search input must accept:
    -   Train number
    -   Train name
    -   Partial train name
2.  Search should debounce requests by approximately 250--350 ms.
3.  Search results should display:
    -   Train number
    -   Train name
    -   Origin
    -   Destination
    -   Running days if available
4.  Exact train-number matches should be prioritized.
5.  Search must normalize:
    -   Case
    -   Extra whitespace
    -   Common punctuation
6.  Recent searches should be locally persisted for anonymous users.
7.  Authenticated users may sync favourites across devices.

## Empty states

-   No query: "Search for a train number or name."
-   No results: "No matching trains found."
-   Provider unavailable: "Train search is temporarily unavailable."

## Edge cases

-   Same train has multiple schedules.
-   Train number changes seasonally.
-   Provider returns duplicate records.
-   Search provider returns stale train metadata.
-   Train name contains regional/Unicode characters.

------------------------------------------------------------------------

# 3.2 Live Train Tracking

## User stories

-   As a passenger, I want to see my train's current position.
-   As a passenger, I want to know the current and next station.
-   As a passenger, I want to know whether my train is delayed.
-   As a passenger, I want to know when the data was last updated.

## Required live state

``` text
train
serviceDate
currentPosition
currentStation
nextStation
previousStation
status
delayMinutes
eta
distanceCovered
distanceRemaining
journeyProgress
lastUpdatedAt
providerTimestamp
dataQuality
```

## Running status states

-   On time
-   Early
-   Delayed
-   Stopped
-   Approaching station
-   At station
-   Departed
-   Completed
-   Not started
-   Data unavailable

## Live refresh

Recommended default: - Active journey: refresh every 30--60 seconds
depending on provider limitations. - Background tab: reduce refresh
frequency. - Completed journey: stop polling. - Provider rate limit:
automatically back off. - Manual refresh: always available.

The UI must display freshness, e.g.:

> Updated 24 seconds ago

Never imply that the train marker is perfectly real-time when provider
data is delayed.

## Train marker interpolation

The backend/provider position is authoritative. The frontend may
visually interpolate marker movement between known positions for smooth
animation.

Interpolation must stop or reset when: - A new provider position differs
substantially from predicted position. - Train jumps backward/forward
beyond configured tolerance. - GPS/railway provider data is stale. -
Train enters station stop state.

## Edge cases

-   Train position unavailable.
-   GPS coordinate outside route corridor.
-   Train appears stationary between stations.
-   Provider reports conflicting station and coordinates.
-   Train is cancelled or terminated early.
-   Journey crosses midnight.
-   Journey has multiple service dates.

------------------------------------------------------------------------

# 3.3 Journey Map

## Requirements

The map must support:

-   Full-screen mode
-   Train marker
-   Railway route
-   Completed route
-   Remaining route
-   Current station
-   Station markers
-   Camera follow
-   Zoom
-   Rotation
-   Pitch
-   Route animation
-   Dark map theme

## Map behavior

### Default

Map centers around the train and shows the next meaningful portion of
the route.

### Follow mode

When enabled: - Camera follows train. - User can manually pan. - Manual
pan temporarily pauses follow. - A "Re-center" control appears. - Follow
mode can be restored with one tap.

### Route

The route is represented as a GeoJSON LineString or MultiLineString.

The route should be segmented into: - completed - current segment -
remaining

Turf.js should be used for geospatial calculations where appropriate: -
Along-route distance - Point-to-line calculations - Bounding boxes -
Nearest route point - Route interpolation - Progress calculations

## Map loading

Initial load: 1. Render map shell. 2. Load base style. 3. Render route
when available. 4. Render stations. 5. Render train marker. 6. Enable
animations.

If route data is delayed, show map with train location and skeleton
route state.

------------------------------------------------------------------------

# 3.4 Journey Analytics

## Metrics

-   Journey completion %
-   Distance covered
-   Distance remaining
-   Total distance
-   Delay
-   Average speed where data quality permits
-   Estimated arrival
-   Number of stations completed
-   Number of stations remaining
-   Highest elevation
-   Current elevation where available
-   Journey start time
-   Expected arrival time
-   Actual arrival history

## Journey progress

Primary calculation:

``` text
progress = distanceCovered / totalRouteDistance * 100
```

Clamp result between 0 and 100.

If reliable distance cannot be calculated, fallback to station-based
progress and mark it as estimated.

## Timeline

Timeline entries:

``` text
Station
Scheduled arrival
Actual/estimated arrival
Scheduled departure
Actual/estimated departure
Delay
Status
```

Statuses: - Passed - Current - Upcoming - Delayed - Unknown

## Elevation profile

OpenTopography data should be used when route elevation is available.

The chart should: - Display route distance on X-axis. - Display
elevation on Y-axis. - Mark current position. - Mark highest
elevation. - Allow hover/tap inspection.

Elevation should be treated as geographic context, not as railway
operational data.

------------------------------------------------------------------------

# 3.5 Smart Travel Companion

## Weather

Display weather for: - Current station - Next station - Destination

Data: - Temperature - Feels-like temperature if available - Humidity -
Wind - Rain probability - Weather condition - Forecast timestamp

Weather should be cached aggressively because station weather does not
need to refresh at the same rate as train data.

## Route geography

Discover nearby: - Rivers - Lakes - Mountains - Ghats - Bridges -
Tunnels - Monuments - Tourist attractions - Cities - Districts

Overpass/OpenStreetMap should be used for geographic POI discovery.

POIs must be queried within a bounded corridor around the train route
rather than repeatedly querying the entire route.

## UX behavior

The user should see contextual cards such as:

> **Western Ghats nearby**\
> Your train is approaching a mountainous section of the route.

or:

> **Narmada River**\
> Approximately 3.2 km from the current route.

Do not overwhelm the primary tracking experience. Context should be
secondary and collapsible.

------------------------------------------------------------------------

# 3.6 Share Live Journey

## User flow

1.  User opens a train.
2.  Selects "Share journey."
3.  System creates or retrieves a share token.
4.  Native share sheet opens where supported.
5.  Recipient opens URL.
6.  Recipient sees a read-only live journey view.

Example:

``` text
/track/12951?date=2026-10-03&share=abc123
```

Share tokens should not expose private account identifiers.

## Shared view

Anonymous recipients can see: - Train - Current location - Current
station - Next station - Delay - ETA - Last update - Map

They cannot modify the journey.

------------------------------------------------------------------------

# 3.7 Favourites

Users can favourite trains.

Anonymous: - localStorage/IndexedDB

Authenticated: - backend persistence

Favourite card: - Train number - Train name - Latest status - Delay -
Next station - Last updated

If live data is unavailable, show last-known status with a freshness
label.

------------------------------------------------------------------------

# 3.8 Recent Searches

Store the most recent N searches, recommended 10.

Each entry: - Train number - Train name - Origin - Destination - Last
opened timestamp

Provide clear-all control.

Recent searches should not contain sensitive location information beyond
the train itself.

------------------------------------------------------------------------

# 4. Information Architecture

``` text
RailGaadi
│
├── Home
│   ├── Search
│   ├── Recent Searches
│   └── Favourite Trains
│
├── Train Journey
│   ├── Live Map
│   ├── Journey Header
│   ├── Current Status
│   ├── Route Progress
│   ├── Station Timeline
│   ├── Analytics
│   └── Travel Companion
│       ├── Weather
│       ├── Geography
│       └── Attractions
│
├── Shared Journey
│   └── Read-only Journey
│
├── Settings
│   ├── Appearance
│   ├── Units
│   ├── Refresh Preferences
│   └── About
│
└── Error / Offline
```

## Primary navigation

Desktop: - Logo - Search - Home - Favourites - Recent - Settings

Mobile: - Top search/action bar - Bottom navigation: - Home -
Favourites - Recent - Settings

During active tracking, navigation may collapse into a journey-focused
header.

------------------------------------------------------------------------

# 5. UI/UX Specification

## 5.1 Design Language

RailGaadi should use:

-   Large clean typography
-   Generous spacing
-   Neutral surfaces
-   Restrained accent color
-   Soft borders
-   Subtle shadows
-   Rounded cards
-   High-quality map rendering
-   Motion with purpose

Avoid: - Excessive gradients - Dense dashboard grids - Too many colors -
Heavy shadows - Decorative animations unrelated to user actions

## 5.2 Home Screen

### Desktop layout

``` text
┌──────────────────────────────────────────────────────┐
│ RailGaadi       Search trains...          Profile    │
├──────────────────────────────────────────────────────┤
│                                                      │
│        Your journey, beautifully tracked.            │
│                                                      │
│       [ Search train number or train name       ]    │
│                                                      │
│  Recent                                             │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ 12951        │ │ 12009        │                  │
│  │ Mumbai Raj... │ │ Shatabdi     │                  │
│  └──────────────┘ └──────────────┘                  │
│                                                      │
│  Favourite Trains                                    │
└──────────────────────────────────────────────────────┘
```

### Search component

States: - idle - focused - typing - loading - results - no results -
error

Keyboard: - `/` focuses search on desktop. - Enter selects top result. -
Escape closes results.

## 5.3 Journey Screen

The journey screen is the core product.

### Desktop

``` text
┌─────────────────────────────────────────────────────────┐
│ ← Train 12951        On Time       Updated 21 sec ago   │
├───────────────────────────────┬─────────────────────────┤
│                               │                         │
│                               │  Mumbai Central         │
│          MAP                  │  ↓                      │
│                               │  Current: Surat         │
│       ● TRAIN                 │  ↓                      │
│      ╱ route                   │  Next: Vadodara       │
│                               │                         │
│                               │  ETA 23:40              │
│                               │                         │
├───────────────────────────────┴─────────────────────────┤
│  64% complete       312 km covered      176 km remaining│
├─────────────────────────────────────────────────────────┤
│ Timeline                                                 │
├─────────────────────────────────────────────────────────┤
│ Analytics │ Weather │ Route Context                     │
└─────────────────────────────────────────────────────────┘
```

### Mobile

Map occupies approximately 45--60% of the initial viewport.

Bottom sheet contains: - train status - current station - next station -
ETA - progress

The sheet should be draggable between: - collapsed - half - expanded

## 5.4 Status Card

Display:

``` text
ON TIME
At Surat
Next: Vadodara
Arriving in 42 min
Updated 24 sec ago
```

Delay should be visually prominent when present.

Example:

``` text
12 min late
```

Use text + icon, not color alone.

## 5.5 Progress Component

Show:

-   percentage
-   visual route bar
-   distance covered
-   distance remaining

Animated counter should animate only when value materially changes.

## 5.6 Station Timeline

Each station row:

``` text
● Surat
  Arrived 21:42
  Departed 21:47

○ Vadodara
  ETA 23:01
  +8 min

○ Ahmedabad
  ETA 00:25
```

Current station receives stronger visual hierarchy.

## 5.7 Analytics

Cards: - Total distance - Covered - Remaining - Delay - Elevation -
Highest point

Charts: - Elevation profile - Travel timeline

Charts must have accessible textual alternatives.

## 5.8 Travel Companion

Sections:

### Weather card

``` text
Surat
29°
Partly cloudy
Humidity 68%
Wind 12 km/h
Rain 20%
```

### Route context

Cards for geographic features.

Each card: - Icon - Name - Type - Approximate distance - Optional short
description

## 5.9 Map Controls

Floating controls: - Re-center - Follow train - Zoom + - Zoom - - Map
style - Full screen

On mobile, controls should not overlap the bottom sheet.

## 5.10 Loading States

Use skeletons for: - Train header - Status card - Timeline - Analytics -
Weather

Map should use a map-specific loading state.

Avoid generic full-page spinners unless the entire application is
unavailable.

## 5.11 Error States

Errors should be local.

Bad: \> Something went wrong.

Good: \> Live train data is temporarily unavailable. Your last update
was 2 min ago.

Actions: - Retry - View last known state - Return home

## 5.12 Offline

If cached journey data exists:

> You're offline. Showing the latest available journey data from 3 min
> ago.

Disable: - live refresh - new provider-dependent requests

Keep: - cached route - cached stations - cached last state

## 5.13 Dark Mode

Although the supplied feature list emphasizes a white premium interface,
the architecture should support dark mode.

Dark mode: - near-black background - elevated dark surfaces - high
contrast text - dark map style - restrained accent

System preference should be respected initially.

## 5.14 Motion

Animation guidelines:

-   Page transition: 150--250 ms
-   Card entrance: 180--280 ms
-   Marker interpolation: continuous
-   Route glow: subtle and slow
-   Counter changes: 300--500 ms
-   Bottom sheet: spring-like motion

Respect:

``` css
@media (prefers-reduced-motion: reduce)
```

Animations must be disabled or reduced for users requesting reduced
motion.

------------------------------------------------------------------------

# 6. Technical Architecture

## 6.1 Recommended stack

### Frontend

-   React
-   TypeScript
-   Vite or Next.js
-   Tailwind CSS
-   MapLibre GL JS
-   Turf.js
-   TanStack Query
-   Zustand for lightweight UI state
-   Recharts or another lightweight charting library
-   Zod for runtime validation

### Backend

Recommended: - Node.js - TypeScript - Fastify or NestJS - PostgreSQL -
Redis - Background workers - REST API

The backend should isolate external providers from the frontend.

## 6.2 High-level architecture

``` text
Browser
   │
   ▼
Web Application
   │
   ├── Query Cache
   ├── UI State
   ├── Map Engine
   └── API Client
          │
          ▼
      API Gateway
          │
    ┌─────┼───────────────┐
    ▼     ▼               ▼
Train   Weather        Geo Services
Service Service        Service
    │     │               │
    ▼     ▼               ▼
RailRadar OpenWeather   Overpass
                         OpenTopo
    │
    ▼
PostgreSQL + Redis
```

## 6.3 Provider layer

Do not allow application code to call RailRadar/OpenWeather/Overpass
directly.

Define interfaces:

``` ts
interface TrainProvider {
  searchTrains(query: string): Promise<TrainSummary[]>;
  getJourney(input: JourneyRequest): Promise<TrainJourney>;
  getLiveStatus(input: LiveStatusRequest): Promise<LiveTrainStatus>;
}

interface WeatherProvider {
  getCurrent(location: Coordinates): Promise<Weather>;
  getForecast(location: Coordinates): Promise<WeatherForecast>;
}

interface TerrainProvider {
  getElevation(points: Coordinates[]): Promise<ElevationPoint[]>;
}

interface GeoProvider {
  getNearbyFeatures(
    geometry: GeoJSON.Geometry,
    categories: GeoCategory[]
  ): Promise<GeoFeature[]>;
}
```

This permits provider replacement without rewriting the product.

## 6.4 Service layer

Services:

-   TrainSearchService
-   JourneyService
-   LiveTrackingService
-   RouteService
-   StationService
-   AnalyticsService
-   WeatherService
-   TerrainService
-   GeoContextService
-   ShareService
-   FavouriteService
-   RecentSearchService

## 6.5 State management

### Server state

TanStack Query: - train search - journey - live status - weather -
terrain - geographic features

### Client state

Zustand: - selected tab - map follow mode - map style - bottom sheet
state - preferences

Do not store server data redundantly in Zustand.

## 6.6 Folder structure

``` text
src/
├── app/
├── pages/
├── components/
│   ├── common/
│   ├── train/
│   ├── map/
│   ├── analytics/
│   ├── weather/
│   └── journey/
├── features/
│   ├── search/
│   ├── tracking/
│   ├── favourites/
│   └── sharing/
├── hooks/
├── services/
├── providers/
├── stores/
├── lib/
├── types/
├── utils/
└── styles/
```

Backend:

``` text
server/
├── modules/
│   ├── trains/
│   ├── journeys/
│   ├── weather/
│   ├── terrain/
│   ├── geo/
│   ├── sharing/
│   └── users/
├── providers/
│   ├── railradar/
│   ├── openweather/
│   ├── opentopo/
│   └── overpass/
├── cache/
├── database/
├── middleware/
├── jobs/
├── config/
└── shared/
```

------------------------------------------------------------------------

# 7. API Design

Base URL:

``` text
/api/v1
```

## 7.1 Search trains

`GET /trains/search?q=12951`

Purpose: Find train metadata.

Response:

``` json
{
  "data": [
    {
      "trainNumber": "12951",
      "name": "Mumbai Central - New Delhi Rajdhani",
      "origin": "Mumbai Central",
      "destination": "New Delhi"
    }
  ]
}
```

Caching: - 1--24 hours depending on source. - Search result cache keyed
by normalized query.

Errors: - 400 invalid query - 429 rate limit - 502 provider failure -
503 service unavailable

## 7.2 Journey

`GET /trains/{trainNumber}/journey?date=YYYY-MM-DD`

Purpose: Get static route + current journey state.

Response:

``` json
{
  "train": {},
  "serviceDate": "2026-10-03",
  "route": {},
  "stations": [],
  "status": {}
}
```

Caching: - Static train metadata: long TTL. - Journey state: short TTL.

## 7.3 Live status

`GET /trains/{trainNumber}/live?date=YYYY-MM-DD`

Response:

``` json
{
  "trainNumber": "12951",
  "position": {
    "lat": 21.17,
    "lng": 72.83
  },
  "currentStation": {},
  "nextStation": {},
  "delayMinutes": 7,
  "eta": "2026-10-03T23:40:00+05:30",
  "lastUpdatedAt": "2026-10-03T22:03:20+05:30",
  "status": "DELAYED",
  "dataQuality": "LIVE"
}
```

Caching: - Redis short TTL. - Provider response should be cached
according to provider terms and freshness requirements.

Retry: - Exponential backoff with jitter for transient errors. - Avoid
aggressive retries for rate limits.

## 7.4 Weather

`GET /weather?lat={lat}&lng={lng}`

Caching: - Current: approximately 5--15 min. - Forecast: approximately
30--60 min.

## 7.5 Elevation

`POST /terrain/elevation`

Request:

``` json
{
  "points": [
    { "lat": 21.17, "lng": 72.83 }
  ]
}
```

Caching: - Route hash based. - Same route should not repeatedly query
terrain.

## 7.6 Geographic context

`POST /geo/context`

Request:

``` json
{
  "route": {},
  "categories": [
    "river",
    "lake",
    "mountain",
    "bridge",
    "tunnel",
    "monument"
  ]
}
```

The backend should spatially constrain Overpass queries.

## 7.7 Share

`POST /journeys/share`

Request:

``` json
{
  "trainNumber": "12951",
  "serviceDate": "2026-10-03"
}
```

Response:

``` json
{
  "shareId": "sh_8f93...",
  "urlPath": "/shared/sh_8f93..."
}
```

Share tokens: - random - non-sequential - revocable if accounts are
introduced - no PII

## 7.8 Favourites

`GET /me/favourites`

`POST /me/favourites`

`DELETE /me/favourites/{trainNumber}`

## 7.9 Standard error format

``` json
{
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "Live train data is temporarily unavailable.",
    "requestId": "req_123"
  }
}
```

Never expose provider secrets or internal stack traces.

------------------------------------------------------------------------

# 8. Data Models

## Train

``` ts
interface Train {
  id: string;
  trainNumber: string;
  name: string;
  originStationId: string;
  destinationStationId: string;
  activeDays?: number[];
  metadataUpdatedAt: string;
}
```

## Station

``` ts
interface Station {
  id: string;
  code?: string;
  name: string;
  city?: string;
  district?: string;
  state?: string;
  location: Coordinates;
}
```

## Coordinates

``` ts
interface Coordinates {
  lat: number;
  lng: number;
}
```

## TrainStop

``` ts
interface TrainStop {
  stationId: string;
  sequence: number;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  delayMinutes?: number;
  status: StopStatus;
}
```

## Journey

``` ts
interface Journey {
  train: Train;
  serviceDate: string;
  stops: TrainStop[];
  route: GeoJSON.LineString | GeoJSON.MultiLineString;
  totalDistanceKm?: number;
  status: JourneyStatus;
}
```

## LiveTrainStatus

``` ts
interface LiveTrainStatus {
  position?: Coordinates;
  currentStationId?: string;
  nextStationId?: string;
  previousStationId?: string;
  delayMinutes?: number;
  distanceCoveredKm?: number;
  distanceRemainingKm?: number;
  progressPercent?: number;
  eta?: string;
  status: RunningStatus;
  lastUpdatedAt: string;
  providerTimestamp?: string;
  dataQuality: "LIVE" | "STALE" | "ESTIMATED" | "UNAVAILABLE";
}
```

## Weather

``` ts
interface Weather {
  location: Coordinates;
  temperatureC: number;
  humidityPercent: number;
  windKph: number;
  precipitationProbability?: number;
  condition: string;
  observedAt: string;
}
```

## GeoFeature

``` ts
interface GeoFeature {
  id: string;
  name: string;
  category: GeoCategory;
  location: Coordinates;
  distanceFromRouteKm?: number;
  metadata?: Record<string, unknown>;
}
```

## Database schema

Recommended PostgreSQL tables:

``` text
users
trains
stations
train_stops
train_routes
journeys
journey_live_snapshots
favourites
recent_searches
share_links
provider_cache_metadata
```

Static railway route geometry should be stored as PostGIS geometry where
licensing/data terms permit.

Use PostGIS for: - spatial indexing - nearest station - route corridor
queries - geographic filtering

Redis: - live status cache - weather cache - provider response cache -
distributed rate limiting - short-lived share/session state

------------------------------------------------------------------------

# 9. Component Inventory

## Global

-   AppShell
-   Header
-   MobileHeader
-   DesktopSidebar
-   BottomNavigation
-   SearchInput
-   SearchCommandPalette
-   Button
-   IconButton
-   Tooltip
-   Modal
-   Drawer
-   Sheet
-   Toast
-   Skeleton
-   EmptyState
-   ErrorState
-   OfflineBanner

## Train

-   TrainSearchResults
-   TrainResultCard
-   TrainHeader
-   TrainStatusBadge
-   DelayIndicator
-   JourneyProgress
-   StationTimeline
-   StationRow
-   ETA
-   DistanceStats
-   FavouriteButton
-   ShareJourneyButton

## Map

-   JourneyMap
-   TrainMarker
-   StationMarker
-   RouteLayer
-   RouteProgressLayer
-   MapControls
-   FollowTrainButton
-   RecenterButton
-   MapStyleSelector
-   FullscreenMap
-   MapLegend

## Analytics

-   AnalyticsPanel
-   StatCard
-   ElevationChart
-   TravelTimeline
-   DelaySummary
-   RouteSummary

## Travel companion

-   WeatherCard
-   WeatherForecast
-   GeoContextCard
-   GeoContextCarousel
-   NearbyFeatureList
-   AttractionCard

## Account

-   FavouriteList
-   RecentSearchList
-   SettingsPanel
-   AppearanceSelector

------------------------------------------------------------------------

# 10. Performance Strategy

## Frontend

### Lazy loading

Lazy load: - analytics - elevation chart - travel companion - settings -
non-critical map overlays

Core journey map and status should load first.

### Code splitting

Separate bundles for: - map - charts - settings - authentication -
analytics

### Memoization

Memoize: - expensive GeoJSON transformations - route segmentation - map
layer definitions - derived journey statistics

Avoid blanket memoization.

### Debouncing

Search: - 250--350 ms

Map/geographic context: - debounce viewport-driven requests

### API caching

Use TanStack Query for: - stale-while-revalidate - deduplication -
retry - cache invalidation

### Map performance

-   Simplify long route geometry.
-   Use vector layers rather than thousands of DOM markers.
-   Cluster distant POIs.
-   Avoid rendering unnecessary stations outside viewport.
-   Use WebGL map rendering through MapLibre.

### Images

-   Prefer SVG icons.
-   Use modern image formats.
-   Lazy load attraction images if introduced.
-   Do not load large hero images on the journey screen unless
    necessary.

### Virtualization

Use virtualization for: - very long station lists - large POI lists -
future search/history pages

### Infinite scrolling

Not necessary for core journey tracking.

Appropriate for: - future discovery/search history - large attraction
datasets

------------------------------------------------------------------------

# 11. Security

## Authentication

MVP can support anonymous tracking.

Authentication becomes useful for: - synced favourites - cross-device
recent searches - saved journeys

Use secure HTTP-only cookies or a secure token architecture.

## Authorization

Server must verify ownership for: - favourites - account settings -
private saved journeys

Shared journeys must be explicitly read-only.

## Input validation

Validate: - train number format - date format - latitude/longitude
ranges - query length - share identifiers

Use Zod or equivalent.

## API security

-   HTTPS only
-   CORS allowlist
-   security headers
-   request size limits
-   rate limiting
-   structured logging
-   request IDs
-   dependency vulnerability scanning

## Provider secrets

Never expose: - RailRadar credentials - OpenWeather API key - MapTiler
private keys where applicable - backend credentials

Frontend should receive only public/client-safe configuration.

## Rate limiting

Recommended initial limits:

``` text
Search: 30 requests/min/IP
Live status: 60 requests/min/session
Weather: 30 requests/min/IP
Share creation: 10 requests/min/user
```

Adjust based on real usage and provider limits.

## Abuse prevention

Protect: - search endpoints - share creation - scraping - excessive
map/POI queries

Cache provider requests so one malicious client cannot directly multiply
upstream API costs.

------------------------------------------------------------------------

# 12. Accessibility

Target WCAG 2.2 AA.

Requirements:

-   Keyboard navigation
-   Visible focus states
-   Semantic HTML
-   Accessible labels for icon buttons
-   Minimum 44×44 px touch targets
-   Color contrast compliant
-   Do not use color as the only status indicator
-   Screen-reader-friendly station timeline
-   Text alternatives for charts
-   Reduced-motion support
-   Accessible map controls
-   Logical heading hierarchy
-   Modal focus trapping
-   Escape closes dialogs
-   Announce important live status changes carefully

Map accessibility:

The map cannot be the only source of information.

Always provide textual equivalents: - current station - next station -
route progress - nearby context

------------------------------------------------------------------------

# 13. Development Roadmap

## Milestone 0 --- Foundation

Deliver:

-   Repository
-   TypeScript setup
-   Design tokens
-   CI/CD
-   Environment management
-   Error monitoring
-   API conventions
-   Provider interfaces
-   Base database

Exit criteria: - Application deploys successfully. - CI checks pass. -
Basic observability exists.

## Milestone 1 --- Search + Journey Core

Deliver:

-   Train search
-   Train detail
-   Station data
-   Route data
-   Basic journey screen
-   Loading/error states

Exit criteria: - User can search and open a train. - Route renders
correctly.

## Milestone 2 --- Live Tracking

Deliver:

-   RailRadar integration
-   Live position
-   Current/next station
-   Delay
-   ETA
-   Last update
-   Auto-refresh
-   Marker interpolation

Exit criteria: - Live journey updates without page refresh. - Stale
provider data is clearly represented.

## Milestone 3 --- Immersive Map

Deliver:

-   MapLibre
-   MapTiler style
-   Route layers
-   Train marker
-   Camera follow
-   Fullscreen
-   Mobile map sheet
-   Map controls

Exit criteria: - Map remains responsive on mid-range mobile devices.

## Milestone 4 --- Analytics

Deliver:

-   Progress
-   Distance analytics
-   Timeline
-   Delay analysis
-   Elevation profile
-   Route summary

Exit criteria: - Analytics reconcile with route/live state.

## Milestone 5 --- Smart Travel Companion

Deliver:

-   OpenWeather
-   OpenTopography
-   Overpass
-   Route geography
-   Weather cards
-   Contextual POIs

Exit criteria: - Provider failure is isolated. - Weather and POI data
show freshness.

## Milestone 6 --- Sharing + Favourites

Deliver:

-   Share links
-   Read-only shared journey
-   Favourites
-   Recent searches
-   Optional authentication

Exit criteria: - Shared journey works without login. - Favourites
persist reliably.

## Milestone 7 --- Production Hardening

Deliver:

-   Rate limiting
-   Redis caching
-   Provider circuit breakers
-   Monitoring
-   Error tracking
-   Performance optimization
-   Accessibility audit
-   Security audit
-   Load testing

## Milestone 8 --- Commercial SaaS Foundation

Potential future capabilities:

-   User accounts
-   Saved journeys
-   Notifications
-   Advanced travel alerts
-   Subscription tiers
-   API access
-   Organization/team accounts
-   Usage analytics
-   Admin dashboard

These should not delay the MVP.

------------------------------------------------------------------------

# 14. Provider Reliability Architecture

Every provider must have:

-   timeout
-   retry policy
-   circuit breaker
-   cache
-   health state
-   structured error mapping

Example:

``` text
Frontend
   ↓
Journey API
   ↓
LiveTrackingService
   ↓
Redis cache
   ↓ cache miss
RailRadar
   ↓
Normalize response
   ↓
Cache
   ↓
Frontend
```

If RailRadar fails:

``` text
RailRadar unavailable
       ↓
Return last known cached state
       ↓
Mark dataQuality = STALE
       ↓
Show "Updated 4 min ago"
```

Do not return fabricated train positions.

------------------------------------------------------------------------

# 15. Data Freshness Model

Every dynamic response should contain:

``` text
observedAt
fetchedAt
expiresAt
dataQuality
```

Suggested classifications:

### LIVE

Provider data is within configured freshness threshold.

### STALE

Provider data exists but exceeds preferred freshness threshold.

### ESTIMATED

System calculated a derived value from reliable historical/current data.

### UNAVAILABLE

No trustworthy data exists.

The UI must distinguish these states.

------------------------------------------------------------------------

# 16. Observability

Track:

-   API latency
-   provider latency
-   provider error rate
-   cache hit ratio
-   live data freshness
-   map errors
-   JavaScript errors
-   search success
-   journey load time

Every request gets:

``` text
requestId
user/session ID if applicable
provider
latency
status
```

Do not log API keys or unnecessary personal data.

------------------------------------------------------------------------

# 17. Testing Strategy

## Unit tests

Test: - progress calculations - distance calculations - delay
calculations - station status - provider normalization - cache
expiration - date/time handling

## Integration tests

Test: - train search - live status - weather - terrain - geo context -
share generation

External providers should be mocked in deterministic CI tests.

## E2E tests

Core journey:

``` text
Open RailGaadi
→ Search train
→ Select result
→ Map loads
→ Current station displayed
→ Next station displayed
→ Live status displayed
→ Analytics opened
→ Weather opened
→ Share journey
```

## Visual regression

Test: - desktop - tablet - mobile - light - dark - loading - error -
stale data - long train names - long station names

------------------------------------------------------------------------

# 18. Product Acceptance Criteria

A release is MVP-ready when:

-   A user can find a train by number/name.
-   A valid train opens a journey screen.
-   Current location renders when provider data exists.
-   Current and next stations are shown.
-   Delay and ETA are shown.
-   Last update time is visible.
-   Map renders route and train marker.
-   Completed/remaining route is visually distinguishable.
-   Journey progress is calculated.
-   Station timeline works.
-   Weather works independently from live tracking.
-   Geographic context can fail without breaking the journey.
-   Share links open a read-only journey.
-   Recent searches work.
-   Favourite trains work.
-   Mobile UI is usable one-handed.
-   Keyboard and screen-reader basics work.
-   Provider failures are handled gracefully.
-   API secrets remain server-side.
-   Performance meets agreed targets on representative devices.

------------------------------------------------------------------------

# 19. Recommended Future Enhancements

These are intentionally outside MVP unless implementation effort is
small.

## Notifications

-   Train delay changed
-   Train approaching destination
-   Major route disruption

## Saved journeys

Allow a user to save: - train - service date - journey name

## PNR module

Potential separate product module.

## Station intelligence

-   Platform information where reliably available
-   Station facilities
-   Food
-   Restrooms
-   Accessibility

## Journey replay

After completion, let users replay the train's route.

## Railway explorer

Explore: - scenic routes - highest railway points - longest routes -
major bridges - tunnels - mountain railways

## Public API

A future developer API can expose normalized railway data subject to
provider licensing and commercial agreements.

------------------------------------------------------------------------

# 20. Final Product Definition

RailGaadi MVP is a **map-first live railway journey companion**, not a
booking platform.

The critical product loop is:

``` text
SEARCH
  ↓
UNDERSTAND
  ↓
TRACK
  ↓
EXPLORE
  ↓
SHARE
```

The product should make a passenger feel that they always know:

> **Where am I? Where is my train going? How late is it? What's coming
> next?**

The architecture should make it possible to answer those questions
reliably while allowing weather, terrain, geographic context, sharing,
accounts, and commercial capabilities to grow around the core journey
engine.
