"use client";

import { useState } from 'react';
import Map from '@/components/Map';
import SearchBox from '@/components/SearchBox';
import { Trip } from '@/types/transit';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Train } from 'lucide-react';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleSearch = async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/plan?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error("Fout bij laden reizen", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950">
      {/* De Kaart - Fullscreen */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      {/* Interface Overlays */}
      <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBox onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Resultaten Lijst */}
        <div className="mt-auto pointer-events-auto overflow-x-auto pb-4 flex gap-4">
          <AnimatePresence>
            {trips.map((trip, index) => (
              <motion.div
                key={trip.uid || index}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedTrip(trip)}
                className="glass-panel min-w-[280px] p-4 rounded-2xl cursor-pointer hover:border-sky-400 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold">{new Date(trip.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-xl font-bold">{new Date(trip.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{trip.duration} min.</span>
                  <div className="ml-auto flex items-center gap-1 bg-sky-500/20 text-sky-400 px-2 py-1 rounded-lg">
                    <Train className="w-3 h-3" />
                    <span className="text-xs font-bold">{trip.transfers}x overstap</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}