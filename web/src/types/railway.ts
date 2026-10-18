// Core Data Models matching PRD specifications

export type DataQuality = 'LIVE' | 'STALE' | 'ESTIMATED' | 'UNAVAILABLE';
export type RunningStatus = 
  | 'ON_TIME' 
  | 'DELAYED' 
  | 'EARLY' 
  | 'STOPPED' 
  | 'APPROACHING' 
  | 'AT_STATION' 
  | 'DEPARTED' 
  | 'COMPLETED' 
  | 'NOT_STARTED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  location: Coordinates;
  elevationMeters?: number;
}

export interface TrainStop {
  station: Station;
  sequence: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival?: string;
  actualDeparture?: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  delayMinutes: number;
  platform?: string;
  status: 'PASSED' | 'CURRENT' | 'UPCOMING';
  distanceFromOriginKm: number;
}

export interface Train {
  id: string;
  trainNumber: string;
  name: string;
  origin: Station;
  destination: Station;
  activeDays: string[];
  totalDistanceKm: number;
  type: 'RAJDHANI' | 'SHATABDI' | 'VANDE_BHARAT' | 'EXPRESS';
}

export interface LiveTrainStatus {
  trainNumber: string;
  position: Coordinates;
  speedKmh: number;
  heading: number; // in degrees
  currentStation?: Station;
  nextStation: Station;
  previousStation?: Station;
  delayMinutes: number;
  etaNextStation: string;
  destinationEta: string;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  progressPercent: number;
  status: RunningStatus;
  lastUpdatedAt: string;
  providerTimestamp: string;
  dataQuality: DataQuality;
}

export interface StationWeather {
  stationCode: string;
  stationName: string;
  tempC: number;
  condition: string;
  humidityPercent: number;
  windKph: number;
  rainChancePercent: number;
  icon: string;
}

export interface GeoFeature {
  id: string;
  name: string;
  category: 'river' | 'bridge' | 'mountain' | 'tunnel' | 'monument' | 'scenic';
  description: string;
  distanceFromRouteKm: number;
  location: Coordinates;
}

export interface TrainJourneyData {
  train: Train;
  serviceDate: string;
  routeGeoJson: GeoJSON.Feature<GeoJSON.LineString>;
  stops: TrainStop[];
  liveStatus: LiveTrainStatus;
  elevationProfile: { distanceKm: number; elevationM: number; stationName?: string }[];
  weather: StationWeather[];
  nearbyFeatures: GeoFeature[];
}

export interface TrainSearchResult {
  trainNumber: string;
  name: string;
  origin: string;
  destination: string;
  originCode: string;
  destCode: string;
  duration: string;
  activeDays: string[];
}
