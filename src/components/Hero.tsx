
import React from 'react';
import { useLanguage } from "@/features/language";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Ticket } from "lucide-react";

export function Hero() {
  const { currentLanguage } = useLanguage();
  const isLatvian = currentLanguage.code === 'lv';
  
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-cream leading-tight">
              {isLatvian ? (
                <>
                  Netiec uz<br />
                  pasākumu?<br />
                  Pārdod biļeti<br />
                  droši
                </>
              ) : (
                <>
                  Can't attend<br />
                  the event?<br />
                  Sell your ticket<br />
                  safely
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-cream-light">
              {isLatvian ? (
                <>
                  Gribi uz koncertu, bet biļetes izpārdotas? Ieskaties NETIEKU.ES!<br />
                  Pērc vai pārdod biļetes uz koncertiem, teātri, sporta pasākumiem u.c.
                </>
              ) : (
                <>
                  Want to go to a concert, but tickets are sold out? Check out NETIEKU.ES!<br />
                  Buy or sell tickets to concerts, theater, sports events and more.
                </>
              )}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/events">
                <Button className="bg-cream hover:bg-cream-dark text-teal-500 text-lg px-8 py-6 rounded-full">
                  {isLatvian ? 'Meklēt biļetes' : 'Find Tickets'}
                </Button>
              </Link>
              
              <Link to="/profile/tickets">
                <Button variant="outline" className="border-cream text-cream hover:bg-teal-600 text-lg px-8 py-6 rounded-full">
                  {isLatvian ? 'Pārdot biļeti' : 'Sell Ticket'}
                </Button>
              </Link>
            </div>
            
            <div className="mt-10">
              <p className="text-xl font-semibold text-amber mb-4">
                {isLatvian ? 'Droša apmaksa un verifikācija – viss godīgi' : 'Secure payment and verification – all fair'}
                <span className="ml-2 text-cream font-bold text-xl">
                  {isLatvian ? 'DRĪZUMĀ' : 'COMING SOON'}
                </span>
              </p>
              
              <div className="flex gap-5 mt-4">
                <div className="flex items-center gap-2 text-cream">
                  <span className="bg-cream rounded-full p-1">
                    <Check className="h-4 w-4 text-teal-500" />
                  </span>
                  <span>{isLatvian ? 'Droša apmaksa' : 'Secure payment'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-cream">
                  <span className="bg-cream rounded-full p-1">
                    <Check className="h-4 w-4 text-teal-500" />
                  </span>
                  <span>{isLatvian ? 'Verificētas biļetes' : 'Verified tickets'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative rounded-2xl border-4 border-cream-light p-4 max-w-lg">
              <div className="rounded-xl overflow-hidden bg-cream p-6 shadow-lg">
                <div className="bg-amber rounded-xl p-6 flex flex-col items-center">
                  <Ticket className="h-24 w-24 text-teal-500 mb-4" strokeWidth={1.5} />
                  <div className="bg-cream-light rounded-full p-3">
                    <Check className="h-10 w-10 text-teal-500" />
                  </div>
                  <div className="mt-4 w-full">
                    <div className="bg-cream-light h-4 rounded-full w-3/4 mx-auto mb-3"></div>
                    <div className="bg-cream-light h-4 rounded-full w-4/5 mx-auto mb-3"></div>
                    <div className="bg-cream-light h-4 rounded-full w-2/3 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
