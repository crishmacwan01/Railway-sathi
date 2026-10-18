import React from 'react';
import { StationWeather, GeoFeature } from '../../types/railway';
import { Cloud, CloudRain, Sun, Wind, Droplets, Compass, Landmark } from 'lucide-react';

interface TravelCompanionProps {
  weather: StationWeather[];
  nearbyFeatures: GeoFeature[];
}

export const TravelCompanion: React.FC<TravelCompanionProps> = ({
  weather,
  nearbyFeatures,
}) => {
  return (
    <div className="space-y-6">
      {/* Weather Section */}
      <div>
        <div className="text-[11px] font-mono font-semibold text-[#6E6E73] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>Station Weather Intelligence</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {weather.map((item) => (
            <div
              key={item.stationCode}
              className="p-3.5 rounded-[16px] bg-[#FBFBFD] border border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.12)] hover:bg-[#FFFFFF] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#6E6E73]">{item.stationName}</span>
                {item.icon === 'sun' ? (
                  <Sun className="w-4 h-4 text-[#FF9F0A]" />
                ) : item.icon === 'cloud-rain' ? (
                  <CloudRain className="w-4 h-4 text-[#0A84FF]" />
                ) : (
                  <Cloud className="w-4 h-4 text-[#6E6E73]" />
                )}
              </div>
              <div className="text-2xl font-bold font-mono text-[#1D1D1F] mb-1.5">
                {item.tempC}°<span className="text-[13px] font-normal text-[#6E6E73] font-sans">C</span>
              </div>
              <div className="text-[12px] text-[#6E6E73] mb-3">{item.condition}</div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6E73] border-t border-[rgba(0,0,0,0.06)] pt-2">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#0A84FF]" />
                  <span>{item.humidityPercent}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-[#6E6E73]" />
                  <span>{item.windKph} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenic / Geography Section */}
      <div>
        <div className="text-[11px] font-mono font-semibold text-[#6E6E73] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>Geographic Route Radar</span>
        </div>
        <div className="space-y-2.5">
          {nearbyFeatures.map((poi) => (
            <div
              key={poi.id}
              className="p-3.5 rounded-[16px] bg-[#FFFFFF] border border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.12)] flex items-start gap-3 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="p-2 rounded-[10px] bg-[#0A84FF]/10 text-[#0A84FF] shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#1D1D1F]">{poi.name}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-medium">
                    {poi.distanceFromRouteKm} km corridor
                  </span>
                </div>
                <p className="text-[13px] text-[#6E6E73] mt-1 leading-relaxed">{poi.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
