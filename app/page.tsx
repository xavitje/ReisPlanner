"use client";

import { useState } from 'react';
import Map from '@/components/Map';
import SearchBox from '@/components/SearchBox';
import RouteDetails from '@/components/RouteDetails';
import { Trip } from '@/types/transit';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Train } from 'lucide-react';

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
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--iceland-light-100)]">

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--cherry-light-100)] rounded-full blur-[150px] opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--azure-light-100)] rounded-full blur-[150px] opacity-20 -z-10" />

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Search & Results - Max 2/3 width */}
        <div className="w-[66%] h-full flex flex-col bg-white border-r border-[var(--iceland-mid-300)] shadow-2xl">

          {/* Desktop Header - Nu met donkere achtergrond en lichte tekst voor perfecte leesbaarheid */}
          <div className="flex justify-center p-8 pb-6 bg-gradient-to-br from-[var(--cherry-dark-1000)] to-[var(--cherry-mid-700)] shadow-md z-10">
            <div className="w-[80%] max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Train className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Reisplanner
                  </h1>
                  <p className="text-sm text-white/80 font-medium">
                    Plan je perfecte reis
                  </p>
                </div>
              </div>
              <SearchBox onSearch={handleSearch} isLoading={loading} />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[var(--iceland-mid-200)] to-[var(--iceland-light-100)] custom-scrollbar flex justify-center">
            <div className="w-[80%] max-w-2xl">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {trips.length > 0 ? (
                      trips.map((trip, index) => {
                        const mainLeg = trip.legs.find(l => l.mode !== 'WALK') || trip.legs[0];

                        return (
                          <motion.div
                            key={trip.uid || index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedTrip(trip)}
                            className="route-card bg-white p-6 cursor-pointer border border-[var(--iceland-mid-300)] hover:shadow-xl rounded-2xl"
                          >
                            {/* Categorie & Spoor Info */}
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--iceland-mid-200)]">
                              <span className="px-3 py-1 bg-[var(--azure-light-100)] text-[var(--azure-dark-1000)] rounded-full text-xs font-bold uppercase tracking-wider">
                                {mainLeg?.category || (mainLeg?.mode === 'TRAIN' ? 'Trein' : mainLeg?.mode) || 'Reis'}
                              </span>
                              {mainLeg?.departureTrack && (
                                <div className="text-sm font-bold text-[var(--iceland-dark-1000)]">
                                  Spoor {mainLeg.departureTrack}
                                </div>
                              )}
                            </div>

                            {/* Time Display */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-[var(--cherry-dark-1000)]">
                                  {new Date(trip.departureTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="text-sm text-[var(--iceland-dark-1000)] opacity-50">vertrek</span>
                              </div>

                              <div className="flex-1 mx-4 relative">
                                <div className="h-[2px] bg-gradient-to-r from-[var(--azure-mid-700)] to-[var(--amazon-mid-700)] rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[var(--azure-mid-700)] flex items-center justify-center shadow-md">
                                    <Train className="w-4 h-4 text-[var(--azure-mid-700)]" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-[var(--amazon-dark-1000)]">
                                  {new Date(trip.arrivalTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="text-sm text-[var(--iceland-dark-1000)] opacity-50">aankomst</span>
                              </div>
                            </div>

                            {/* Trip Info */}
                            <div className="flex items-center justify-between bg-[var(--iceland-light-100)] p-4 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                  <Clock className="w-5 h-5 text-[var(--azure-mid-700)]" />
                                </div>
                                <div>
                                  <div className="text-sm text-[var(--iceland-dark-1000)] opacity-60">Reistijd</div>
                                  <div className="font-bold text-[var(--iceland-dark-1000)]">{trip.duration} min</div>
                                </div>
                              </div>

                              <div className="h-10 w-[1px] bg-[var(--iceland-mid-300)]"></div>

                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--cherry-mid-700)] to-[var(--cherry-bright)] flex items-center justify-center shadow-sm">
                                  <span className="text-white font-bold text-sm">{trip.transfers}</span>
                                </div>
                                <div>
                                  <div className="text-sm text-[var(--iceland-dark-1000)] opacity-60">Overstappen</div>
                                  <div className="font-bold text-[var(--iceland-dark-1000)]">
                                    {trip.transfers === 0 ? 'Direct' : `${trip.transfers}x`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      !loading && (
                        <div className="text-center py-20">
                          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-10 h-10 text-[var(--cherry-mid-700)]" />
                          </div>
                          <p className="text-[var(--iceland-dark-1000)] opacity-60">
                            Vul een vertrekpunt en bestemming in om reizen te zoeken
                          </p>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 relative p-6">
          <div className="h-full w-full rounded-3xl overflow-hidden shadow-inner">
            <Map encodedPolyline={activePolyline} />
          </div>

          {/* Map overlay info */}
          {!activePolyline && (
            <div className="absolute top-14 left-14 right-14 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-[var(--iceland-mid-300)]">
              <h2 className="text-2xl font-bold text-[var(--cherry-dark-1000)] mb-2">
                Welkom bij de Reisplanner
              </h2>
              <p className="text-[var(--iceland-dark-1000)] opacity-70">
                Zoek je reis en bekijk de route op de kaart
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="bg-gradient-to-br from-[var(--cherry-dark-1000)] to-[var(--cherry-mid-700)] shadow-2xl rounded-b-[40px] flex justify-center w-full z-10">
          <div className="w-[80%] p-6 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Train className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Reisplanner
                </h1>
                <p className="text-sm text-white/80 font-medium">
                  Plan je perfecte reis
                </p>
              </div>
            </div>
            <SearchBox onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[var(--iceland-mid-200)] to-[var(--iceland-light-100)] custom-scrollbar flex justify-center w-full">
          <div className="w-[80%] py-6">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 pb-6"
                >
                  {trips.length > 0 ? (
                    trips.map((trip, index) => {
                      const mainLeg = trip.legs.find(l => l.mode !== 'WALK') || trip.legs[0];

                      return (
                        <motion.div
                          key={trip.uid || index}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedTrip(trip)}
                          className="route-card bg-white p-5 cursor-pointer border border-[var(--iceland-mid-300)] shadow-lg rounded-2xl"
                        >
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--iceland-mid-200)]">
                            <span className="px-2 py-1 bg-[var(--azure-light-100)] text-[var(--azure-dark-1000)] rounded-md text-[10px] font-bold uppercase tracking-wider">
                              {mainLeg?.category || (mainLeg?.mode === 'TRAIN' ? 'Trein' : mainLeg?.mode) || 'Reis'}
                            </span>
                            {mainLeg?.departureTrack && (
                              <div className="text-xs font-bold text-[var(--iceland-dark-1000)]">
                                Spoor {mainLeg.departureTrack}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-[var(--cherry-dark-1000)]">
                                {new Date(trip.departureTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>

                            <div className="flex-1 mx-3">
                              <div className="h-[2px] bg-gradient-to-r from-[var(--azure-mid-700)] to-[var(--amazon-mid-700)] rounded-full"></div>
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-[var(--amazon-dark-1000)]">
                                {new Date(trip.arrivalTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-[var(--iceland-light-100)] p-3 rounded-2xl text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[var(--azure-mid-700)]" />
                              <span className="font-semibold text-[var(--iceland-dark-1000)]">{trip.duration} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[var(--cherry-mid-700)] flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{trip.transfers}</span>
                              </div>
                              <span className="font-semibold text-[var(--iceland-dark-1000)]">
                                {trip.transfers === 0 ? 'Direct' : `${trip.transfers}x`}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    !loading && (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-8 h-8 text-[var(--cherry-mid-700)]" />
                        </div>
                        <p className="text-[var(--iceland-dark-1000)] opacity-60">
                          Vul een vertrekpunt en bestemming in om reizen te zoeken
                        </p>
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}