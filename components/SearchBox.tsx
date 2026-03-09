"use client";

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, ArrowRightLeft, Loader2, Navigation } from 'lucide-react';
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
    if (!from || !to) return;
    onSearch(from, to);
  };

  return (
    <div className="relative w-full">
      {/* Connection line */}
      <div className="absolute left-6 top-[3.5rem] bottom-[3.5rem] w-[2px] bg-gradient-to-b from-[var(--azure-mid-700)] to-[var(--amazon-mid-700)] rounded-full z-0" />

      <div className="relative z-10 space-y-3">
        {/* From Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--azure-mid-700)] flex items-center justify-center shadow-md z-10">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <input
            value={from}
            onChange={(e) => handleInput(e.target.value, 'from')}
            onFocus={() => { setActiveField('from'); setPredictions([]); }}
            type="text"
            placeholder="Vertrekstation..."
            className="w-full bg-white border-2 border-[var(--iceland-mid-300)] text-[var(--iceland-dark-1000)] placeholder-[var(--iceland-dark-1000)]/40 p-4 pl-16 pr-4 rounded-2xl focus:ring-2 focus:ring-[var(--azure-mid-700)] focus:border-[var(--azure-mid-700)] outline-none transition-all shadow-sm font-medium"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center relative z-20">
          <button
            onClick={handleSwap}
            className="w-10 h-10 bg-gradient-to-br from-[var(--cherry-mid-700)] to-[var(--cherry-bright)] hover:from-[var(--cherry-dark-1000)] hover:to-[var(--cherry-mid-700)] rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 hover:scale-110"
          >
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* To Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--amazon-mid-700)] flex items-center justify-center shadow-md z-10">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <input
            value={to}
            onChange={(e) => handleInput(e.target.value, 'to')}
            onFocus={() => { setActiveField('to'); setPredictions([]); }}
            type="text"
            placeholder="Bestemmingsstation..."
            className="w-full bg-white border-2 border-[var(--iceland-mid-300)] text-[var(--iceland-dark-1000)] placeholder-[var(--iceland-dark-1000)]/40 p-4 pl-16 pr-4 rounded-2xl focus:ring-2 focus:ring-[var(--amazon-mid-700)] focus:border-[var(--amazon-mid-700)] outline-none transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {predictions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-[var(--iceland-mid-300)] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
          {predictions.map((p) => (
            <div
              key={p.place_id}
              onClick={() => handleSelectPrediction(p)}
              className="p-4 hover:bg-[var(--iceland-mid-200)] cursor-pointer flex items-start gap-3 border-b border-[var(--iceland-mid-200)] last:border-0 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--azure-light-100)] flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="w-4 h-4 text-[var(--azure-mid-700)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[var(--iceland-dark-1000)] font-semibold truncate">
                  {p.structured_formatting.main_text}
                </div>
                <div className="text-sm text-[var(--iceland-dark-1000)] opacity-60 truncate">
                  {p.structured_formatting.secondary_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !from || !to}
        className="mt-4 w-full bg-gradient-to-r from-[var(--cherry-dark-1000)] to-[var(--cherry-mid-700)] hover:from-[var(--cherry-mid-700)] hover:to-[var(--cherry-dark-1000)] disabled:from-[var(--iceland-mid-300)] disabled:to-[var(--iceland-mid-300)] disabled:text-[var(--iceland-dark-1000)]/40 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl disabled:shadow-none hover:shadow-2xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Route berekenen...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Zoek je reis</span>
          </>
        )}
      </button>
    </div>
  );
}