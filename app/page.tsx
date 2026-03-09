"use client";

import { useState } from 'react';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import RouteDetails from '@/components/RouteDetails';
import { Trip } from '@/types/transit';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User } from 'lucide-react';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleSearch = async (from: string, to: string, date: string, time: string) => {
    setLoading(true);
    setSelectedTrip(null);
    try {
      const res = await fetch(`/api/plan?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
      const data = await res.json();
      setTrips(data || []);
    } catch (err) {
      console.error("Fout bij laden reizen", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121f3f] flex justify-center font-sans pb-20 px-5 sm:px-8 py-8">
      <div className="w-full max-w-xl flex flex-col relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-[#80f4fc] tracking-tight">
            Reisplanner
          </h1>
          <Link
            href="/profile"
            className="w-12 h-12 bg-[#264f6b] rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform text-[#80f4fc]"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>

        {/* Zoekbox */}
        <div className="mb-10">
          <SearchBox onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {selectedTrip ? (
            <RouteDetails
              key="details"
              trip={selectedTrip}
              onClose={() => setSelectedTrip(null)}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {trips.length > 0 && trips.map((trip, index) => {
                const mainLeg = trip.legs.find(l => l.mode !== 'WALK') || trip.legs[0];

                return (
                  <motion.div
                    key={trip.uid || index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedTrip(trip)}
                    className="bg-[#80f4fc] p-5 cursor-pointer rounded-[2rem] shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1c0101]/20">
                      <span className="px-3 py-1 bg-[#1c0101] text-[#80f4fc] rounded-lg text-xs font-bold uppercase tracking-wider">
                        {mainLeg?.category || (mainLeg?.mode === 'TRAIN' ? 'Trein' : mainLeg?.mode) || 'Reis'}
                      </span>
                      {mainLeg?.departureTrack && (
                        <div className="text-sm font-black text-[#1c0101]">
                          Spoor {mainLeg.departureTrack}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#1c0101]">
                          {new Date(trip.departureTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div className="flex-1 mx-4">
                        <div className="h-[3px] bg-[#1c0101]/30 rounded-full relative">
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#1c0101]"></div>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#1c0101]">
                          {new Date(trip.arrivalTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#121f3f]/10 p-3 rounded-2xl text-[#1c0101]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold">{trip.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <span>{trip.transfers === 0 ? 'Direct' : `${trip.transfers}x overstap`}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}