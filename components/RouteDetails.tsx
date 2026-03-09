"use client";

import { motion } from 'framer-motion';
import { Trip } from '@/types/transit';
import { ChevronLeft, MapPin, Clock, Train, Bus, ArrowRight } from 'lucide-react';

interface RouteDetailsProps {
  trip: Trip;
  onClose: () => void;
}

export default function RouteDetails({ trip, onClose }: RouteDetailsProps) {
  // BUGFIX: We voegen een fallback toe voor als de NS API geen vervoerstype doorgeeft
  const getIcon = (mode?: string) => {
    const safeMode = (mode || 'UNKNOWN').toUpperCase();
    switch (safeMode) {
      case 'TRAIN': return <Train className="w-5 h-5 text-sky-400" />;
      case 'BUS': return <Bus className="w-5 h-5 text-red-400" />;
      case 'WALK': return <MapPin className="w-5 h-5 text-green-400" />;
      default: return <ArrowRight className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Header met Terug knop */}
      <div className="flex items-center gap-4 border-b border-slate-700/50 pb-4">
        <button
          onClick={onClose}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center border border-slate-600 shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white leading-tight">
            Jouw Reis
          </h2>
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {trip.duration} minuten reistijd
          </div>
        </div>
      </div>

      {/* Tijdlijn van de route */}
      <div className="flex flex-col gap-4 relative pb-6">
        {/* De doorlopende verbindingslijn */}
        <div className="absolute left-[1.15rem] top-4 bottom-4 w-0.5 bg-slate-700 z-0" />

        {trip.legs.map((leg, index) => (
          <div key={index} className="relative z-10 flex gap-4">
            <div className="flex flex-col items-center mt-1">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
                {getIcon(leg.mode)}
              </div>
            </div>

            <div className="flex-1 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sky-100">{leg.origin}</span>
                <span className="font-mono text-sky-400 font-semibold bg-sky-950/50 px-2 py-0.5 rounded-md">
                  {leg.departureTime ? new Date(leg.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                </span>
              </div>

              {(leg.direction || leg.destination) && (
                <div className="text-sm text-slate-400 mb-3 flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg w-max border border-slate-700/30">
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  Richting <span className="font-medium text-slate-300">{leg.direction || leg.destination}</span>
                </div>
              )}

              <div className="flex justify-between items-end pt-2 border-t border-slate-700/50 mt-1">
                <span className="font-bold text-slate-300">{leg.destination}</span>
                <span className="font-mono text-slate-400">
                  {leg.arrivalTime ? new Date(leg.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}