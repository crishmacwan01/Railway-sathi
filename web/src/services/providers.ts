import { Coordinates, TrainSearchResult } from '../types/railway';

export interface TrainProvider {
  searchTrains(query: string): Promise<TrainSearchResult[]>;
  getJourney(trainNumber: string, date: string): Promise<any>;
  getLiveStatus(trainNumber: string, date: string): Promise<any>;
}

export interface WeatherProvider {
  getCurrent(location: Coordinates): Promise<any>;
}

export interface TerrainProvider {
  getElevation(points: Coordinates[]): Promise<{ elevation: number }[]>;
}

export interface GeoProvider {
  getNearbyFeatures(corridor: GeoJSON.Geometry, categories: string[]): Promise<any[]>;
}
