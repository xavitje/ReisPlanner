"use client";

import { motion } from 'framer-motion';
import { Trip } from '@/types/transit';
import { ChevronLeft, Clock, Train, Bus, MapPin, ArrowRight, Navigation, Info } from 'lucide-react';

interface RouteDetailsProps {
  trip: Trip;
  onClose: () => void;
}

export default function RouteDetails({ trip, onClose }: RouteDetailsProps) {
  const getIcon = (mode?: string) => {
    const safeMode = (mode || 'UNKNOWN').toUpperCase();
    switch (safeMode) {
      case 'TRAIN': return <Train className="w-5 h-5 text-white" />;
      case 'BUS': return <Bus className="w-5 h-5 text-white" />;
      case 'WALK': return <Navigation className="w-5 h-5 text-white" />;
      default: return <ArrowRight className="w-5 h-5 text-white" />;
    }
  };

  const getColor = (mode?: string) => {
    const safeMode = (mode || 'UNKNOWN').toUpperCase();
    switch (safeMode) {
      case 'TRAIN': return 'var(--azure-mid-700)';
      case 'BUS': return 'var(--cherry-mid-700)';
      case 'WALK': return 'var(--amazon-mid-700)';
      default: return 'var(--iceland-dark-1000)';
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      {/* Header - Aangepast naar donkere gradient met witte tekst voor een hoog contrast en perfecte leesbaarheid */}
      <div className="bg-gradient-to-br from-[var(--cherry-dark-1000)] to-[var(--cherry-mid-700)] p-6 rounded-3xl shadow-xl">
        <button
          onClick={onClose}
          className="mb-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          Jouw Reis
        </h2>

        <div className="flex items-center gap-3 text-white/90">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{trip.duration} minuten</span>
          </div>
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4" />
            <span className="font-semibold">
              {trip.transfers === 0 ? 'Directe reis' : `${trip.transfers} overstap${trip.transfers > 1 ? 'pen' : ''}`}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-5 pb-6">
        {/* Connecting line */}
        <div className="absolute left-[1.4rem] top-8 bottom-8 w-[3px] bg-gradient-to-b from-[var(--azure-light-100)] via-[var(--cherry-light-100)] to-[var(--amazon-light-100)] rounded-full z-0" />

        {trip.legs.map((leg, index) => (
          <div key={index} className="relative z-10">
            {/* Step */}
            <div className="flex gap-4">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 border-4 border-white"
                style={{ background: getColor(leg.mode) }}
              >
                {getIcon(leg.mode)}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white p-5 rounded-2xl border-2 border-[var(--iceland-mid-300)] hover:border-[var(--cherry-mid-700)] transition-all shadow-md hover:shadow-xl">
                {/* Origin */}
                <div className="mb-4 pb-4 border-b border-[var(--iceland-mid-200)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--iceland-dark-1000)] opacity-50 mb-1 uppercase tracking-wide font-semibold">
                        Vertrek
                      </div>
                      <div className="font-bold text-[var(--iceland-dark-1000)] text-lg truncate flex items-center gap-2 flex-wrap">
                        {leg.origin}
                        {leg.departureTrack && (
                          <span className="text-xs bg-[var(--azure-light-100)] text-[var(--azure-dark-1000)] px-2 py-1 rounded-md font-bold whitespace-nowrap">
                            Spoor {leg.departureTrack}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 bg-[var(--azure-light-100)] px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[var(--azure-mid-700)]" />
                        <span className="font-bold text-[var(--azure-dark-1000)] text-sm">
                          {leg.departureTime ? new Date(leg.departureTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direction/Route info met trein details */}
                <div className="mb-4 space-y-2">
                  {(leg.direction || leg.destination) && (
                    <div className="flex items-center gap-2 bg-[var(--iceland-light-100)] p-3 rounded-xl">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: getColor(leg.mode) }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-[var(--iceland-dark-1000)]">
                          {leg.category || (leg.mode === 'TRAIN' ? 'Trein' : leg.mode)}
                        </span>
                        <span className="text-[var(--iceland-dark-1000)] opacity-60"> richting </span>
                        <span className="font-bold text-[var(--iceland-dark-1000)]">
                          {leg.direction || leg.destination}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Trein details (Model, Lengte, Dubbeldekker) */}
                  {leg.trainInfo && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 pl-1">
                      <Info className="w-4 h-4 text-[var(--iceland-dark-1000)] opacity-50" />
                      {leg.trainInfo.model && (
                        <span className="text-xs font-semibold text-[var(--iceland-dark-1000)] bg-[var(--iceland-mid-200)] px-2 py-1 rounded">
                          {leg.trainInfo.model}
                        </span>
                      )}
                      {leg.trainInfo.length && (
                        <span className="text-xs font-semibold text-[var(--iceland-dark-1000)] bg-[var(--iceland-mid-200)] px-2 py-1 rounded">
                          {leg.trainInfo.length} delen
                        </span>
                      )}
                      {leg.trainInfo.doubleDecker && (
                        <span className="text-xs font-semibold text-[var(--iceland-dark-1000)] bg-[var(--iceland-mid-200)] px-2 py-1 rounded">
                          Dubbeldekker
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Destination */}
                <div className="pt-4 border-t border-[var(--iceland-mid-200)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--iceland-dark-1000)] opacity-50 mb-1 uppercase tracking-wide font-semibold">
                        Aankomst
                      </div>
                      <div className="font-bold text-[var(--iceland-dark-1000)] text-lg truncate flex items-center gap-2 flex-wrap">
                        {leg.destination}
                        {leg.arrivalTrack && (
                          <span className="text-xs bg-[var(--amazon-light-100)] text-[var(--amazon-dark-1000)] px-2 py-1 rounded-md font-bold whitespace-nowrap">
                            Spoor {leg.arrivalTrack}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 bg-[var(--amazon-light-100)] px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[var(--amazon-mid-700)]" />
                        <span className="font-bold text-[var(--amazon-dark-1000)] text-sm">
                          {leg.arrivalTime ? new Date(leg.arrivalTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer indicator */}
            {index < trip.legs.length - 1 && (
              <div className="flex items-center gap-3 ml-14 mt-3 mb-1">
                <div className="flex-1 h-[2px] bg-gradient-to-r from-[var(--cherry-light-100)] to-transparent rounded-full"></div>
                <div className="text-xs font-bold text-[var(--cherry-mid-700)] bg-[var(--cherry-light-100)] px-3 py-1 rounded-full">
                  Overstappen
                </div>
                <div className="flex-1 h-[2px] bg-gradient-to-l from-[var(--cherry-light-100)] to-transparent rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[var(--amazon-light-100)] to-[var(--azure-light-100)] p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[var(--iceland-dark-1000)] opacity-60 mb-1">
              Totale reistijd
            </div>
            <div className="text-3xl font-bold text-[var(--iceland-dark-1000)]">
              {trip.duration} min
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--iceland-dark-1000)] opacity-60 mb-1">
              Overstappen
            </div>
            <div className="text-3xl font-bold text-[var(--iceland-dark-1000)]">
              {trip.transfers}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}