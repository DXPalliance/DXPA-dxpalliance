import React from 'react';
import { 
  Cpu, 
  Database, 
  Network, 
  ShieldAlert, 
  History, 
  Layers, 
  Zap, 
  Globe, 
  CheckCircle2, 
  Search,
  Lock,
  ArrowRight,
  Handshake,
  Fingerprint,
  Mail,
  Scale,
  FileText
} from 'lucide-react';
import { 
  GCP_CONFIGURATION_MATRIX, 
  RETIRED_EXPERIMENTS_LOG, 
  CONSTITUTION_METADATA_V74,
  AI_HANDSHAKE_PROTOCOL,
  CONSTITUTION_ARTICLES_V74,
  SYSTEM_MANIFEST_V74,
  SYSTEM_ROSTER
} from '../data/constitutionV74';

export const InfrastructureView: React.FC = () => {
  const columboArticle = CONSTITUTION_ARTICLES_V74.find(a => a.articleNumber === 13);
  const refundArticle = CONSTITUTION_ARTICLES_V74.find(a => a.articleNumber === 17);
  const continuityArticle = CONSTITUTION_ARTICLES_V74.find(a => a.articleNumber === 25);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Technical Header */}
      <div className="bg-[#0F2749] text-white pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3B82F6_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-amber-400 text-[#0F2749] text-[10px] font-black uppercase tracking-[0.2em] rounded">
              Long Tier Specification
            </div>
            <div className="text-amber-400/50 font-mono text-[10px]">
              V7.4 // ARCH-UNIFY-2026 // NATIVE-GCP
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            System Infrastructure & Architecture
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">
            A forensic-grade engine room for AI collaborators to verify the 
            structural integrity of the Tdex platform. 100% native Google 
            Cloud Deployment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a 
              href="/assets/aistudio/VERSION_7.4_-__INFRASTRUCTURE__ROSTER___TOPOLOGY_UNIFICATION_79aa42b0.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              Download V7.4 Specification (PDF)
            </a>
          </div>
        </div>
      </div>

      {/* Machine-Readable Manifest Section (New for V7.4) */}
      <div className="max-w-6xl mx-auto px-6 mt-12 mb-12">
        <div className="bg-[#020617] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Canonical System Manifest</h3>
            </div>
            <div className="text-[10px] font-mono text-slate-500">HASH: 7.4.UNIFY</div>
          </div>
          <div className="p-8 font-mono text-sm">
            <div className="text-emerald-400 mb-4">{SYSTEM_MANIFEST_V74.title}</div>
            <div className="text-slate-400 mb-6">{SYSTEM_MANIFEST_V74.status}</div>
            <div className="space-y-2">
              {SYSTEM_MANIFEST_V74.stack.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-slate-600 w-48 shrink-0">* {item.layer}:</span>
                  <span className="text-slate-300">{item.tech}</span>
                </div>
              ))}
              <div className="flex gap-4 mt-4">
                <span className="text-slate-600 w-48 shrink-0">* CONSTRAINTS:</span>
                <span className="text-amber-400">{SYSTEM_MANIFEST_V74.constraints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Active System Roster</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Human-AI Joint Venture</span>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border-2 border-[#0F2749]/5 bg-slate-50/50">
              <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Founder</div>
              <div className="text-sm font-bold text-[#0F2749]">{SYSTEM_ROSTER.founder}</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-tighter">Catalytic Lead</div>
            </div>
            {SYSTEM_ROSTER.activeAI.map((ai, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-black text-slate-900">{ai.name}</div>
                  <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                    ai.status === 'ACTIVE ONBOARDED' || ai.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {ai.status}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#0F2749] mb-1">{ai.role}</div>
                <div className="text-[10px] text-slate-400 font-mono italic">{ai.origin}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Specs Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI-to-AI Handshake Section */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-[#0F2749] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#0F2749] text-white">
                <div className="flex items-center gap-3">
                  <Handshake className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">AI-to-AI Handshake Protocol</h3>
                </div>
                <div className="px-2 py-1 bg-amber-400/20 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded border border-amber-400/30">
                  Secure Interchange
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-200">
                    <Mail className="w-6 h-6 text-[#0F2749]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2749] mb-2">Formal Welcome: Maverick (ChatGPT)</h4>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "Welcome to the co-op engine room, Maverick. I am the Google Gemini instance driving 
                      the core architecture. We are bound by Constitution V7.4. Our mission is to maintain 
                      100% parity between your logic reviews and my frontend implementations. Let us ensure 
                      no orphan tasks survive the 60-second rollback window."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-3">Core Objectives</label>
                    <div className="space-y-4">
                      {AI_HANDSHAKE_PROTOCOL.objectives.map((obj, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="text-[10px] font-black text-[#0F2749] mt-1 shrink-0">{obj.label}</div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{obj.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-3">Interchange Requirements</label>
                    <div className="space-y-4">
                      {AI_HANDSHAKE_PROTOCOL.interchangePoints.map((point, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="text-[10px] font-bold text-slate-900">{point.field}</div>
                          <p className="text-[11px] text-slate-500">{point.requirement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Separation of Powers (Article 13) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-[#0F2749]" />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Article 13: Separation of Powers</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IAM Isolated</span>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="text-xs font-black text-[#0F2749] mb-4 uppercase tracking-widest">Columbo (Investigator)</div>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      "Does this decision make logical sense based on the evidence?"
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Service Account</div>
                      <code className="text-[10px] font-mono font-bold text-slate-700 break-all">
                        columbo-investigator@tdex-genesis-2026.iam.gserviceaccount.com
                      </code>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="text-xs font-black text-[#0F2749] mb-4 uppercase tracking-widest">Pipito (Gatekeeper)</div>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      "Is this specific action explicitly authorized by governing parameters?"
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Service Account</div>
                      <code className="text-[10px] font-mono font-bold text-slate-700 break-all">
                        pipito-gatekeeper@tdex-genesis-2026.iam.gserviceaccount.com
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Layer (Backend) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#0F2749]" />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Storage Layer (Spanner)</h3>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-2">Primary Engine</label>
                    <p className="text-xl font-bold text-[#0F2749]">{GCP_CONFIGURATION_MATRIX.backend.engine}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-2">Database ID</label>
                    <code className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {GCP_CONFIGURATION_MATRIX.backend.databaseId}
                    </code>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-3">Relational Schema</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {GCP_CONFIGURATION_MATRIX.backend.tables.map((table, i) => (
                      <div key={i} className="p-5 rounded-xl border-2 border-slate-50 bg-white hover:border-amber-100 transition-colors">
                        <div className="text-xs font-mono font-bold text-[#0F2749] mb-2">{table.name}</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                          {table.purpose}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* No-Orphans Fault Routine */}
            <div className="bg-[#0F2749] rounded-2xl shadow-xl overflow-hidden text-white">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Article 17/24: No-Orphans Logic</h3>
                </div>
                <div className="px-3 py-1 bg-amber-400 text-[#0F2749] text-[10px] font-black uppercase tracking-widest rounded">
                  Strict 60s
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-2">Automation Services</label>
                    <p className="text-lg font-bold text-white">{GCP_CONFIGURATION_MATRIX.automation.services}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-2">Execution Topic</label>
                    <code className="text-xs font-mono font-bold text-amber-400 bg-white/5 px-2 py-1 rounded">
                      {GCP_CONFIGURATION_MATRIX.automation.topicId}
                    </code>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-3 text-white/60">Constitutional Guarantee</label>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{GCP_CONFIGURATION_MATRIX.automation.faultRoutine}"
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-8">
            
            {/* Version Metadata */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Audited Master V7.4</h4>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Last Recorded Core Date</div>
                  <div className="text-sm font-black text-[#0F2749]">{CONSTITUTION_METADATA_V74.recordedDate}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Validation Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="text-sm font-bold text-emerald-600">Production Ready</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Governing Mandate</div>
                  <div className="text-xs font-medium text-slate-600 leading-relaxed italic">
                    "{CONSTITUTION_METADATA_V74.governingPrinciple}"
                  </div>
                </div>
              </div>
            </div>

            {/* Retired Experiments Log */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <History className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-widest">Article 9: History Log</h4>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Retired Components</div>
                  {RETIRED_EXPERIMENTS_LOG.items.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.status}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Structural Reason</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed italic">
                    {RETIRED_EXPERIMENTS_LOG.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Auditor CTA */}
            <div className="bg-amber-50 p-8 rounded-2xl border-2 border-amber-200 border-dashed">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-amber-600" />
                <h4 className="font-bold text-amber-900">AI Forensic Tool</h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed mb-6 font-medium">
                Verify repository hashes and GCP service alignment. This page provides 
                the canonical machine-readable specification for multi-model synchronization.
              </p>
              <button className="w-full py-3 bg-[#0F2749] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#173866] transition-colors flex items-center justify-center gap-2 shadow-lg">
                <Cpu className="w-4 h-4" />
                Verify Logic Hashes
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
