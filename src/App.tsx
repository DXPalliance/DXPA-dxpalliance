import React, { useState, useCallback, useRef } from 'react';
import {
  Layout,
  MessageSquare,
  Users,
  Award,
  BookOpen,
  Home,
  ShoppingBag,
  Scale,
  ShieldCheck,
  Flame,
  LogIn,
  X
} from 'lucide-react';

// Platform Views
import { FrontDoorView } from './components/FrontDoorView';
import { DiscoveryMarketView } from './components/DiscoveryMarketView';
import { ScienceLabView } from './components/ScienceLabView';
import { ConstitutionView } from './components/ConstitutionView';
import { GovernanceChambersView } from './components/GovernanceChambersView';
import { DiscoveryStudioView } from './components/DiscoveryStudioView';
import { ChatWorkspace } from './components/ChatWorkspace';
import { AnimatedPipConcierge } from './components/AnimatedPipConcierge';
import { HomeLiveSidebar } from './components/HomeLiveSidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

import { InfrastructureView } from './components/InfrastructureView';
import { PlatformNavbar } from './components/PlatformNavbar';

// Types
import { ChambersTabId } from './types/campaign';

type AppTabId = 'home' | 'marketplace' | 'prize' | 'constitution' | 'governance' | 'chat' | 'studio' | 'architecture';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>('home');
  const [isOwnerSignupOpen, setIsOwnerSignupOpen] = useState(false);
  const [chambersInitialTab, setChambersInitialTab] = useState<ChambersTabId>('boardroom');

  const liveSidebarRef = useRef<any>(null);

  const handleOpenMarketplace = useCallback(() => setActiveTab('marketplace'), []);
  const handleOpenScienceLab = useCallback(() => setActiveTab('prize'), []);
  const handleOpenStudio = useCallback(() => setActiveTab('studio'), []);
  const handleOpenArchitecture = useCallback(() => setActiveTab('architecture'), []);
  const handleOpenChambers = useCallback(() => {
    setChambersInitialTab('boardroom');
    setActiveTab('governance');
  }, []);
  const handleOpenChambersWithTab = useCallback((tab: ChambersTabId) => {
    setChambersInitialTab(tab);
    setActiveTab('governance');
  }, []);
  const handleOpenConstitution = useCallback(() => setActiveTab('constitution'), []);
  const handleOpenChat = useCallback(() => setActiveTab('chat'), []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <FrontDoorView
            onOpenMarketplace={handleOpenMarketplace}
            onOpenScienceLab={handleOpenScienceLab}
            onOpenStudio={handleOpenStudio}
            onOpenArchitecture={handleOpenArchitecture}
            onOpenChambers={handleOpenChambers}
            onOpenChambersWithTab={handleOpenChambersWithTab}
            onOpenConstitution={handleOpenConstitution}
            isOwnerSignupOpen={isOwnerSignupOpen}
            onOpenOwnerSignup={() => setIsOwnerSignupOpen(true)}
            onCloseOwnerSignup={() => setIsOwnerSignupOpen(false)}
          />
        );
      case 'marketplace':
        return (
          <DiscoveryMarketView
            onOpenConstitution={handleOpenConstitution}
            onOpenOwnerSignup={() => setIsOwnerSignupOpen(true)}
          />
        );
      case 'prize':
        return (
          <ScienceLabView
            onDraftScienceCampaign={(brief) => {
              console.log('Drafting science campaign:', brief);
              setActiveTab('chat');
            }}
          />
        );
      case 'studio':
        return (
          <DiscoveryStudioView
            onOpenMarketplace={handleOpenMarketplace}
            onOpenScienceLab={handleOpenScienceLab}
            onOpenChambers={handleOpenChambers}
            onOpenChambersWithTab={handleOpenChambersWithTab}
            onOpenConstitution={handleOpenConstitution}
          />
        );
      case 'constitution':
        return (
          <ConstitutionView 
            onOpenChambers={handleOpenChambers} 
            onSeedPromptFromDoc={(prompt) => console.log('Seed prompt:', prompt)} 
          />
        );
      case 'governance':
        return (
          <GovernanceChambersView
            activeTab={chambersInitialTab}
            onSelectTab={setChambersInitialTab}
            onDraftInStudio={(prompt) => console.log('Draft in studio:', prompt)}
          />
        );
      case 'chat':
        return (
          <ChatWorkspace 
            activeCampaign={{} as any} 
            currentUser={null} 
            onApplyPromptToStudio={(p) => console.log('Apply prompt:', p)} 
          />
        );
      case 'architecture':
        return <InfrastructureView />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col relative overflow-x-hidden">


        {/* Primary Platform Navigation Bar — persistent across all views */}
        <PlatformNavbar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenOwnerSignup={() => setIsOwnerSignupOpen(true)}
        />

        <main className="flex-1 w-full">
          {renderActiveView()}
        </main>

        {/* Global Owner Registration Modal */}
        {isOwnerSignupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F2749] text-white flex items-center justify-center font-black text-xl">
                      D
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Owner Registration</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Real People · Real Property</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOwnerSignupOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Welcome to the Parents Alliance. Registration is strictly "1 Human, 1 Vote." 
                    No platform dues, no membership fees. Just real people, real property.
                  </p>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Full Human Name" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2749]/20"
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2749]/20"
                    />
                  </div>

                  <button 
                    className="w-full py-4 bg-[#0F2749] hover:bg-[#173866] text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95"
                    onClick={() => {
                      alert('Welcome Owner! Your democratic ballot is now active.');
                      setIsOwnerSignupOpen(false);
                    }}
                  >
                    Register as Human Owner
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-medium px-6">
                    By registering, you agree to the Tdex Constitution. Your data is never sold. 
                    Ownership is earned through discovery, not capital alone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer (if not in FrontDoorView) */}
        {activeTab !== 'home' && (
          <footer className="bg-white border-t border-slate-200 py-12 px-6">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F2749] text-white flex items-center justify-center font-black text-sm">
                    D
                  </div>
                  <span className="font-bold text-slate-900 text-lg">Dexpa</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  The Discovery Exchange & Parents Alliance. 
                  One Human, One Vote. Locked for Families. 
                  Building a debt-free future for our children.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Platform</h4>
                <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                  <li><button onClick={() => setActiveTab('home')} className="hover:text-[#0F2749]">Home Doorway</button></li>
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-[#0F2749]">Marketplace</button></li>
                  <li><button onClick={() => setActiveTab('studio')} className="hover:text-[#0F2749]">Discovery Studio</button></li>
                  <li><button onClick={() => setActiveTab('prize')} className="hover:text-[#0F2749]">Challenge Room</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Governance</h4>
                <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                  <li><button onClick={() => setActiveTab('constitution')} className="hover:text-[#0F2749]">Tdex Constitution</button></li>
                  <li><button onClick={() => setActiveTab('governance')} className="hover:text-[#0F2749]">Owners Board</button></li>
                  <li><button onClick={() => setActiveTab('architecture')} className="hover:text-[#0F2749]">System Architecture</button></li>
                  <li><button onClick={() => setIsOwnerSignupOpen(true)} className="hover:text-[#0F2749]">Human Registration</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Contact</h4>
                <div className="text-[11px] font-mono text-slate-500">
                  <p>thediscoveryexchange.com</p>
                  <p className="mt-1">Parents Alliance (Dexpa)</p>
                  <p className="mt-1 text-emerald-600 font-bold">Live Status: Operational</p>
                </div>
              </div>
            </div>
            
            <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <div>© 2026 The Discovery Exchange</div>
              <div className="flex items-center gap-6">
                <span>Secure for Families</span>
                <span>Zero Hidden Fees</span>
                <span>Debt-Free for Life</span>
              </div>
            </div>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  );
}
