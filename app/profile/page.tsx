"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, User, Bell, Heart, CreditCard,
  Settings, LogOut, MapPin, ArrowRight, Train
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  // Mock states voor interactie (in een echte app komen deze uit een database/context)
  const [notifications, setNotifications] = useState(true);
  const [firstClass, setFirstClass] = useState(false);

  // Mock data voor opgeslagen routes
  const savedRoutes = [
    { from: 'Amsterdam Centraal', to: 'Utrecht Centraal' },
    { from: 'Rotterdam Centraal', to: 'Den Haag Centraal' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center pb-20">
      <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl relative">

        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-6 pt-8 text-white rounded-b-[40px] shadow-lg sticky top-0 z-40">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Mijn Profiel</h1>
            <div className="w-10 h-10"></div> {/* Spacer voor centrering */}
          </div>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-inner">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User className="w-10 h-10" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Reiziger</h2>
              <p className="text-blue-100 font-medium">reiziger@voorbeeld.nl</p>
              <span className="inline-block mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                NS Flex Dal Vrij
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Opgeslagen Trajecten */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favoriete Trajecten
            </h3>
            <div className="space-y-3">
              {savedRoutes.map((route, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Train className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                        {route.from} <ArrowRight className="w-4 h-4 text-gray-400" /> {route.to}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Tik om snel te plannen</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instellingen */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Reisvoorkeuren
            </h3>
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">

              {/* Notificaties Toggle */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Reisnotificaties</p>
                    <p className="text-xs text-gray-500">Ontvang updates over vertragingen</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Klasse Toggle */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Standaard Klasse</p>
                    <p className="text-xs text-gray-500">Plan reizen in 1e of 2e klas</p>
                  </div>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setFirstClass(false)}
                    className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${!firstClass ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                  >
                    2e
                  </button>
                  <button
                    onClick={() => setFirstClass(true)}
                    className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${firstClass ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                  >
                    1e
                  </button>
                </div>
              </div>

              {/* Account Link (Niet functioneel, puur design) */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Accountgegevens</p>
                    <p className="text-xs text-gray-500">Wijzig wachtwoord of e-mail</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </div>
            </div>
          </div>

          {/* Uitloggen */}
          <button className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 font-bold bg-rose-50 hover:bg-rose-100 rounded-2xl transition-colors mt-8">
            <LogOut className="w-5 h-5" />
            Uitloggen
          </button>

        </div>
      </div>
    </main>
  );
}