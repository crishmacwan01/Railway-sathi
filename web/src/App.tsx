import React, { useState, useEffect } from 'react';
import { railwayService } from './services/railwayService';
import { TrainJourneyData } from './types/railway';
import { JourneyMap } from './components/map/JourneyMap';
import { StationTimeline } from './components/journey/StationTimeline';
import { TravelCompanion } from './components/journey/TravelCompanion';
import { AnalyticsPanel } from './components/analytics/AnalyticsPanel';
import { SearchPalette } from './components/search/SearchPalette';
import { HomeSelectView } from './components/home/HomeSelectView';
import { FeaturesHubModal } from './components/features/FeaturesHubModal';
import {
  Search,
  Share2,
  Bookmark,
  RefreshCw,
  Clock,
  Compass,
  ArrowRight,
  Radio,
  Check,
  ChevronLeft,
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation State: 'HOME' (train selection & features) vs 'JOURNEY' (main map, station timeline, analytics)
  const [currentView, setCurrentView] = useState<'HOME' | 'JOURNEY'>('HOME');
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12951');
  const [journey, setJourney] = useState<TrainJourneyData | null>(null);
  const [isLoadingJourney, setIsLoadingJourney] = useState(false);

  // Tab & feature controls
  const [activeTab, setActiveTab] = useState<'timeline' | 'companion' | 'analytics'>('timeline');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFeaturesHubOpen, setIsFeaturesHubOpen] = useState(false);
  const [isFollowMode, setIsFollowMode] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(['12951', '22436']);
  const [recentSearches, setRecentSearches] = useState<string[]>(['12951', '12009', '22436']);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedSpeed, setSimulatedSpeed] = useState(118);

  // Load journey when train changes
  useEffect(() => {
    if (selectedTrainNumber) {
      loadJourneyData(selectedTrainNumber);
    }
  }, [selectedTrainNumber]);

  // Keyboard shortcut '/' opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Live telemetry pulse simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedSpeed((prev) => Math.max(108, Math.min(124, prev + Math.floor(Math.random() * 5) - 2)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadJourneyData = async (trainNumber: string) => {
    setIsLoadingJourney(true);
    try {
      const data = await railwayService.getJourney(trainNumber, '2026-10-09');
      setJourney(data);
      if (!recentSearches.includes(trainNumber)) {
        setRecentSearches([trainNumber, ...recentSearches.slice(0, 4)]);
      }
    } finally {
      setIsLoadingJourney(false);
    }
  };

  const handleSelectTrainAndNavigate = (trainNumber: string) => {
    setSelectedTrainNumber(trainNumber);
    setCurrentView('JOURNEY');
  };

  const toggleFavorite = (trainNumber: string) => {
    if (favorites.includes(trainNumber)) {
      setFavorites(favorites.filter((t) => t !== trainNumber));
    } else {
      setFavorites([...favorites, trainNumber]);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. HOME SCREEN VIEW: Train Selection & Features Exploration
  if (currentView === 'HOME') {
    return (
      <>
        <HomeSelectView
          onSelectTrain={handleSelectTrainAndNavigate}
          favorites={favorites}
          recentSearches={recentSearches}
          onToggleFavorite={toggleFavorite}
        />
        <SearchPalette
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectTrain={handleSelectTrainAndNavigate}
          recentSearches={recentSearches}
        />
        <FeaturesHubModal
          isOpen={isFeaturesHubOpen}
          onClose={() => setIsFeaturesHubOpen(false)}
        />
      </>
    );
  }

  // Loading State when opening journey
  if (isLoadingJourney || !journey) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center text-[#6E6E73] gap-3">
        <div className="w-8 h-8 border-2 border-[#0A84FF] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[13px] tracking-wider uppercase text-[#1D1D1F] font-semibold">
          Loading Train {selectedTrainNumber} Journey...
        </span>
      </div>
    );
  }

  const { train, liveStatus } = journey;
  const isTrainFavorited = favorites.includes(train.trainNumber);

  // 2. MAIN JOURNEY TRACKING VIEW: Map Canvas, Station Timeline, Companion & Analytics
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D1D1F] flex flex-col font-sans">
      {/* Header Navigation Bar (Glass surface with hairline border) */}
      <header className="sticky top-0 z-40 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back to Train Selector and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('HOME')}
              className="p-2 -ml-2 rounded-full hover:bg-[#F5F5F7] text-[#1D1D1F] transition-colors flex items-center gap-1 text-[13px] font-medium"
              title="Return to Train Selection"
            >
              <ChevronLeft className="w-5 h-5 text-[#6E6E73]" />
              <span className="hidden sm:inline">Select Train</span>
            </button>

            <div className="h-4 w-px bg-[rgba(0,0,0,0.08)] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#0A84FF] flex items-center justify-center text-white shadow-sm font-bold text-xs">
                {train.trainNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold tracking-tight text-[#1D1D1F] leading-none">
                    {train.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#30B158]/12 text-[#30B158] font-semibold">
                    ON TIME
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Search & Switcher Bar */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-sm hidden md:flex items-center justify-between px-3.5 h-10 rounded-[10px] bg-[#F5F5F7] border border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.12)] hover:bg-[#EBEBED] transition-all text-[13px] text-[#6E6E73] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#6E6E73]" />
              <span>Switch train (e.g. 12009)...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#6E6E73] bg-[#FFFFFF] rounded border border-[rgba(0,0,0,0.08)]">
              /
            </kbd>
          </button>

          {/* Action cluster: Features Hub, Favorites, Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFeaturesHubOpen(true)}
              className="px-3 h-9 rounded-full bg-[#0A84FF]/10 hover:bg-[#0A84FF]/15 text-[#0A84FF] text-[12px] font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Features Hub</span>
            </button>

            <button
              onClick={() => toggleFavorite(train.trainNumber)}
              className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${
                isTrainFavorited
                  ? 'bg-[#FF9F0A]/15 text-[#FF9F0A]'
                  : 'bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F]'
              }`}
              title={isTrainFavorited ? 'Remove Favorite' : 'Save to Favorites'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-[13px] font-medium flex items-center gap-1.5 transition-all active:scale-98"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#30B158]" />
                  <span className="text-[#30B158] font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#1D1D1F]" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Drawer (Stations & Telemetry) + Right Map Canvas */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Live Telemetry, Stations & Companion */}
        <section className="lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1">
          {/* Active Train Status Card */}
          <div className="p-5 rounded-[20px] bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-bold font-mono tracking-tight text-[#1D1D1F]">{train.trainNumber}</span>
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#30B158]/12 text-[#30B158] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#30B158] animate-pulse" />
                    On time
                  </span>
                </div>
                <h2 className="text-[15px] font-medium text-[#6E6E73] mt-0.5">{train.name}</h2>
              </div>

              <div className="text-right">
                <span className="text-[12px] font-mono text-[#6E6E73] flex items-center justify-end gap-1">
                  <RefreshCw className="w-3 h-3 text-[#A1A1A6] animate-spin" style={{ animationDuration: '10s' }} />
                  {liveStatus.lastUpdatedAt}
                </span>
                <span className="text-[11px] font-mono text-[#0A84FF] block mt-0.5 font-medium">
                  RailRadar Verified
                </span>
              </div>
            </div>

            {/* Next Stop Live Focus Bar */}
            <div className="p-4 rounded-[14px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[11px] font-mono text-[#6E6E73] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#0A84FF] animate-pulse" />
                  <span>Approaching Station</span>
                </div>
                <span className="text-[13px] font-mono font-bold text-[#0A84FF]">
                  ETA {liveStatus.etaNextStation}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[17px] font-bold text-[#1D1D1F]">{liveStatus.nextStation.name}</span>
                  <span className="text-[13px] font-mono text-[#6E6E73] ml-1.5">({liveStatus.nextStation.code})</span>
                </div>
                <div className="text-[12px] font-mono font-medium text-[#6E6E73]">
                  Platform 2
                </div>
              </div>
            </div>

            {/* Journey Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-[12px] font-mono text-[#6E6E73] mb-2">
                <span>{liveStatus.distanceCoveredKm} km covered</span>
                <span className="text-[#0A84FF] font-semibold">{liveStatus.progressPercent}% complete</span>
                <span>{liveStatus.distanceRemainingKm} km remaining</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E5E5EA] overflow-hidden relative">
                <div
                  className="h-full bg-[#0A84FF] rounded-full transition-all duration-500"
                  style={{ width: `${liveStatus.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Route endpoints */}
            <div className="mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-[13px] text-[#6E6E73]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1D1D1F]">{train.origin.code}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A1A1A6]" />
                <span className="font-semibold text-[#1D1D1F]">{train.destination.code}</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[12px]">
                <Clock className="w-3.5 h-3.5 text-[#A1A1A6]" />
                <span>Dest. ETA: {liveStatus.destinationEta}</span>
              </div>
            </div>
          </div>

          {/* Segmented Navigation Tabs */}
          <div className="flex p-1 rounded-[12px] bg-[#F5F5F7] border border-[rgba(0,0,0,0.06)] text-[13px] font-medium">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-1.5 rounded-[9px] transition-all ${
                activeTab === 'timeline'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Station Timeline
            </button>
            <button
              onClick={() => setActiveTab('companion')}
              className={`flex-1 py-1.5 rounded-[9px] transition-all ${
                activeTab === 'companion'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Travel Companion
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-1.5 rounded-[9px] transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Analytics & Elevation
            </button>
          </div>

          {/* Tab Panes */}
          <div className="p-5 rounded-[20px] bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] min-h-[350px]">
            {activeTab === 'timeline' && (
              <StationTimeline
                stops={journey.stops}
                currentStationCode={liveStatus.nextStation.code}
              />
            )}
            {activeTab === 'companion' && (
              <TravelCompanion
                weather={journey.weather}
                nearbyFeatures={journey.nearbyFeatures}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsPanel
                distanceCoveredKm={liveStatus.distanceCoveredKm}
                distanceRemainingKm={liveStatus.distanceRemainingKm}
                totalDistanceKm={train.totalDistanceKm}
                speedKmh={simulatedSpeed}
                elevationProfile={journey.elevationProfile}
              />
            )}
          </div>
        </section>

        {/* Right Column (7 cols): Immersive Dark Map Canvas */}
        <section className="lg:col-span-7 h-[440px] lg:h-[calc(100vh-6.5rem)] rounded-[24px] overflow-hidden border border-[rgba(0,0,0,0.08)] shadow-[0_8px_24px_rgba(0,0,0,0.08)] relative order-1 lg:order-2">
          <JourneyMap
            journey={journey}
            isFollowMode={isFollowMode}
            onToggleFollow={() => setIsFollowMode(!isFollowMode)}
            speedKmh={simulatedSpeed}
          />
        </section>
      </main>

      {/* Global Modals */}
      <SearchPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTrain={handleSelectTrainAndNavigate}
        recentSearches={recentSearches}
      />

      <FeaturesHubModal
        isOpen={isFeaturesHubOpen}
        onClose={() => setIsFeaturesHubOpen(false)}
      />
    </div>
  );
};
