import React, { useState } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Globe,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";

interface GroundingResearchPanelProps {
  onInsertIntoBrief: (groundedText: string) => void;
}

interface WebSource {
  title: string;
  uri: string;
}

interface MapsPlace {
  title: string;
  uri: string;
  reviewSnippets: Array<{ text: string; uri?: string }>;
}

export const GroundingResearchPanel: React.FC<GroundingResearchPanelProps> = ({
  onInsertIntoBrief,
}) => {
  const [mode, setMode] = useState<"search" | "maps">("search");
  const [queryInput, setQueryInput] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [mapsPlaces, setMapsPlaces] = useState<MapsPlace[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setUseGeolocation(true);
        setErrorMsg(null);
      },
      () => {
        setUseGeolocation(false);
        setErrorMsg(
          "Location permission declined—enter a city or ZIP directly in your Maps query."
        );
      }
    );
  };

  const handleRunGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSummary("");
    setWebSources([]);
    setMapsPlaces([]);

    try {
      if (mode === "search") {
        const res = await fetch("/api/grounding/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: queryInput.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Search grounding failed.");
        setSummary(data.summary || "");
        setWebSources(Array.isArray(data.sources) ? data.sources : []);
      } else {
        const res = await fetch("/api/grounding/maps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryInput.trim(),
            ...(useGeolocation && coords
              ? { latitude: coords.lat, longitude: coords.lng }
              : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Maps grounding failed.");
        setSummary(data.summary || "");
        setMapsPlaces(Array.isArray(data.places) ? data.places : []);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Grounding lookup failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Live Fact &amp; Venue Grounding
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify up-to-date web facts or regional school/event venues via{" "}
            <span className="font-mono">gemini-3.8-flash</span>
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode("search");
              setErrorMsg(null);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === "search"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Google Search
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("maps");
              setErrorMsg(null);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === "maps"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Google Maps
          </button>
        </div>
      </div>

      {/* Quick Starters */}
      <div className="flex flex-wrap gap-1.5">
        {(mode === "search"
          ? [
              "US K-12 public school STEM competition participation trends 2026",
              "Email newsletter benchmark open rates for education nonprofits",
            ]
          : [
              "Public science museums and makerspaces in Chicago for student showcases",
              "Community auditoriums and convention venues in Austin TX",
            ]
        ).map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setQueryInput(preset)}
            className="px-2.5 py-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors text-left"
          >
            {preset}
          </button>
        ))}
      </div>

      <form onSubmit={handleRunGrounding} className="space-y-2.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={
              mode === "search"
                ? "Search live web facts, dates, or statistics..."
                : "Search venues, museums, school districts, or regional landmarks..."
            }
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F2749]"
          />
          <button
            type="submit"
            disabled={isLoading || !queryInput.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Grounding...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                Research
              </>
            )}
          </button>
        </div>

        {mode === "maps" && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Retrieves Google Maps place links &amp; review snippets.
            </span>
            <button
              type="button"
              onClick={handleRequestLocation}
              className="inline-flex items-center gap-1 font-medium text-[#0F2749] hover:underline"
            >
              <LocateFixed className="w-3 h-3" />
              {useGeolocation && coords
                ? `Using location (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(
                    2
                  )})`
                : "Use my location"}
            </button>
          </div>
        )}
      </form>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
          {errorMsg}
        </div>
      )}

      {summary && (
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto">
            {summary}
          </div>

          {webSources.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-600">
                Verified Google Search Citations ({webSources.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {webSources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#0F2749] bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors max-w-full truncate"
                  >
                    <span className="truncate max-w-[220px]">{src.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {mapsPlaces.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-600">
                Google Maps Places &amp; Review Sources ({mapsPlaces.length})
              </div>
              <div className="space-y-2">
                {mapsPlaces.map((pl, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1.5"
                  >
                    <a
                      href={pl.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#0F2749] hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{pl.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    {pl.reviewSnippets.map((snip, j) => (
                      <div
                        key={j}
                        className="text-[11px] text-slate-600 pl-5 flex items-start justify-between gap-2"
                      >
                        <span className="italic">&ldquo;{snip.text}&rdquo;</span>
                        {snip.uri && (
                          <a
                            href={snip.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0F2749] underline shrink-0"
                          >
                            Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => onInsertIntoBrief(summary)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2749] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Append Grounded Facts to Campaign Brief
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
