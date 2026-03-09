export interface Station {
  name: string;
  code: string;
  lat: number;
  lng: number;
}

export interface TrainInfo {
  model?: string;
  length?: number;
  doubleDecker?: boolean;
}

export interface Leg {
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  mode: string;
  direction?: string;
  stops?: any[];
  polyline?: string;
  category?: string;
  departureTrack?: string;
  arrivalTrack?: string;
  trainInfo?: TrainInfo;
}

export interface Trip {
  uid: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  transfers: number;
  legs: Leg[];
}

export interface JourneyStop {
  name: string;
  time: string;
  track?: string;
  status: 'ORIGIN' | 'STOP' | 'DESTINATION' | 'PASSING';
}

export interface JourneyDetails {
  trainNumber: string;
  category: string;
  direction: string;
  operator: string;
  facilities: string[];
  stops: JourneyStop[];
}