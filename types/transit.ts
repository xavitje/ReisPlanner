export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface TransitStep {
  type: 'WALK' | 'BUS' | 'TRAIN' | 'METRO' | 'TRAM';
  instruction: string;
  duration: number; // in minuten
  polyline: string; // Voor Google Maps weergave
}

export interface TravelAdvice {
  id: string;
  departureTime: string;
  arrivalTime: string;
  totalDuration: number;
  steps: TransitStep[];
  price?: number;
}