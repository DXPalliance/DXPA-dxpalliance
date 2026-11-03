import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, TrendingUp, Users, RefreshCw, Calculator } from 'lucide-react';
import { computeArticle11SplitCents } from '../utils/bigcoinProtocolEngine';

export const LiveActivityDispatcher: React.FC = () => {
  const [familiesCount, setFamiliesRegistered] = useState(142);
  const [buildingFund, setBuildingFund] = useState(45250);
  const [calcValue, setCalcValue] = useState(100);
  
  // Simulate live heartbeat pulse
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBuildingFund(prev => prev + Math.floor(Math.random() * 25));
      }
      if (Math.random() > 0.95) {
        setFamiliesRegistered(prev => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const split = computeArticle11SplitCents(calcValue * 100);

  return (
    <div className="w-full bg-[#0a0a0a] text-white py-4 px-6 border-b border-stone-800 font-sans text-[10px] uppercase tracking-[0.25em] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* LIVE HEARTBEAT SECTION */}
        <div className="flex items-center gap-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-emerald-500 text-[11px] leading-none">Live Activity Dispatcher</span>
              <span className="text-[7px] text-stone-500 tracking-widest mt-1">Article 11 Active</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-stone-800 hidden lg:block" />
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] mb-1 font-black">Our Families</span>
              <span className="text-white font-black text-sm">{familiesCount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] mb-1 font-black">Building Fund</span>
              <span className="text-white font-black text-sm">${buildingFund.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CENTER MESSAGE: BLUNT & DIRECT */}
        <div className="hidden xl:flex items-center gap-4 text-stone-400 font-bold italic text-[10px] tracking-widest">
          <ShieldCheck className="w-5 h-5 text-emerald-900" />
          <span>No Banks. No Debt. 100% Cash Buying Union.</span>
        </div>

        {/* LIVE TRADE SPLIT CALCULATOR (The "Mom and Pop" Tool) */}
        <div className="flex items-center gap-8 bg-stone-900/50 px-8 py-4 rounded-sm border border-stone-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] mb-1 font-black">Garage Trade Price</span>
              <div className="flex items-center bg-[#1c1917] px-4 py-2 rounded-sm border border-stone-700">
                <span className="mr-2 text-stone-600 font-black text-xs">$</span>
                <input 
                  type="number" 
                  value={calcValue}
                  onChange={(e) => setCalcValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-transparent border-none focus:outline-none text-white font-black appearance-none text-center text-base"
                />
              </div>
            </div>
          </div>
          
          <div className="h-10 w-px bg-stone-800" />
          
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] mb-1 font-black">Cash To You</span>
              <span className="text-emerald-400 font-black text-base">${split.sellerCashUsd.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] mb-1 font-black">Equity To You</span>
              <span className="text-blue-400 font-black text-base">${split.sellerEquityUsd.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 text-[8px] mb-1 font-black">Union Shares</span>
              <span className="text-amber-500 font-black text-base">${split.buyerEquityUsd.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-center justify-center opacity-60">
            <Calculator className="w-6 h-6 text-stone-600" />
            <span className="text-[7px] mt-1 font-black text-stone-500">The Rule</span>
          </div>
        </div>

      </div>
    </div>
  );
};

