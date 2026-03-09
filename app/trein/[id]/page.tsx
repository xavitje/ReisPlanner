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
  const date = searchParams.get('date') || '';

  const [journey, setJourney] = useState<JourneyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await fetch(`/api/trein?id=${id}&date=${date}`);
        if (!res.ok) throw new Error('Kon rit niet ophalen. Misschien rijdt deze vandaag niet meer.');
        const data = await res.json();
        setJourney(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJourney();
  }, [id, date]);

  // Helper functie om te kijken of een faciliteit aanwezig is
  const hasFacility = (code: string) => journey?.facilities.includes(code);

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center pb-20">
      <div className="w-full max-w-3xl bg-white min-h-screen shadow-2xl relative">

        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-6 pt-8 text-white rounded-b-[40px] shadow-lg sticky top-0 z-50">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all mb-6"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <h1 className="text-2xl font-bold">Rit laden...</h1>
            </div>
          ) : error ? (
            <h1 className="text-2xl font-bold">Oeps!</h1>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{journey?.category}</h1>
                  <p className="text-white/80 font-medium">Trein {journey?.trainNumber} • {journey?.operator}</p>
                </div>
              </div>
              <p className="text-lg font-bold mt-4 flex items-center gap-2">
                <span className="text-blue-100 font-normal">Richting:</span> {journey?.direction}
              </p>
            </div>
          )}
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
              <p className="font-bold mb-2">{error}</p>
              <button onClick={() => router.back()} className="text-rose-600 underline">Ga terug</button>
            </div>
          )}

          {!loading && !error && journey && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Voorzieningen (Alleen tonen als ze er zijn) */}
              {journey.facilities.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Aan boord</h3>
                  <div className="flex flex-wrap gap-4">
                    {hasFacility('WIFI') && (
                      <div className="flex flex-col items-center gap-1 text-blue-600"><Wifi className="w-6 h-6" /><span className="text-[10px] font-bold">WiFi</span></div>
                    )}
                    {hasFacility('TOILET') && (
                      <div className="flex flex-col items-center gap-1 text-blue-600"><Droplets className="w-6 h-6" /><span className="text-[10px] font-bold">WC</span></div>
                    )}
                    {hasFacility('POWER') && (
                      <div className="flex flex-col items-center gap-1 text-blue-600"><Plug className="w-6 h-6" /><span className="text-[10px] font-bold">Stroom</span></div>
                    )}
                    {hasFacility('BICYCLE') && (
                      <div className="flex flex-col items-center gap-1 text-blue-600"><Bike className="w-6 h-6" /><span className="text-[10px] font-bold">Fiets</span></div>
                    )}
                    {hasFacility('WHEELCHAIR') && (
                      <div className="flex flex-col items-center gap-1 text-blue-600"><Accessibility className="w-6 h-6" /><span className="text-[10px] font-bold">Rolstoel</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Complete Route Timeline */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Route van deze trein
                </h3>

                <div className="relative space-y-0">
                  {/* Verticale Lijn over de hele lengte */}
                  <div className="absolute left-[1.15rem] top-4 bottom-8 w-[3px] bg-blue-200 z-0"></div>

                  {journey.stops.map((stop, index) => {
                    const isFirst = index === 0;
                    const isLast = index === journey.stops.length - 1;

                    return (
                      <div key={index} className="relative z-10 flex gap-4 min-h-[5rem]">
                        {/* Cirkel op de tijdlijn */}
                        <div className="relative flex flex-col items-center pt-1">
                          <div className={`w-[2.4rem] h-[2.4rem] rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                            isFirst ? 'bg-blue-600' : isLast ? 'bg-green-600' : 'bg-white border-2 !border-blue-400'
                          }`}>
                            {isFirst ? (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            ) : isLast ? (
                              <MapPin className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {/* Stop Details */}
                        <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-gray-100 mb-6' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`text-lg ${isFirst || isLast ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                {stop.name}
                              </h4>
                              {stop.track && (
                                <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-medium">
                                  Spoor {stop.track}
                                </span>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {stop.time ? new Date(stop.time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </span>
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
      </div>
    </main>
  );
}