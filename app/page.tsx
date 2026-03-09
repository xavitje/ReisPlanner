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
    setSelectedTrip(null);
    try {
      const res = await fetch(`/api/plan?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await res.json();
      setTrips(data || []);
    } catch (err) {
      console.error("Fout bij laden reizen", err);
    } finally {
      setLoading(false);
    }
  };

  const activePolyline = selectedTrip?.legs.find(leg => leg.polyline)?.polyline;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950 flex">

      {/* De Kaart - Neemt de hele achtergrond in */}
      <div className="absolute inset-0 z-0">
        <Map encodedPolyline={activePolyline} />
      </div>

      {/* Links Zijpaneel (Sidebar) - Modern & Strak */}
      <div className="relative z-10 w-full md:w-[420px] h-full flex flex-col bg-slate-900/85 backdrop-blur-2xl border-r border-slate-700/50 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">

        {/* Zoekbalk (Blijft altijd bovenaan staan) */}
        <div className="p-6 shrink-0 border-b border-slate-700/50 bg-slate-900/50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-6">
            Reisplanner.
          </h1>
          <SearchBox onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Dynamische Inhoud (Resultaten OF Details) */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
          <AnimatePresence mode="wait">

            {/* SCENARIO 1: Een specifieke reis is geselecteerd */}
            {selectedTrip ? (
              <RouteDetails
                key="details"
                trip={selectedTrip}
                onClose={() => setSelectedTrip(null)}
              />
            ) : (

              /* SCENARIO 2: De verticale, scrollbare resultatenlijst */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {trips.length > 0 ? (
                  trips.map((trip, index) => (
                    <motion.div
                      key={trip.uid || index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedTrip(trip)}
                      className="bg-slate-800/60 border border-slate-700 hover:border-sky-500/50 p-5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all shadow-lg group"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-black text-white group-hover:text-sky-400 transition-colors">
                          {new Date(trip.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <div className="flex-1 border-t-2 border-dashed border-slate-600 mx-4 relative">
                          <ArrowRight className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 text-slate-500 bg-slate-800/60 px-1" />
                        </div>
                        <span className="text-2xl font-black text-white">
                          {new Date(trip.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-sky-500" />
                          <span className="font-medium">{trip.duration} min. reistijd</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md">
                          <Train className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">{trip.transfers} overstappen</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  !loading && (
                    <div className="text-center text-slate-500 mt-10">
                      <p>Vul een vertrekpunt en bestemming in om reizen te zoeken.</p>
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}