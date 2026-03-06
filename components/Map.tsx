"use client";

import { useEffect, useRef, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  encodedPolyline?: string;
}

export default function Map({ center = { lat: 52.3676, lng: 4.9041 }, zoom = 12, encodedPolyline }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const routePath = useRef<google.maps.Polyline | null>(null);

  const mapOptions = useMemo(() => ({
    center,
    zoom,
    disableDefaultUI: true,
    clickableIcons: false,
    styles: [
      { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
      { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
      { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
      { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
    ]
  }), [center, zoom]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      if (mapRef.current && !googleMap.current) {
        googleMap.current = new google.maps.Map(mapRef.current, mapOptions);
      }
    });
  }, [mapOptions]);

  // Teken de route als de polyline verandert
  useEffect(() => {
    if (encodedPolyline && googleMap.current) {
      if (routePath.current) routePath.current.setMap(null);

      const path = google.maps.geometry.encoding.decodePath(encodedPolyline);
      routePath.current = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#38BDF8",
        strokeOpacity: 0.8,
        strokeWeight: 5,
      });

      routePath.current.setMap(googleMap.current);

      const bounds = new google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      googleMap.current.fitBounds(bounds);
    }
  }, [encodedPolyline]);

  return <div ref={mapRef} className="w-full h-full rounded-3xl" />;
}