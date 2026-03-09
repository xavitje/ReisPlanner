"use client";

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, ArrowRightLeft, Loader2, Navigation, Calendar, Clock } from 'lucide-react';
import { importLibrary } from '@googlemaps/js-api-loader';

interface SearchBoxProps {
  onSearch: (from: string, to: string, date: string, time: string) => void;
  isLoading: boolean;
}

export default function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Standaard datum en tijd instellen op 'nu'
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));

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
    onSearch(from, to, date, time);
  };

  return (
    <div className="relative w-full space-y-4">
      {/* Locaties Sectie */}
      <div className="relative space-y-3">
        {/* Connection line */}
        <div className="absolute left-5 top-[3rem] bottom-[3rem] w-[2px] bg-gradient-to-b from-blue-500 to-green-500 rounded-full z-0" />

        {/* From Input */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <input
            value={from}
            onChange={(e) => handleInput(e.target.value, 'from')}
            onFocus={() => { setActiveField('from'); setPredictions([]); }}
            type="text"
            placeholder="Vertrekstation..."
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 p-4 px-5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center relative z-20">
          <button
            onClick={handleSwap}
            className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 hover:scale-110 border-2 border-white"
          >
            <ArrowRightLeft className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* To Input */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shadow-md flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <input
            value={to}
            onChange={(e) => handleInput(e.target.value, 'to')}
            onFocus={() => { setActiveField('to'); setPredictions([]); }}
            type="text"
            placeholder="Bestemmingsstation..."
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 p-4 px-5 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Tijd & Datum Sectie */}
      <div className="flex gap-3 pt-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-gray-600" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 text-gray-900 p-3 pl-14 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
          />
        </div>

        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 text-gray-900 p-3 pl-14 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {predictions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-blue-500 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
          {predictions.map((p) => (
            <div
              key={p.place_id}
              onClick={() => handleSelectPrediction(p)}
              className="p-4 hover:bg-blue-50 cursor-pointer flex items-start gap-3 border-b border-gray-100 last:border-0 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 font-semibold truncate">
                  {p.structured_formatting.main_text}
                </div>
                <div className="text-sm text-gray-500 truncate">
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
        className="mt-2 w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg disabled:shadow-none hover:shadow-xl"
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