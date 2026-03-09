"use client";

import { useEffect, useRef, useMemo } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

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
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#F9F6F0" }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#1D1C1A" }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#FBFAF6" }, { "weight": 3 }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#530E2F" }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#F9F6F0" }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#F2ECE1" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#C8F2E0" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#FBFAF6" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#F2ECE1" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#FFD7D4" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#86233A" }]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#B0E2F5" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#80F4FC" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#121F3F" }]
      }
    ]
  }), [center, zoom]);

  useEffect(() => {
    const initMap = async () => {
      try {
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
          v: "weekly",
          libraries: ["places"]
        });

        const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;

        if (mapRef.current && !googleMap.current) {
          googleMap.current = new Map(mapRef.current, mapOptions);
        }
      } catch (error) {
        console.error("Fout bij laden van Google Maps", error);
      }
    };

    initMap();
  }, [mapOptions]);

  useEffect(() => {
    if (encodedPolyline && googleMap.current) {
      if (routePath.current) routePath.current.setMap(null);

      const path = google.maps.geometry.encoding.decodePath(encodedPolyline);
      routePath.current = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#86233A",
        strokeOpacity: 0.9,
        strokeWeight: 6,
      });

      routePath.current.setMap(googleMap.current);

      const bounds = new google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      googleMap.current.fitBounds(bounds);
    }
  }, [encodedPolyline]);

  return <div ref={mapRef} className="w-full h-full rounded-3xl overflow-hidden shadow-2xl" />;
}