"use client";

import { motion } from 'framer-motion';
import { Trip } from '@/types/transit';
import { ChevronLeft, Clock, Train, ArrowRight, ChevronRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RouteDetailsProps {
  trip: Trip;
  onClose: () => void;
}

export default function RouteDetails({ trip, onClose }: RouteDetailsProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="bg-[#80F4FC] rounded-[2rem] p-6 text-[#121F3F] shadow-2xl relative"
    >
      {/* Back & Summary Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#121F3F]/10 pb-6">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-[#121F3F] text-[#80F4FC] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-right">
          <div className="text-3xl font-black">{trip.duration} min</div>
          <div className="font-bold opacity-70">
            {trip.transfers === 0 ? 'Directe reis' : `${trip.transfers} overstappen`}
          </div>
        </div>
      </div>

      {/* Legs */}
      <div className="space-y-6">
        {trip.legs.map((leg, index) => (
          <div key={index} className="relative">
            {/* Station Vertrek */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">Vertrek</div>
                <div className="text-xl font-bold">{leg.origin}</div>
                {leg.departureTrack && (
                  <div className="inline-block mt-1 px-2 py-1 bg-[#121F3F] text-[#80F4FC] text-xs font-bold rounded-md">
                    Spoor {leg.departureTrack}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">
                  {leg.departureTime ? new Date(leg.departureTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                </div>
              </div>
            </div>

            {/* Trein Info Card (Card-in-Card design) */}
            <div
              onClick={() => {
                const dateTimeString = leg.departureTime || trip.departureTime;
                if(leg.trainInfo?.length) {
                  router.push(`/trein/${leg.trainInfo.length}?dateTime=${encodeURIComponent(dateTimeString)}`);
                }
              }}
              className="bg-[#264F6B] rounded-2xl p-4 my-6 text-white cursor-pointer hover:bg-[#121F3F] transition-colors group shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#80F4FC] text-[#121F3F] flex items-center justify-center">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#80F4FC]">
                      {leg.category || 'Trein'}
                    </div>
                    <div className="text-sm text-[#B0E2F5] flex items-center gap-1">
                      Richting {leg.direction || leg.destination}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#80F4FC] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Station Aankomst */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">Aankomst</div>
                <div className="text-xl font-bold">{leg.destination}</div>
                {leg.arrivalTrack && (
                  <div className="inline-block mt-1 px-2 py-1 bg-[#121F3F] text-[#80F4FC] text-xs font-bold rounded-md">
                    Spoor {leg.arrivalTrack}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">
                  {leg.arrivalTime ? new Date(leg.arrivalTime).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                </div>
              </div>
            </div>

            {/* Transfer indicator */}
            {index < trip.legs.length - 1 && (
              <div className="flex items-center gap-4 my-6 opacity-50">
                <div className="flex-1 h-px bg-[#121F3F]"></div>
                <div className="text-xs font-bold uppercase tracking-widest">Overstappen</div>
                <div className="flex-1 h-px bg-[#121F3F]"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}