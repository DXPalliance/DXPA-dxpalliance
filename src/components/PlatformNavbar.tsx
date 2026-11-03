import React from 'react';

export type AppTabId = 'home' | 'marketplace' | 'prize' | 'constitution' | 'governance' | 'chat' | 'studio' | 'architecture';

export interface PlatformNavbarProps {
  activeTab: AppTabId;
  onNavigate: (tab: AppTabId) => void;
  onOpenOwnerSignup: () => void;
}

export const PlatformNavbar: React.FC<PlatformNavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenOwnerSignup,
}) => {
  const [downloading, setDownloading] = React.useState<'code' | 'full' | null>(null);

  const handleDownload = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    filename: string,
    type: 'code' | 'full'
  ) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(type);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.location.href = url;
    } finally {
      setDownloading(null);
    }
  };

  return (
    <nav
      aria-label="Primary Platform Navigation"
      className="w-full bg-black text-white border-b border-neutral-800 shadow-md sticky top-0 z-40 select-none"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <a
            href="/download-code"
            download="tdex-code-for-chatgpt.zip"
            onClick={(e) => handleDownload(e, '/download-code', 'tdex-code-for-chatgpt.zip', 'code')}
            title="Click to download pure source code (300 KB) to give directly to ChatGPT"
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer border border-amber-200"
          >
            <span>⬇</span>
            <span>{downloading === 'code' ? 'Downloading...' : 'Download Code for ChatGPT (300KB)'}</span>
          </a>
          <a
            href="/download-full"
            download="tdex-complete-project.zip"
            onClick={(e) => handleDownload(e, '/download-full', 'tdex-complete-project.zip', 'full')}
            title="Click to download complete project including all active pictures (7.2 MB)"
            className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer border border-emerald-200"
          >
            <span>⬇</span>
            <span>{downloading === 'full' ? 'Downloading...' : 'Download Full Site + Pictures (7.2MB)'}</span>
          </a>

          {/* 1. Home */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1 font-bold rounded text-xs sm:text-sm tracking-wide transition cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            1. Home
          </button>

          {/* 2. Discovery National Prize */}
          <button
            type="button"
            onClick={() => onNavigate('prize')}
            className={`px-3 py-1 font-bold rounded text-xs sm:text-sm tracking-wide transition cursor-pointer ${
              activeTab === 'prize'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            2. Discovery National Prize
          </button>

          {/* 3. The Discovery Marketplace */}
          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className={`px-3 py-1 font-bold rounded text-xs sm:text-sm tracking-wide transition cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            3. The Discovery Marketplace
          </button>

          {/* 4. Parents Alliance */}
          <button
            type="button"
            onClick={onOpenOwnerSignup}
            className="px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded transition cursor-pointer text-xs sm:text-sm font-bold"
          >
            4. Parents Alliance
          </button>

          {/* 5. Discovery BigCoin */}
          <button
            type="button"
            onClick={() => onNavigate('architecture')}
            className={`px-3 py-1 font-bold rounded text-xs sm:text-sm tracking-wide transition cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            5. Discovery BigCoin
          </button>

          {/* 6. Constitution */}
          <button
            type="button"
            onClick={() => onNavigate('constitution')}
            className={`px-3 py-1 font-bold rounded text-xs sm:text-sm tracking-wide transition cursor-pointer ${
              activeTab === 'constitution'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            6. Constitution
          </button>

          {/* 7. Internal Arbitration */}
          <button
            type="button"
            onClick={() => onNavigate('governance')}
            className={`px-3 py-1 font-bold rounded text-xs sm:text-sm tracking-wide transition cursor-pointer ${
              activeTab === 'governance'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            7. Internal Arbitration
          </button>
        </div>
      </div>
    </nav>
  );
};

