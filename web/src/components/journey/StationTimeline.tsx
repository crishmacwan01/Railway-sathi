import React from 'react';
import { TrainStop } from '../../types/railway';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';

interface StationTimelineProps {
  stops: TrainStop[];
  currentStationCode: string;
}

export const StationTimeline: React.FC<StationTimelineProps> = ({
  stops,
  currentStationCode,
}) => {
  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E5EA]">
      {stops.map((stop) => {
        const isPassed = stop.status === 'PASSED';
        const isNext = stop.station.code === currentStationCode;

        return (
          <div key={stop.station.code} className="relative group">
            {/* Timeline node dot (design.md: white circle with colored stroke) */}
            <div
              className={`absolute -left-6 top-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isNext
                  ? 'bg-[#0A84FF] text-white ring-4 ring-[#0A84FF]/20 shadow-md'
                  : isPassed
                  ? 'bg-[#FFFFFF] border-2 border-[#0A84FF] text-[#0A84FF]'
                  : 'bg-[#FFFFFF] border-2 border-[#C7C7CC] text-[#A1A1A6]'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0A84FF]" />
              ) : isNext ? (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[#C7C7CC]" />
              )}
            </div>

            {/* Station row card (design.md: white/raised surface, hairline border, soft hover) */}
            <div
              className={`p-3.5 rounded-[14px] transition-all border ${
                isNext
                  ? 'bg-[#FFFFFF] border-[#0A84FF]/40 shadow-[0_4px_16px_rgba(10,132,255,0.12)]'
                  : 'bg-[#FBFBFD] border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.12)] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-[#1D1D1F]">
                      {stop.station.name}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#F5F5F7] text-[#6E6E73] border border-[rgba(0,0,0,0.06)]">
                      {stop.station.code}
                    </span>
                    {stop.platform && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-semibold">
                        Platform {stop.platform}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#6E6E73] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A1A1A6]" />
                    <span>{stop.station.city}, {stop.station.state}</span>
                    <span className="text-[#C7C7CC]">•</span>
                    <span className="font-mono">{stop.distanceFromOriginKm} km</span>
                  </div>
                </div>

                {/* Timing stats with tabular numbers */}
                <div className="text-right font-mono">
                  {isPassed ? (
                    <div>
                      <div className="text-[13px] text-[#1D1D1F] font-semibold">
                        Dep {stop.actualDeparture || stop.scheduledDeparture}
                      </div>
                      <div className="text-[11px] text-[#30B158] font-medium flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>On time</span>
                      </div>
                    </div>
                  ) : isNext ? (
                    <div>
                      <div className="text-[13px] font-bold text-[#0A84FF]">
                        ETA {stop.estimatedArrival || stop.scheduledArrival}
                      </div>
                      <div className="text-[11px] text-[#6E6E73] mt-0.5">
                        Sched {stop.scheduledArrival}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[13px] text-[#6E6E73]">
                        {stop.scheduledArrival}
                      </div>
                      <div className="text-[11px] text-[#A1A1A6]">
                        Dep {stop.scheduledDeparture}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
