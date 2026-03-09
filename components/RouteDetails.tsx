"use client";

import { motion } from 'framer-motion';
import { Trip } from '@/types/transit';
import { ChevronLeft, Clock, Train, ArrowRight, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RouteDetailsProps {
  trip: Trip;
  onClose: () => void;
}

export default function RouteDetails({ trip, onClose }: RouteDetailsProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Dynamische Progress Bar Calculator
  useEffect(() => {
    const calculateProgress = () => {
      const startTime = new Date(trip.departureTime).getTime();
      const endTime = new Date(trip.arrivalTime).getTime();
      const now = new Date().getTime();

      if (now < startTime) {
        setProgress(0);
      } else if (now > endTime) {
        setProgress(100);
      } else {
        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        setProgress((elapsed / totalDuration) * 100);
      }
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 5000); // Update elke 5 sec
    return () => clearInterval(interval);
  }, [trip]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="bg-[#80f4fc] rounded-[2rem] p-6 text-[#1c0101] shadow-2xl relative"
    >
      <div className="flex items-center justify-between mb-8 border-b border-[#1c0101]/20 pb-6">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-[#1c0101] text-[#80f4fc] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-right">
          <div className="text-3xl font-black">{trip.duration} min</div>
          <div className="font-bold opacity-80">
            {trip.transfers === 0 ? 'Directe reis' : `${trip.transfers} overstappen`}
          </div>
        </div>
      </div>

      <div className="relative space-y-6 pb-4">
        {/* De Progress Bar (Zwart/Geel) */}
        <div className="absolute left-[1.4rem] top-8 bottom-8 w-[4px] bg-[#1c0101] rounded-full z-0 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-yellow-400 rounded-full transition-all duration-1000"
            style={{ height: `${progress}%` }}
          />
        </div>

        {trip.legs.map((leg, index) => (
          <div key={index} className="relative z-10">
            {/* Vertrek Station */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Vertrek</div>
                <div className="text-xl font-black">{leg.origin}</div>
                {leg.departureTrack && (
                  <div className="inline-block mt-1 px-2 py-1 bg-[#1c0101] text-[#80f4fc] text-xs font-bold rounded-md">
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

            {/* Trein Card In Card (#264f6b) */}
            <div
              onClick={() => {
                const dateTimeString = leg.departureTime || trip.departureTime;
                if(leg.trainInfo?.length) {
                  router.push(`/trein/${leg.trainInfo.length}?dateTime=${encodeURIComponent(dateTimeString)}`);
                }
              }}
              className="bg-[#264f6b] rounded-2xl p-4 my-6 cursor-pointer hover:brightness-110 transition-all group shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#80f4fc] text-[#1c0101] flex items-center justify-center">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-[#80f4fc]">
                      {leg.category || 'Trein'}
                    </div>
                    <div className="text-sm text-[#80f4fc]/80 font-semibold">
                      Richting {leg.direction || leg.destination}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#80f4fc] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Aankomst Station */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Aankomst</div>
                <div className="text-xl font-black">{leg.destination}</div>
                {leg.arrivalTrack && (
                  <div className="inline-block mt-1 px-2 py-1 bg-[#1c0101] text-[#80f4fc] text-xs font-bold rounded-md">
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

            {/* Overstap Lijn */}
            {index < trip.legs.length - 1 && (
              <div className="flex items-center gap-4 my-6 opacity-60">
                <div className="flex-1 h-px bg-[#1c0101]"></div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#1c0101]">Overstappen</div>
                <div className="flex-1 h-px bg-[#1c0101]"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}