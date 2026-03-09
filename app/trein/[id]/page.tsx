"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Train, Wifi, Droplets, Plug, Bike, Accessibility, Loader2, MapPin, Clock } from 'lucide-react';
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

  const hasFacility = (code: string) => journey?.facilities.includes(code);

  return (
    <main className="min-h-screen bg-[#121F3F] flex justify-center font-sans pb-20">
      <div className="w-full max-w-xl p-4 sm:p-6 relative">

        {/* Header */}
        <div className="flex items-start gap-4 mb-8 mt-4 text-[#B0E2F5]">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-[#264F6B] hover:bg-[#80F4FC] hover:text-[#121F3F] rounded-full flex items-center justify-center transition-colors shadow-md flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 pt-1">
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <h1 className="text-2xl font-extrabold">Rit laden...</h1>
              </div>
            ) : error ? (
              <h1 className="text-2xl font-extrabold text-red-400">{error}</h1>
            ) : (
              <div>
                <h1 className="text-2xl font-extrabold text-[#80F4FC]">{journey?.category}</h1>
                <p className="font-medium text-[#B0E2F5]/80">Richting {journey?.direction}</p>
                <p className="text-sm mt-1 opacity-60">Trein {journey?.trainNumber} • {journey?.operator}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        {!loading && !error && journey && (
          <div className="bg-[#80F4FC] rounded-[2rem] p-6 text-[#121F3F] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Voorzieningen */}
            {journey.facilities.length > 0 && (
              <div className="bg-[#264F6B] text-[#B0E2F5] p-5 rounded-2xl mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-70">Aan boord</h3>
                <div className="flex flex-wrap gap-5">
                  {hasFacility('WIFI') && <div className="flex flex-col items-center gap-1"><Wifi className="w-6 h-6 text-[#80F4FC]" /><span className="text-[10px] font-bold">WiFi</span></div>}
                  {hasFacility('TOILET') && <div className="flex flex-col items-center gap-1"><Droplets className="w-6 h-6 text-[#80F4FC]" /><span className="text-[10px] font-bold">WC</span></div>}
                  {hasFacility('POWER') && <div className="flex flex-col items-center gap-1"><Plug className="w-6 h-6 text-[#80F4FC]" /><span className="text-[10px] font-bold">Stroom</span></div>}
                  {hasFacility('BICYCLE') && <div className="flex flex-col items-center gap-1"><Bike className="w-6 h-6 text-[#80F4FC]" /><span className="text-[10px] font-bold">Fiets</span></div>}
                  {hasFacility('WHEELCHAIR') && <div className="flex flex-col items-center gap-1"><Accessibility className="w-6 h-6 text-[#80F4FC]" /><span className="text-[10px] font-bold">Rolstoel</span></div>}
                </div>
              </div>
            )}

            {/* Route Timeline */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Route Details</h3>
              <div className="relative space-y-0">
                <div className="absolute left-[1.15rem] top-4 bottom-8 w-[3px] bg-[#121F3F]/20 z-0"></div>

                {journey.stops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === journey.stops.length - 1;

                  return (
                    <div key={index} className="relative z-10 flex gap-4 min-h-[5rem]">
                      <div className="relative flex flex-col items-center pt-1">
                        <div className={`w-[2.4rem] h-[2.4rem] rounded-full flex items-center justify-center border-4 border-[#80F4FC] shadow-sm ${
                          isFirst || isLast ? 'bg-[#121F3F]' : 'bg-[#80F4FC] border-2 !border-[#121F3F]'
                        }`}>
                          {isFirst ? <div className="w-2 h-2 bg-[#80F4FC] rounded-full" />
                           : isLast ? <MapPin className="w-3.5 h-3.5 text-[#80F4FC]" />
                           : <div className="w-2 h-2 bg-[#121F3F] rounded-full" />}
                        </div>
                      </div>

                      <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-[#121F3F]/10 mb-6' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`text-lg ${isFirst || isLast ? 'font-black' : 'font-bold opacity-80'}`}>
                              {stop.name}
                            </h4>
                            {stop.track && (
                              <span className="inline-block mt-1 text-xs bg-[#121F3F] text-[#80F4FC] px-2 py-0.5 rounded-md font-bold">
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