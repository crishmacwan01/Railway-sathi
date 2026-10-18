import { TrainJourneyData, TrainSearchResult } from '../types/railway';

export const SEARCHABLE_TRAINS: TrainSearchResult[] = [
  {
    trainNumber: '12951',
    name: 'Mumbai Central - New Delhi Rajdhani Express',
    origin: 'Mumbai Central',
    originCode: 'MMCT',
    destination: 'New Delhi',
    destCode: 'NDLS',
    duration: '15h 32m',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainNumber: '12009',
    name: 'Mumbai Central - Ahmedabad Shatabdi Express',
    origin: 'Mumbai Central',
    originCode: 'MMCT',
    destination: 'Ahmedabad Jn',
    destCode: 'ADI',
    duration: '6h 20m',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  {
    trainNumber: '22436',
    name: 'New Delhi - Varanasi Vande Bharat Express',
    origin: 'New Delhi',
    originCode: 'NDLS',
    destination: 'Varanasi Jn',
    destCode: 'BSB',
    duration: '8h 00m',
    activeDays: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainNumber: '12301',
    name: 'Howrah - New Delhi Rajdhani Express',
    origin: 'Howrah Jn',
    originCode: 'HWH',
    destination: 'New Delhi',
    destCode: 'NDLS',
    duration: '17h 05m',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  {
    trainNumber: '12431',
    name: 'Thiruvananthapuram - Hazrat Nizamuddin Rajdhani Express',
    origin: 'Thiruvananthapuram Central',
    originCode: 'TVC',
    destination: 'Hazrat Nizamuddin',
    destCode: 'NZM',
    duration: '42h 00m',
    activeDays: ['Tue', 'Thu', 'Fri'],
  }
];

// High fidelity dataset for 12951 Mumbai Central -> New Delhi Rajdhani
export const SAMPLE_12951_JOURNEY: TrainJourneyData = {
  train: {
    id: 'tr_12951',
    trainNumber: '12951',
    name: 'Mumbai Central - New Delhi Rajdhani Express',
    origin: {
      id: 'st_mmct',
      code: 'MMCT',
      name: 'Mumbai Central',
      city: 'Mumbai',
      state: 'Maharashtra',
      location: { lat: 18.9696, lng: 72.8193 },
      elevationMeters: 12
    },
    destination: {
      id: 'st_ndls',
      code: 'NDLS',
      name: 'New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      location: { lat: 28.6143, lng: 77.2188 },
      elevationMeters: 216
    },
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    totalDistanceKm: 1386,
    type: 'RAJDHANI'
  },
  serviceDate: '2026-10-08',
  stops: [
    {
      sequence: 1,
      station: {
        id: 'st_mmct',
        code: 'MMCT',
        name: 'Mumbai Central',
        city: 'Mumbai',
        state: 'Maharashtra',
        location: { lat: 18.9696, lng: 72.8193 },
        elevationMeters: 12
      },
      scheduledArrival: '16:55',
      scheduledDeparture: '17:00',
      actualArrival: '16:55',
      actualDeparture: '17:00',
      delayMinutes: 0,
      platform: '1',
      status: 'PASSED',
      distanceFromOriginKm: 0
    },
    {
      sequence: 2,
      station: {
        id: 'st_bvi',
        code: 'BVI',
        name: 'Borivali',
        city: 'Mumbai',
        state: 'Maharashtra',
        location: { lat: 19.2288, lng: 72.8569 },
        elevationMeters: 16
      },
      scheduledArrival: '17:35',
      scheduledDeparture: '17:37',
      actualArrival: '17:34',
      actualDeparture: '17:37',
      delayMinutes: 0,
      platform: '6',
      status: 'PASSED',
      distanceFromOriginKm: 30
    },
    {
      sequence: 3,
      station: {
        id: 'st_st',
        code: 'ST',
        name: 'Surat',
        city: 'Surat',
        state: 'Gujarat',
        location: { lat: 21.2052, lng: 72.8407 },
        elevationMeters: 19
      },
      scheduledArrival: '19:42',
      scheduledDeparture: '19:47',
      actualArrival: '19:40',
      actualDeparture: '19:46',
      delayMinutes: 0,
      platform: '1',
      status: 'PASSED',
      distanceFromOriginKm: 263
    },
    {
      sequence: 4,
      station: {
        id: 'st_brc',
        code: 'BRC',
        name: 'Vadodara Jn',
        city: 'Vadodara',
        state: 'Gujarat',
        location: { lat: 22.3107, lng: 73.1812 },
        elevationMeters: 36
      },
      scheduledArrival: '21:06',
      scheduledDeparture: '21:16',
      estimatedArrival: '21:06',
      estimatedDeparture: '21:16',
      delayMinutes: 0,
      platform: '2',
      status: 'UPCOMING',
      distanceFromOriginKm: 392
    },
    {
      sequence: 5,
      station: {
        id: 'st_rtm',
        code: 'RTM',
        name: 'Ratlam Jn',
        city: 'Ratlam',
        state: 'Madhya Pradesh',
        location: { lat: 23.3441, lng: 75.0354 },
        elevationMeters: 493
      },
      scheduledArrival: '00:25',
      scheduledDeparture: '00:28',
      estimatedArrival: '00:25',
      estimatedDeparture: '00:28',
      delayMinutes: 0,
      platform: '5',
      status: 'UPCOMING',
      distanceFromOriginKm: 652
    },
    {
      sequence: 6,
      station: {
        id: 'st_kota',
        code: 'KOTA',
        name: 'Kota Jn',
        city: 'Kota',
        state: 'Rajasthan',
        location: { lat: 25.2138, lng: 75.8648 },
        elevationMeters: 253
      },
      scheduledArrival: '03:15',
      scheduledDeparture: '03:20',
      estimatedArrival: '03:15',
      estimatedDeparture: '03:20',
      delayMinutes: 0,
      platform: '1',
      status: 'UPCOMING',
      distanceFromOriginKm: 918
    },
    {
      sequence: 7,
      station: {
        id: 'st_ndls',
        code: 'NDLS',
        name: 'New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: { lat: 28.6143, lng: 77.2188 },
        elevationMeters: 216
      },
      scheduledArrival: '08:32',
      scheduledDeparture: '08:32',
      estimatedArrival: '08:32',
      estimatedDeparture: '08:32',
      delayMinutes: 0,
      platform: '3',
      status: 'UPCOMING',
      distanceFromOriginKm: 1386
    }
  ],
  liveStatus: {
    trainNumber: '12951',
    // Live train is approaching Bharuch / Narmada Bridge towards Vadodara
    position: { lat: 21.7051, lng: 72.9959 },
    speedKmh: 118,
    heading: 26,
    previousStation: {
      id: 'st_st',
      code: 'ST',
      name: 'Surat',
      city: 'Surat',
      state: 'Gujarat',
      location: { lat: 21.2052, lng: 72.8407 },
      elevationMeters: 19
    },
    nextStation: {
      id: 'st_brc',
      code: 'BRC',
      name: 'Vadodara Jn',
      city: 'Vadodara',
      state: 'Gujarat',
      location: { lat: 22.3107, lng: 73.1812 },
      elevationMeters: 36
    },
    delayMinutes: 0,
    etaNextStation: '21:06',
    destinationEta: '08:32 Tomorrow',
    distanceCoveredKm: 334,
    distanceRemainingKm: 1052,
    progressPercent: 24.1,
    status: 'ON_TIME',
    lastUpdatedAt: 'Just now (12s ago)',
    providerTimestamp: '2026-10-08T20:41:20Z',
    dataQuality: 'LIVE'
  },
  routeGeoJson: {
    type: 'Feature',
    properties: {
      name: 'Western Railway Main Trunk Corridor'
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [72.8193, 18.9696], // Mumbai Central
        [72.8410, 19.1197], // Andheri
        [72.8569, 19.2288], // Borivali
        [72.8091, 19.5843], // Palghar
        [72.7712, 19.8974], // Dahanu Road
        [72.9056, 20.3782], // Vapi
        [72.9295, 20.6074], // Valsad
        [72.9328, 20.9497], // Navsari
        [72.8407, 21.2052], // Surat
        [72.9959, 21.7051], // Bharuch (Narmada River Bridge) - current position
        [73.1812, 22.3107], // Vadodara
        [73.5658, 22.7533], // Godhra
        [74.2562, 22.8364], // Dahod
        [74.6183, 23.0039], // Meghnagar
        [75.0354, 23.3441], // Ratlam
        [75.2917, 23.8342], // Nagda
        [75.8239, 24.5381], // Shamgarh
        [75.8648, 25.2138], // Kota
        [76.3811, 25.9912], // Sawai Madhopur
        [76.7644, 26.5412], // Gangapur City
        [77.0125, 26.9856], // Bayana
        [77.4952, 27.2152], // Bharatpur
        [77.6737, 27.4924], // Mathura
        [77.3039, 28.4089], // Faridabad
        [77.2410, 28.5889], // Hazrat Nizamuddin
        [77.2188, 28.6143]  // New Delhi
      ]
    }
  },
  elevationProfile: [
    { distanceKm: 0, elevationM: 12, stationName: 'MMCT' },
    { distanceKm: 30, elevationM: 16, stationName: 'BVI' },
    { distanceKm: 170, elevationM: 28 },
    { distanceKm: 263, elevationM: 19, stationName: 'ST' },
    { distanceKm: 334, elevationM: 22, stationName: 'LIVE' },
    { distanceKm: 392, elevationM: 36, stationName: 'BRC' },
    { distanceKm: 500, elevationM: 142 },
    { distanceKm: 652, elevationM: 493, stationName: 'RTM (Peak)' },
    { distanceKm: 800, elevationM: 380 },
    { distanceKm: 918, elevationM: 253, stationName: 'KOTA' },
    { distanceKm: 1100, elevationM: 210 },
    { distanceKm: 1240, elevationM: 180, stationName: 'MTJ' },
    { distanceKm: 1386, elevationM: 216, stationName: 'NDLS' }
  ],
  weather: [
    {
      stationCode: 'ST',
      stationName: 'Surat (Passed)',
      tempC: 31,
      condition: 'Clear Sky',
      humidityPercent: 62,
      windKph: 12,
      rainChancePercent: 5,
      icon: 'sun'
    },
    {
      stationCode: 'BRC',
      stationName: 'Vadodara (Next Stop)',
      tempC: 28,
      condition: 'Partly Cloudy',
      humidityPercent: 68,
      windKph: 9,
      rainChancePercent: 15,
      icon: 'cloud-moon'
    },
    {
      stationCode: 'NDLS',
      stationName: 'New Delhi (Destination)',
      tempC: 24,
      condition: 'Pleasant & Hazy',
      humidityPercent: 54,
      windKph: 8,
      rainChancePercent: 0,
      icon: 'cloud-sun'
    }
  ],
  nearbyFeatures: [
    {
      id: 'geo_1',
      name: 'Golden Bridge / Narmada River',
      category: 'river',
      description: 'Historical 1881 railway bridge over sacred Narmada River. Approaching in 6 km.',
      distanceFromRouteKm: 0.2,
      location: { lat: 21.7100, lng: 72.9960 }
    },
    {
      id: 'geo_2',
      name: 'Western Ghats Foothills',
      category: 'scenic',
      description: 'Gentle green rolling landscape and coastal saline plains of South Gujarat.',
      distanceFromRouteKm: 4.8,
      location: { lat: 20.8500, lng: 73.1000 }
    },
    {
      id: 'geo_3',
      name: 'Dara Pass & Chambal Ravines',
      category: 'mountain',
      description: 'Rugged Vindhya and Mukundara Hills canyon section between Ratlam and Kota.',
      distanceFromRouteKm: 1.5,
      location: { lat: 24.8000, lng: 75.7500 }
    }
  ]
};
