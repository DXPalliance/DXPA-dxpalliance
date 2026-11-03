import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface MarketplaceAllocationMonitorProps {
  sellerCash: number;
  sellerEquity: number;
  buyerReward: number;
}

export const MarketplaceAllocationMonitor: React.FC<MarketplaceAllocationMonitorProps> = ({
  sellerCash,
  sellerEquity,
  buyerReward
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0F2749] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-amber-400" />
          <h3 className="font-bold text-lg tracking-tight uppercase">50/25/25 Allocation Monitor</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/40">
          Article 11 Active
        </div>
      </div>

      <div className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Seller Cash */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Seller Instant Cash
            </div>
            <div className="text-4xl font-serif font-bold text-slate-900">${sellerCash}</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">50% proceeds distributed directly to your local bank account upon trade verification.</p>
          </div>

          {/* Seller Equity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#0F2749] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Seller Property Equity
            </div>
            <div className="text-4xl font-serif font-bold text-[#0F2749]">${sellerEquity}</div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[10px] font-black text-blue-800 leading-tight uppercase tracking-wide">
                Non-Withdrawable Holding Capital—Reserved for Auction Pool
              </p>
            </div>
          </div>

          {/* Buyer Reward */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Buyer Reward Allocation
            </div>
            <div className="text-4xl font-serif font-bold text-slate-900">${buyerReward}</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">25% cashback rewards for the buyer, building their sovereign future through every purchase.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic">
            <Info className="w-4 h-4" />
            Verified by Columbo (Investigator AI) & Pipito (Gatekeeper AI)
          </div>
          <button className="flex items-center gap-2 text-[#0F2749] font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
            View Ledger Evidence <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
