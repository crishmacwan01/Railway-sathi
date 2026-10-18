import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Mountain, Gauge, Route } from 'lucide-react';

interface AnalyticsPanelProps {
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  totalDistanceKm: number;
  speedKmh: number;
  elevationProfile: { distanceKm: number; elevationM: number; stationName?: string }[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  distanceCoveredKm,
  distanceRemainingKm,
  totalDistanceKm,
  speedKmh,
  elevationProfile,
}) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards (design.md §6: 16-20 padding, --shadow-1, hover: translateY(-1px) & --shadow-2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-[16px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
          <div className="text-[11px] font-mono font-medium text-[#6E6E73] flex items-center gap-1.5 mb-1">
            <Route className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Covered</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#1D1D1F]">
            {distanceCoveredKm} <span className="text-xs text-[#6E6E73] font-sans font-normal">km</span>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
          <div className="text-[11px] font-mono font-medium text-[#6E6E73] flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-[#30B158]" />
            <span>Remaining</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#1D1D1F]">
            {distanceRemainingKm} <span className="text-xs text-[#6E6E73] font-sans font-normal">km</span>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
          <div className="text-[11px] font-mono font-medium text-[#6E6E73] flex items-center gap-1.5 mb-1">
            <Gauge className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Speed</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#1D1D1F]">
            {speedKmh} <span className="text-xs text-[#6E6E73] font-sans font-normal">km/h</span>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
          <div className="text-[11px] font-mono font-medium text-[#6E6E73] flex items-center gap-1.5 mb-1">
            <Mountain className="w-3.5 h-3.5 text-[#FF9F0A]" />
            <span>Peak Elevation</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#1D1D1F]">
            493 <span className="text-xs text-[#6E6E73] font-sans font-normal">m</span>
          </div>
        </div>
      </div>

      {/* Elevation Profile Chart (design.md: single-hue line in --accent #0A84FF, 12% fill, hairline gridlines, glass tooltip) */}
      <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-[#0A84FF]" />
            <span className="text-[12px] font-mono font-semibold text-[#1D1D1F] uppercase tracking-wider">
              Route Elevation Profile (OpenTopography)
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#6E6E73]">
            Total {totalDistanceKm} km
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={elevationProfile} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#0A84FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="distanceKm" 
                stroke="#C7C7CC" 
                tick={{ fill: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }} 
                tickFormatter={(val) => `${val}km`}
              />
              <YAxis 
                stroke="#C7C7CC" 
                tick={{ fill: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }} 
                tickFormatter={(val) => `${val}m`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-[10px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_8px_24px_rgba(0,0,0,0.08)] font-mono text-xs">
                        <div className="text-[#1D1D1F] font-semibold">
                          {data.stationName ? `${data.stationName} • ` : ''}{data.elevationM} meters
                        </div>
                        <div className="text-[#6E6E73] text-[11px] mt-0.5">
                          At {data.distanceKm} km along corridor
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="elevationM" 
                stroke="#0A84FF" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#elevationGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
