export interface Station {
  name: string;
  code: string;
  lat: number;
  lng: number;
}

export interface Leg {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  mode: string;
  direction: string;
  stops: any[];
}

export interface Trip {
  uid: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  transfers: number;
  legs: Leg[];
}