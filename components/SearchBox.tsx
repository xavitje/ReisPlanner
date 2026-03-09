"use client";

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, ArrowDownUp, AlertCircle, Loader2 } from 'lucide-react';
import { importLibrary } from '@googlemaps/js-api-loader';

interface SearchBoxProps {
  onSearch: (from: string, to: string) => void;
  isLoading: boolean;
}

export default function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await importLibrary("places");
        autocompleteService.current = new google.maps.places.AutocompleteService();
      } catch (err) {
        console.error("Kon Google Places niet laden", err);
      }
    };
    initAutocomplete();
  }, []);

  // Zoek locaties as the user types
  const handleInput = (val: string, field: 'from' | 'to') => {
    if (field === 'from') setFrom(val);
    if (field === 'to') setTo(val);
    setActiveField(field);

    if (val.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions({
        input: val,
        componentRestrictions: { country: 'nl' },
        types: ['transit_station']
      }, (results) => {
        setPredictions(results || []);
      });
    } else {
      setPredictions([]);
    }
  };

  const handleSelectPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    const shortName = prediction.structured_formatting.main_text;

    if (activeField === 'from') setFrom(shortName);
    if (activeField === 'to') setTo(shortName);

    setPredictions([]);
    setActiveField(null);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = () => {
    if (!from || !to) return; // Voorkomt de 400 error!
    onSearch(from, to);
  };

  return (
    <div className="w-full relative flex flex-col">

      {/* De visuele stippellijn tussen de inputs */}
      <div className="absolute left-[2.15rem] top-12 bottom-24 w-0.5 border-l-2 border-dotted border-slate-600 z-0" />

      <div className="flex flex-col gap-3 relative z-10">

        {/* Vertrekpunt */}
        <div className="relative group">
          <div className="absolute left-3 top-3.5 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border-2 border-sky-400 z-10">
            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
          </div>
          <input
            value={from}
            onChange={(e) => handleInput(e.target.value, 'from')}
            onFocus={() => { setActiveField('from'); setPredictions([]); }}
            type="text"
            placeholder="Kies vertrekstation..."
            className="w-full bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-400 p-3 pl-12 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Swap Button */}
        <div className="absolute right-4 top-[3.25rem] z-20">
          <button
            onClick={handleSwap}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full border border-slate-600 shadow-lg transition-transform active:scale-90"
          >
            <ArrowDownUp className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* Bestemming */}
        <div className="relative group">
          <MapPin className="absolute left-3 top-3.5 text-red-500 w-5 h-5 z-10 bg-slate-900 rounded-full" />
          <input
            value={to}
            onChange={(e) => handleInput(e.target.value, 'to')}
            onFocus={() => { setActiveField('to'); setPredictions([]); }}
            type="text"
            placeholder="Kies bestemming..."
            className="w-full bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-400 p-3 pl-12 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {predictions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 mx-5 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {predictions.map((p) => (
            <div
              key={p.place_id}
              onClick={() => handleSelectPrediction(p)}
              className="p-3 hover:bg-slate-700 cursor-pointer flex flex-col border-b border-slate-700/50 last:border-0 transition-colors"
            >
              <span className="text-white font-medium">{p.structured_formatting.main_text}</span>
              <span className="text-slate-400 text-sm">{p.structured_formatting.secondary_text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zoekknop */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !from || !to}
        className="mt-5 w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        {isLoading ? "Route berekenen..." : "Vind de snelste route"}
      </button>

    </div>
  );
}