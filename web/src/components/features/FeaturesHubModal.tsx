import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Activity, 
  CloudSun, 
  Layers, 
  ShieldCheck, 
  Bell, 
  Share2, 
  Radio, 
  Wifi, 
  Train, 
  Coffee,
  Volume2
} from 'lucide-react';

export const FeaturesHubModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'TRACKING' | 'TRAVEL' | 'TERRAIN'>('ALL');

  if (!isOpen) return null;

  const features = [
    {
      id: 'f1',
      title: 'Real-Time Train GPS Tracking',
      desc: 'Authoritative RailRadar data streams with smooth vector interpolation between GPS pings.',
      category: 'TRACKING',
      icon: Radio,
      badge: 'Live Core',
      color: '#0A84FF'
    },
    {
      id: 'f2',
      title: 'Interactive Route Corridor Map',
      desc: 'MapLibre WebGL India basemap with dual glowing halo segments, 3D tilt, and dynamic heading follow mode.',
      category: 'TRACKING',
      icon: Layers,
      badge: 'Interactive',
      color: '#0A84FF'
    },
    {
      id: 'f3',
      title: 'OpenTopography Elevation Profiles',
      desc: 'Topographic elevation cross-section charts showing altitude changes, mountain ghats, and high-point peaks.',
      category: 'TERRAIN',
      icon: Activity,
      badge: 'Geospatial',
      color: '#30B158'
    },
    {
      id: 'f4',
      title: 'Station Weather Intelligence',
      desc: 'Automated temperature, humidity, wind speed, and rain probability forecasts for upcoming halts.',
      category: 'TRAVEL',
      icon: CloudSun,
      badge: 'OpenWeather',
      color: '#FF9F0A'
    },
    {
      id: 'f5',
      title: 'Geographic Route Radar (Overpass/OSM)',
      desc: 'Corridor proximity alerts for nearby historic rivers, bridges, scenic mountain passes, and railway landmarks.',
      category: 'TERRAIN',
      icon: Compass,
      badge: 'OpenStreetMap',
      color: '#30B158'
    },
    {
      id: 'f6',
      title: 'Read-only Live Journey Sharing',
      desc: 'Generate secure, zero-PII share links for family members to follow your train journey in real-time.',
      category: 'TRAVEL',
      icon: Share2,
      badge: 'Shareable',
      color: '#0A84FF'
    },
    {
      id: 'f7',
      title: 'Offline GPS Cache & Stale Detection',
      desc: 'Clear indicators for LIVE vs STALE vs ESTIMATED telemetry; keeps route and stop timetable cached.',
      category: 'TRACKING',
      icon: Wifi,
      badge: 'Reliability',
      color: '#6E6E73'
    },
    {
      id: 'f8',
      title: 'Station Platform & Halt Timetable',
      desc: 'Right-time schedule, actual departure/arrival tracking, platform numbers, and distance offsets.',
      category: 'TRACKING',
      icon: Train,
      badge: 'Timetable',
      color: '#0A84FF'
    }
  ];

  const filtered = features.filter(
    (f) => activeCategory === 'ALL' || f.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[4px] animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-[24px] bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between bg-[#FBFBFD]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-bold text-[#1D1D1F]">RailGaadi Features & Intelligence</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-semibold">
                PRD Spec
              </span>
            </div>
            <p className="text-[13px] text-[#6E6E73] mt-0.5">Explore the comprehensive suite of tools built into RailGaadi</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] flex items-center justify-center text-sm font-semibold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-[rgba(0,0,0,0.06)] flex items-center gap-2 bg-white">
          {(['ALL', 'TRACKING', 'TERRAIN', 'TRAVEL'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#0A84FF] text-white shadow-sm'
                  : 'bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#6E6E73]'
              }`}
            >
              {cat === 'ALL' ? 'All Features' : cat}
            </button>
          ))}
        </div>

        {/* Features List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 rounded-[16px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.12)] hover:bg-[#FFFFFF] transition-all flex items-start gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <div 
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[14px] font-semibold text-[#1D1D1F]">{item.title}</h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] border border-[rgba(0,0,0,0.06)] font-medium">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6E6E73] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[rgba(0,0,0,0.08)] bg-[#FBFBFD] flex items-center justify-between text-[12px] text-[#6E6E73]">
          <span>Designed with Apple Maps clarity & Linear precision</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-[10px] bg-[#0A84FF] text-white font-medium hover:bg-[#0071E3] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
