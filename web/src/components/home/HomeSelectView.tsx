import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Train, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  Compass, 
  Bookmark, 
  TrendingUp, 
  ShieldCheck, 
  CloudSun, 
  Layers, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { SEARCHABLE_TRAINS } from '../../services/mockData';
import { TrainSearchResult } from '../../types/railway';
import { railwayService } from '../../services/railwayService';

interface HomeSelectViewProps {
  onSelectTrain: (trainNumber: string) => void;
  favorites: string[];
  recentSearches: string[];
  onToggleFavorite: (trainNumber: string) => void;
}

export const HomeSelectView: React.FC<HomeSelectViewProps> = ({
  onSelectTrain,
  favorites,
  recentSearches,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'RAJDHANI' | 'SHATABDI' | 'VANDE_BHARAT'>('ALL');
  const [trainsList, setTrainsList] = useState<TrainSearchResult[]>(SEARCHABLE_TRAINS);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search directly querying RailRadar API with 10,000+ trains
  useEffect(() => {
    if (!query.trim()) {
      setTrainsList(SEARCHABLE_TRAINS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await railwayService.searchTrains(query);
        setTrainsList(results);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredTrains = trainsList.filter((train) => {
    // If user is searching specifically, prioritize search matches
    if (query.trim()) {
      if (selectedCategory === 'RAJDHANI') return train.name.toLowerCase().includes('rajdhani');
      if (selectedCategory === 'SHATABDI') return train.name.toLowerCase().includes('shatabdi');
      if (selectedCategory === 'VANDE_BHARAT') return train.name.toLowerCase().includes('vande bharat');
      return true;
    }
    if (selectedCategory === 'RAJDHANI') return train.name.toLowerCase().includes('rajdhani');
    if (selectedCategory === 'SHATABDI') return train.name.toLowerCase().includes('shatabdi');
    if (selectedCategory === 'VANDE_BHARAT') return train.name.toLowerCase().includes('vande bharat');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D1D1F] flex flex-col">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.82)] backdrop-blur-[20px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#0A84FF] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(10,132,255,0.3)]">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-[#1D1D1F]">RailGaadi</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#30B158]/12 text-[#30B158] font-semibold">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] text-[12px] font-mono text-[#6E6E73] border border-[rgba(0,0,0,0.06)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#30B158]" />
              <span>RailRadar Live API Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Search Section */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] text-[12px] font-semibold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search 10,000+ Indian Railway Trains</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-bold text-[#1D1D1F] tracking-[-0.03em] leading-[1.1] mb-3">
            Your journey, beautifully tracked.
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#6E6E73] font-normal max-w-xl mx-auto">
            Select any train below to view its live MapTiler corridor, station halts, OpenWeather forecasts, and elevation analytics.
          </p>

          {/* Search Input Bar */}
          <div className="mt-8 relative max-w-2xl mx-auto">
            <div className="flex items-center h-14 px-4 rounded-[16px] bg-[#FFFFFF] border-2 border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.14)] focus-within:border-[#0A84FF] focus-within:ring-4 focus-within:ring-[#0A84FF]/10 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              {isSearching ? (
                <Loader2 className="w-5 h-5 text-[#0A84FF] mr-3 shrink-0 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-[#6E6E73] mr-3 shrink-0" />
              )}
              <input
                type="text"
                autoFocus
                placeholder="Search any train (e.g. 12951, 12009, 22436, Shatabdi, Rajdhani)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-[#1D1D1F] placeholder-[#A1A1A6] outline-none text-[15px] font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="px-2 py-1 text-[12px] font-mono text-[#6E6E73] hover:text-[#1D1D1F] bg-[#F5F5F7] rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick chips filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[12px] text-[#6E6E73] font-medium mr-1">Filter:</span>
              {[
                { id: 'ALL', label: 'All Trains' },
                { id: 'RAJDHANI', label: 'Rajdhani Express' },
                { id: 'VANDE_BHARAT', label: 'Vande Bharat' },
                { id: 'SHATABDI', label: 'Shatabdi' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedCategory(chip.id as any)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    selectedCategory === chip.id
                      ? 'bg-[#0A84FF] text-white shadow-sm'
                      : 'bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#6E6E73] border border-[rgba(0,0,0,0.06)]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Recent & Favorite Quick Access Pills */}
        {(recentSearches.length > 0 || favorites.length > 0) && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-[18px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#6E6E73] font-semibold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#0A84FF]" />
                <span>Quick Access Trains</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {Array.from(new Set([...recentSearches, ...favorites])).map((trainNo) => (
                  <button
                    key={trainNo}
                    onClick={() => onSelectTrain(trainNo)}
                    className="px-3 py-1 rounded-full bg-white hover:bg-[#F5F5F7] text-[12px] font-mono text-[#1D1D1F] border border-[rgba(0,0,0,0.08)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-1.5 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <Train className="w-3 h-3 text-[#0A84FF]" />
                    <span className="font-semibold">{trainNo}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Train Selection Cards Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-bold text-[#1D1D1F] tracking-[-0.01em]">
              Available Trains ({filteredTrains.length})
            </h2>
            <span className="text-[12px] text-[#6E6E73]">
              Click any train to load its live track & halts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrains.map((train) => {
              const isFav = favorites.includes(train.trainNumber);

              return (
                <div
                  key={train.trainNumber}
                  onClick={() => onSelectTrain(train.trainNumber)}
                  className="group relative p-5 rounded-[20px] bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] hover:border-[#0A84FF]/40 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(10,132,255,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top line with train Number and Status */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 rounded-[10px] bg-[#0A84FF]/10 text-[#0A84FF] font-mono text-[13px] font-bold">
                          {train.trainNumber}
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#30B158]/12 text-[#30B158] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#30B158] animate-pulse" />
                          Live Status
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(train.trainNumber);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          isFav 
                            ? 'text-[#FF9F0A] bg-[#FF9F0A]/10' 
                            : 'text-[#A1A1A6] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                        }`}
                        title={isFav ? 'Remove Favorite' : 'Add to Favorite'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Train Name */}
                    <h3 className="text-[16px] font-semibold text-[#1D1D1F] group-hover:text-[#0A84FF] transition-colors leading-snug">
                      {train.name}
                    </h3>

                    {/* Route corridor endpoints */}
                    <div className="flex items-center gap-2 text-[13px] text-[#6E6E73] mt-3">
                      <div className="flex items-center gap-1 font-medium text-[#1D1D1F]">
                        <MapPin className="w-3.5 h-3.5 text-[#0A84FF]" />
                        <span>{train.origin}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#A1A1A6]" />
                      <div className="flex items-center gap-1 font-medium text-[#1D1D1F]">
                        <span>{train.destination}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom metadata and Open trigger */}
                  <div className="mt-5 pt-3.5 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-[12px] font-mono text-[#6E6E73]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#A1A1A6]" />
                      <span>{train.duration}</span>
                      <span className="text-[#C7C7CC]">•</span>
                      <span>Daily</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#0A84FF] font-sans font-semibold text-[13px] group-hover:translate-x-1 transition-transform">
                      <span>Open Journey</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTrains.length === 0 && (
            <div className="p-12 text-center bg-[#FBFBFD] rounded-[20px] border border-[rgba(0,0,0,0.06)]">
              <Train className="w-8 h-8 text-[#A1A1A6] mx-auto mb-2" />
              <div className="text-[15px] font-semibold text-[#1D1D1F]">No trains found matching "{query}"</div>
              <p className="text-[13px] text-[#6E6E73] mt-1">Try entering any train number (e.g. 12009, 22436, 12301) or reset search.</p>
            </div>
          )}
        </div>

        {/* 5. Features Showcase Grid */}
        <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-[rgba(0,0,0,0.08)]">
          <div className="text-center mb-8">
            <h2 className="text-[20px] font-bold text-[#1D1D1F] tracking-[-0.01em]">
              Explore RailGaadi Intelligence Features
            </h2>
            <p className="text-[13px] text-[#6E6E73] mt-1">
              Powered by RailRadar live telemetry, MapTiler vector cartography, and OpenWeather
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[18px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)]">
              <div className="w-8 h-8 rounded-[10px] bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#1D1D1F]">MapTiler Vector Rails</h4>
              <p className="text-[12px] text-[#6E6E73] mt-1 leading-relaxed">
                Smooth vector track geometry, live locomotive pin, 3D tilt, and automated route corridor bounds.
              </p>
            </div>

            <div className="p-4 rounded-[18px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)]">
              <div className="w-8 h-8 rounded-[10px] bg-[#30B158]/10 text-[#30B158] flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#1D1D1F]">Live Station Timetable</h4>
              <p className="text-[12px] text-[#6E6E73] mt-1 leading-relaxed">
                Right-time arrivals, departure timestamps, platform tracks, and station sequence offsets.
              </p>
            </div>

            <div className="p-4 rounded-[18px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)]">
              <div className="w-8 h-8 rounded-[10px] bg-[#FF9F0A]/10 text-[#FF9F0A] flex items-center justify-center mb-3">
                <CloudSun className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#1D1D1F]">Station Weather Radar</h4>
              <p className="text-[12px] text-[#6E6E73] mt-1 leading-relaxed">
                Real-time OpenWeather forecasts for departure, intermediate stops, and final destinations.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[rgba(0,0,0,0.06)] py-6 text-center text-[12px] text-[#A1A1A6]">
        RailGaadi • Live API Powered Indian Railway Intelligence
      </footer>
    </div>
  );
};
