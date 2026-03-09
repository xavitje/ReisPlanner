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
        <div className="absolute left-6 top-[3rem] bottom-[3rem] w-[2px] bg-[#264F6B] rounded-full z-0" />

        {/* From Input */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#264F6B] flex items-center justify-center shadow-md flex-shrink-0">
            <Navigation className="w-5 h-5 text-[#B0E2F5]" />
          </div>
          <input
            value={from}
            onChange={(e) => handleInput(e.target.value, 'from')}
            onFocus={() => { setActiveField('from'); setPredictions([]); }}
            type="text"
            placeholder="Vertrekstation..."
            className="flex-1 bg-[#264F6B]/30 border border-[#264F6B] text-white placeholder-[#B0E2F5]/50 p-4 px-5 rounded-2xl focus:ring-2 focus:ring-[#80F4FC] focus:border-[#80F4FC] outline-none transition-all font-medium"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center relative z-20">
          <button
            onClick={handleSwap}
            className="w-10 h-10 bg-[#121F3F] border border-[#264F6B] hover:border-[#80F4FC] rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#80F4FC]" />
          </button>
        </div>

        {/* To Input */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#264F6B] flex items-center justify-center shadow-md flex-shrink-0">
            <MapPin className="w-5 h-5 text-[#B0E2F5]" />
          </div>
          <input
            value={to}
            onChange={(e) => handleInput(e.target.value, 'to')}
            onFocus={() => { setActiveField('to'); setPredictions([]); }}
            type="text"
            placeholder="Bestemmingsstation..."
            className="flex-1 bg-[#264F6B]/30 border border-[#264F6B] text-white placeholder-[#B0E2F5]/50 p-4 px-5 rounded-2xl focus:ring-2 focus:ring-[#80F4FC] focus:border-[#80F4FC] outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Tijd & Datum Sectie */}
      <div className="flex gap-3 pt-2">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#B0E2F5]" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#264F6B]/30 border border-[#264F6B] text-white p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#80F4FC] outline-none transition-all font-medium"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#B0E2F5]" />
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-[#264F6B]/30 border border-[#264F6B] text-white p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#80F4FC] outline-none transition-all font-medium"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {predictions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-[#121F3F] border border-[#264F6B] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
          {predictions.map((p) => (
            <div
              key={p.place_id}
              onClick={() => handleSelectPrediction(p)}
              className="p-4 hover:bg-[#264F6B] cursor-pointer flex items-start gap-3 border-b border-[#264F6B] last:border-0 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {p.structured_formatting.main_text}
                </div>
                <div className="text-sm text-[#B0E2F5] truncate">
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
        className="mt-4 w-full bg-[#80F4FC] hover:bg-[#B0E2F5] disabled:bg-[#264F6B] disabled:text-[#B0E2F5]/50 text-[#121F3F] font-extrabold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Zoeken...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Plan Mijn Reis</span>
          </>
        )}
      </button>
    </div>
  );
}