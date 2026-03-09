"use client";

import { motion } from 'framer-motion';
import { Trip } from '@/types/transit';
import { X, MapPin, Clock, Train, Bus, ArrowRight } from 'lucide-react';

interface RouteDetailsProps {
  trip: Trip;
  onClose: () => void;
}

export default function RouteDetails({ trip, onClose }: RouteDetailsProps) {
  // Simpele functie om het juiste icoon bij het vervoerstype te zoeken
  const getIcon = (mode: string) => {
    switch (mode.toUpperCase()) {
      case 'TRAIN': return <Train className="w-5 h-5 text-sky-400" />;
      case 'BUS': return <Bus className="w-5 h-5 text-red-400" />;
      case 'WALK': return <MapPin className="w-5 h-5 text-green-400" />;
      default: return <ArrowRight className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="glass-panel w-full max-w-md p-6 rounded-t-3xl shadow-2xl flex flex-col gap-6 max-h-[80vh] overflow-y-auto"
    >
      {/* Header met sluitknop */}
      <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Reisdetails
          </h2>
          <div className="text-slate-400 text-sm flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            {trip.duration} minuten reistijd
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* De losse stappen (Legs) van de reis */}
      <div className="flex flex-col gap-4 relative">
        {/* Lijn aan de linkerkant om de route visueel te verbinden */}
        <div className="absolute left-[1.15rem] top-4 bottom-4 w-0.5 bg-slate-700 z-0" />

        {trip.legs.map((leg, index) => (
          <div key={index} className="relative z-10 flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0 shadow-lg">
                {getIcon(leg.mode)}
              </div>
            </div>

            <div className="flex-1 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sky-100">{leg.origin}</span>
                <span className="font-mono text-sky-400">
                  {new Date(leg.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                Richting {leg.direction || leg.destination}
              </div>

              <div className="flex justify-between items-end mt-3 pt-3 border-t border-slate-700/50">
                <span className="font-bold text-slate-300">{leg.destination}</span>
                <span className="font-mono text-slate-400">
                  {new Date(leg.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}