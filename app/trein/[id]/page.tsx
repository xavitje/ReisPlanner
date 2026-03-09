"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Wifi, Droplets, Plug, Bike, Accessibility, Loader2, MapPin } from 'lucide-react';
import { JourneyDetails } from '@/types/transit';

export default function TreinDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const dateTime = searchParams.get('dateTime') || '';

  const [journey, setJourney] = useState<JourneyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await fetch(`/api/trein?id=${id}&dateTime=${encodeURIComponent(dateTime)}`);
        if (!res.ok) throw new Error('Kon rit niet ophalen. Misschien is deze uitgevallen.');
        const data = await res.json();
        setJourney(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJourney();
  }, [id, dateTime]);

  // Dynamische Progress Bar voor de specifieke Trein
  useEffect(() => {
    if (!journey || journey.stops.length === 0) return;

    const calculateProgress = () => {
      const startTime = new Date(journey.stops[0].time).getTime();
      const endTime = new Date(journey.stops[journey.stops.length - 1].time).getTime();
      const now = new Date().getTime();

      if (now < startTime) setProgress(0);
      else if (now > endTime) setProgress(100);
      else {
        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        setProgress((elapsed / totalDuration) * 100);
      }
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 5000);
    return () => clearInterval(interval);
  }, [journey]);

  const hasFacility = (code: string) => journey?.facilities.includes(code);

  return (
    <main className="min-h-screen bg-[#121f3f] flex justify-center font-sans pb-20 px-5 sm:px-8 py-8">
      <div className="w-full max-w-xl relative">

        <div className="flex items-start gap-4 mb-8 text-[#80f4fc]">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-[#264f6b] hover:brightness-110 rounded-full flex items-center justify-center transition-colors shadow-md flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-[#80f4fc]" />
          </button>

          <div className="flex-1 pt-1">
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <h1 className="text-2xl font-black">Laden...</h1>
              </div>
            ) : error ? (
              <h1 className="text-2xl font-black text-red-400">{error}</h1>
            ) : (
              <div>
                <h1 className="text-2xl font-black">{journey?.category}</h1>
                <p className="font-bold text-[#80f4fc]/80">Richting {journey?.direction}</p>
                <p className="text-sm mt-1 opacity-60 font-medium">Trein {journey?.trainNumber} • {journey?.operator}</p>
              </div>
            )}
          </div>
        </div>

        {!loading && !error && journey && (
          <div className="bg-[#80f4fc] rounded-[2rem] p-6 text-[#1c0101] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

            {journey.facilities.length > 0 && (
              <div className="bg-[#264f6b] text-[#80f4fc] p-5 rounded-2xl mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-70">Aan boord</h3>
                <div className="flex flex-wrap gap-5">
                  {hasFacility('WIFI') && <div className="flex flex-col items-center gap-1"><Wifi className="w-6 h-6" /><span className="text-[10px] font-bold">WiFi</span></div>}
                  {hasFacility('TOILET') && <div className="flex flex-col items-center gap-1"><Droplets className="w-6 h-6" /><span className="text-[10px] font-bold">WC</span></div>}
                  {hasFacility('POWER') && <div className="flex flex-col items-center gap-1"><Plug className="w-6 h-6" /><span className="text-[10px] font-bold">Stroom</span></div>}
                  {hasFacility('BICYCLE') && <div className="flex flex-col items-center gap-1"><Bike className="w-6 h-6" /><span className="text-[10px] font-bold">Fiets</span></div>}
                  {hasFacility('WHEELCHAIR') && <div className="flex flex-col items-center gap-1"><Accessibility className="w-6 h-6" /><span className="text-[10px] font-bold">Rolstoel</span></div>}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-6">Route Details</h3>
              <div className="relative space-y-0">

                {/* Dynamische Progress Bar */}
                <div className="absolute left-[1.15rem] top-4 bottom-8 w-[4px] bg-[#1c0101] z-0 rounded-full overflow-hidden">
                   <div
                      className="absolute top-0 left-0 w-full bg-yellow-400 rounded-full transition-all duration-1000"
                      style={{ height: `${progress}%` }}
                    />
                </div>

                {journey.stops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === journey.stops.length - 1;

                  return (
                    <div key={index} className="relative z-10 flex gap-4 min-h-[5rem]">
                      <div className="relative flex flex-col items-center pt-1">
                        <div className={`w-[2.4rem] h-[2.4rem] rounded-full flex items-center justify-center border-4 border-[#80f4fc] shadow-sm ${
                          isFirst || isLast ? 'bg-[#1c0101]' : 'bg-[#80f4fc] border-2 !border-[#1c0101]'
                        }`}>
                          {isFirst ? <div className="w-2 h-2 bg-[#80f4fc] rounded-full" />
                           : isLast ? <MapPin className="w-3.5 h-3.5 text-[#80f4fc]" />
                           : <div className="w-2 h-2 bg-[#1c0101] rounded-full" />}
                        </div>
                      </div>

                      <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-[#1c0101]/20 mb-6' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-black">
                              {stop.name}
                            </h4>
                            {stop.track && (
                              <span className="inline-block mt-1 text-xs bg-[#1c0101] text-[#80f4fc] px-2 py-0.5 rounded-md font-bold">
                                Spoor {stop.track}
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="font-black text-xl">
                              {stop.time ? new Date(stop.time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}