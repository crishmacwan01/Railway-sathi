import React, { useState } from 'react';
import { Search, Train, Clock, ArrowRight, X } from 'lucide-react';
import { TrainSearchResult } from '../../types/railway';
import { railwayService } from '../../services/railwayService';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrain: (trainNumber: string) => void;
  recentSearches: string[];
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTrain,
  recentSearches,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TrainSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const matches = await railwayService.searchTrains(query);
        setResults(matches);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/30 backdrop-blur-[4px] animate-fade-in">
      <div 
        className="relative w-full max-w-xl rounded-[20px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Field (design.md: 48px, radius --r-lg, leading icon, focus ring) */}
        <div className="flex items-center px-4 h-14 border-b border-[rgba(0,0,0,0.08)] bg-[#FFFFFF]">
          <Search className="w-5 h-5 text-[#6E6E73] mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search train number (e.g. 12951) or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#1D1D1F] placeholder-[#A1A1A6] outline-none text-[15px] font-normal"
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="p-1.5 text-[#6E6E73] hover:text-[#1D1D1F] mr-2 rounded-full hover:bg-[#F5F5F7]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-[#6E6E73] bg-[#F5F5F7] rounded-[6px] border border-[rgba(0,0,0,0.08)]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading && (
            <div className="py-10 text-center text-[13px] text-[#6E6E73] flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#0A84FF] border-t-transparent rounded-full animate-spin" />
              Searching railway database...
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-mono font-semibold text-[#6E6E73] uppercase tracking-wider">
                Matching Trains
              </div>
              {results.map((train) => (
                <button
                  key={train.trainNumber}
                  onClick={() => {
                    onSelectTrain(train.trainNumber);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-[12px] hover:bg-[#F5F5F7] transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] font-mono text-xs font-bold">
                      {train.trainNumber}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#1D1D1F] group-hover:text-[#0A84FF] transition-colors">
                        {train.name}
                      </div>
                      <div className="text-[12px] text-[#6E6E73] flex items-center gap-1.5 mt-0.5">
                        <span>{train.origin}</span>
                        <ArrowRight className="w-3 h-3 text-[#A1A1A6]" />
                        <span>{train.destination}</span>
                        <span className="text-[#A1A1A6]">•</span>
                        <span className="font-mono text-[#6E6E73]">{train.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[12px] font-medium text-[#0A84FF] group-hover:translate-x-0.5 transition-transform">
                    Track →
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && !query && (
            <div>
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1.5 text-[11px] font-mono font-semibold text-[#6E6E73] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#6E6E73]" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 pt-1">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          onSelectTrain(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBED] text-[12px] font-mono text-[#1D1D1F] border border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 transition-colors"
                      >
                        <Train className="w-3 h-3 text-[#0A84FF]" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 text-[12px] text-[#6E6E73] border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                <span>Popular routes: 12951 Mumbai Rajdhani • 12009 Shatabdi • 22436 Vande Bharat</span>
              </div>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-12 text-center text-[14px] text-[#6E6E73]">
              No matching trains found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
