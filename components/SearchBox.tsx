"use client";

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { importLibrary } from '@googlemaps/js-api-loader';

interface SearchBoxProps {
  onSearch: (from: string, to: string) => void;
  isLoading: boolean;
}

export default function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        // We wachten actief tot de 'places' library is ingeladen door Google
        await importLibrary("places");

        const options = { componentRestrictions: { country: "nl" }, fields: ["name"] };

        if (fromRef.current) {
          new google.maps.places.Autocomplete(fromRef.current, options).addListener("place_changed", () => {
            setFrom(fromRef.current!.value);
          });
        }

        if (toRef.current) {
          new google.maps.places.Autocomplete(toRef.current, options).addListener("place_changed", () => {
            setTo(toRef.current!.value);
          });
        }
      } catch (err) {
        console.error("Kon autocomplete niet laden", err);
      }
    };

    initAutocomplete();
  }, []);

  return (
    <div className="glass-panel p-6 rounded-3xl w-full max-w-md flex flex-col gap-4 shadow-2xl">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 text-sky-400 w-5 h-5" />
        <input
          ref={fromRef}
          type="text"
          placeholder="Vertrekpunt (Station)"
          className="w-full bg-slate-800/50 border border-slate-700 p-2 pl-10 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-white"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 text-sky-400 w-5 h-5" />
        <input
          ref={toRef}
          type="text"
          placeholder="Bestemming (Station)"
          className="w-full bg-slate-800/50 border border-slate-700 p-2 pl-10 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-white"
        />
      </div>
      <button
        onClick={() => onSearch(fromRef.current!.value, toRef.current!.value)}
        disabled={isLoading}
        className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {isLoading ? "Plannen..." : "Plan mijn reis"}
      </button>
    </div>
  );
}