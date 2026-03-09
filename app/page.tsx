"use client";

import { useState } from 'react';
import Map from '@/components/Map';
import SearchBox from '@/components/SearchBox';
import RouteDetails from '@/components/RouteDetails';
import { Trip } from '@/types/transit';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Train } from 'lucide-react';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleSearch = async (from: string, to: string) => {
    setLoading(true);
    setSelectedTrip(null); // Reset selectie bij nieuwe zoekopdracht
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

  // Haal de eerste polyline uit de geselecteerde reis zodat we die op de kaart kunnen tekenen
  // Opmerking: Voor een complete route kun je later alle polylines van alle legs combineren
  const activePolyline = selectedTrip?.legs.find(leg => leg.polyline)?.polyline;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950">
      {/* De Kaart - Fullscreen */}
      <div className="absolute inset-0 z-0">
        <Map encodedPolyline={activePolyline} />
      </div>

      {/* Interface Overlays */}
      <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">

        {/* Zoekbalk (Verdwijnt of schuift als er een trip is geselecteerd) */}
        <AnimatePresence>
          {!selectedTrip && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pointer-events-auto flex justify-center"
            >
              <SearchBox onSearch={handleSearch} isLoading={loading} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Onderkant: Resultaten OF Route Details */}
        <div className="mt-auto pointer-events-auto flex justify-center pb-4">
          <AnimatePresence mode="wait">
            {selectedTrip ? (
              /* Toon het Detail Paneel */
              <RouteDetails
                key="details"
                trip={selectedTrip}
                onClose={() => setSelectedTrip(null)}
              />
            ) : (
              /* Toon de Resultaten Lijst (Carrousel) */
              trips.length > 0 && (
                <motion.div
                  key="list"
                  className="overflow-x-auto flex gap-4 w-full max-w-5xl px-4 py-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {trips.map((trip, index) => (
                    <motion.div
                      key={trip.uid || index}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedTrip(trip)}
                      className="glass-panel min-w-[280px] p-4 rounded-2xl cursor-pointer hover:border-sky-400 transition-colors shrink-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-white">
                          {new Date(trip.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-xl font-bold text-white">
                          {new Date(trip.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
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
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}