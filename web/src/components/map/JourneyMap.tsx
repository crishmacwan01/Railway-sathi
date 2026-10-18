import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { TrainJourneyData } from '../../types/railway';
import { Navigation, Compass, Layers, Maximize2, ShieldCheck, Play, Pause, LocateFixed, Eye } from 'lucide-react';

interface JourneyMapProps {
  journey: TrainJourneyData;
  isFollowMode: boolean;
  onToggleFollow: () => void;
  speedKmh: number;
}

// 100% Reliable MapLibre Raster Style Specifications
const MAP_STYLE_SPECS: Record<'DARK' | 'STREETS' | 'HYBRID', maplibregl.StyleSpecification> = {
  DARK: {
    version: 8,
    sources: {
      'dark-basemap': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
          'https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
          'https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© CARTO, © OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'dark-tiles-layer',
        type: 'raster',
        source: 'dark-basemap',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  STREETS: {
    version: 8,
    sources: {
      'streets-basemap': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© CARTO, © OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'streets-tiles-layer',
        type: 'raster',
        source: 'streets-basemap',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  HYBRID: {
    version: 8,
    sources: {
      'satellite-basemap': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '© Google Maps'
      }
    },
    layers: [
      {
        id: 'satellite-tiles-layer',
        type: 'raster',
        source: 'satellite-basemap',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  }
};

/**
 * Highly detailed Miniature 3D Locomotive SVG (Vande Bharat / WAP-7 inspired)
 * Includes aerodynamic nose, glass cockpit reflection, forward LED light beam,
 * roof pantograph/vents, and a soft 3D elevation shadow.
 */
function buildMiniature3DTrainSvg(): string {
  return `
<svg viewBox="0 0 54 104" width="54" height="104" fill="none" xmlns="http://www.w3.org/2000/svg" class="select-none filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)]">
  <defs>
    <!-- Forward Headlight Light Beam Cone -->
    <linearGradient id="beam-grad" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.95)" />
      <stop offset="25%" stop-color="rgba(77, 163, 255, 0.55)" />
      <stop offset="65%" stop-color="rgba(10, 132, 255, 0.2)" />
      <stop offset="100%" stop-color="rgba(10, 132, 255, 0)" />
    </linearGradient>

    <!-- Metallic 3D Body Shading -->
    <linearGradient id="body-silver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#CBD5E1" />
      <stop offset="22%" stop-color="#FFFFFF" />
      <stop offset="65%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Windshield Tint -->
    <linearGradient id="cab-glass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0A1220" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>

    <!-- Headlight Specular Flare -->
    <filter id="headlight-flare" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#FFFFFF" flood-opacity="1" />
      <feDropShadow dx="0" dy="0" stdDeviation="5.5" flood-color="#0A84FF" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- 1. Forward Cast Headlight Beam Projection onto the Rails -->
  <polygon points="22,30 6,0 48,0 32,30" fill="url(#beam-grad)" opacity="0.9" />

  <!-- 2. Underside 3D Cast Shadow (Elevates train above tracks) -->
  <rect x="15" y="26" width="24" height="70" rx="12" fill="rgba(0,0,0,0.45)" filter="blur(3px)" />

  <!-- 3. Aerodynamic High-Speed Locomotive Hull -->
  <path d="M 16,40 C 16,25 20,19 27,19 C 34,19 38,25 38,40 L 38,88 C 38,93 34,96 27,96 C 20,96 16,93 16,88 Z" 
        fill="url(#body-silver)" 
        stroke="#475569" 
        stroke-width="1.1" />

  <!-- 4. Signature Speed Stripes (Electric Blue & Navy) -->
  <path d="M 16.5,44 L 16.5,88 C 16.5,91 19,93 21,93 L 21,44 Z" fill="#0A84FF" />
  <path d="M 37.5,44 L 37.5,88 C 37.5,91 35,93 33,93 L 33,44 Z" fill="#0056B3" />

  <!-- 5. Front Nose Aerodynamic Chevron -->
  <path d="M 24,20.5 L 27,19 L 30,20.5 L 28.5,29 L 25.5,29 Z" fill="#0A84FF" />

  <!-- 6. Aerodynamic Panoramic Pilot Cockpit Windshield -->
  <path d="M 19,32 C 19,25 22,22 27,22 C 32,22 35,25 35,32 C 35,34.5 19,34.5 19,32 Z" 
        fill="url(#cab-glass)" 
        stroke="#1E293B" 
        stroke-width="0.8" />
  <!-- Windshield Specular Reflection Glare -->
  <path d="M 21,29 C 22.5,25.5 25,23.5 28,23.5" 
        stroke="rgba(255,255,255,0.9)" 
        stroke-width="1.4" 
        stroke-linecap="round" 
        fill="none" />

  <!-- 7. Dual High-Intensity LED Headlights -->
  <circle cx="21" cy="23.5" r="2.2" fill="#FFFFFF" filter="url(#headlight-flare)" />
  <circle cx="33" cy="23.5" r="2.2" fill="#FFFFFF" filter="url(#headlight-flare)" />

  <!-- 8. Rooftop HVAC / Power Inverter Unit (3D Louvers) -->
  <rect x="21" y="48" width="12" height="24" rx="2.5" fill="#64748B" stroke="#334155" stroke-width="0.8" />
  <line x1="22.5" y1="53" x2="31.5" y2="53" stroke="#334155" stroke-width="1.1" />
  <line x1="22.5" y1="58" x2="31.5" y2="58" stroke="#334155" stroke-width="1.1" />
  <line x1="22.5" y1="63" x2="31.5" y2="63" stroke="#334155" stroke-width="1.1" />
  <line x1="22.5" y1="68" x2="31.5" y2="68" stroke="#334155" stroke-width="1.1" />

  <!-- 9. High-Voltage Rooftop Pantograph Diamond Assembly -->
  <path d="M 24.5,78 L 27,76 L 29.5,78 L 27,80 Z" fill="none" stroke="#EF4444" stroke-width="1.3" />
  <line x1="23" y1="76" x2="31" y2="76" stroke="#F59E0B" stroke-width="1.3" stroke-linecap="round" />
  <circle cx="27" cy="78" r="1.3" fill="#EF4444" />
</svg>
`;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  journey,
  isFollowMode,
  onToggleFollow,
  speedKmh,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const singleTrainMarkerRef = useRef<maplibregl.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [mapStyleType, setMapStyleType] = useState<'DARK' | 'STREETS' | 'HYBRID'>('DARK');
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);

  // Parse track line and calculate route metrics
  const routeLine = useMemo(() => {
    const coords = journey.routeGeoJson?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length > 1) {
      return turf.lineString(coords as any);
    }
    return null;
  }, [journey.routeGeoJson]);

  const totalTrackKm = useMemo(() => {
    if (!routeLine) return 1000;
    return turf.length(routeLine, { units: 'kilometers' }) || 1000;
  }, [routeLine]);

  // Verified real train position along track (in kilometers)
  const initialAnchorKm = useMemo(() => {
    if (!routeLine) return totalTrackKm * 0.35;
    try {
      const pos = journey.liveStatus?.position;
      if (pos && typeof pos.lng === 'number' && typeof pos.lat === 'number' && !isNaN(pos.lng) && !isNaN(pos.lat)) {
        const pt = turf.point([pos.lng, pos.lat]);
        const snapped = turf.nearestPointOnLine(routeLine, pt, { units: 'kilometers' });
        if (snapped?.properties?.location) {
          return Math.max(1, Math.min(totalTrackKm - 1, snapped.properties.location));
        }
      }
      const pct = (journey.liveStatus?.progressPercent || 35) / 100;
      return Math.max(1, Math.min(totalTrackKm - 1, totalTrackKm * pct));
    } catch {
      return totalTrackKm * 0.35;
    }
  }, [journey, routeLine, totalTrackKm]);

  // Active track distance of the train (anchored strictly to real location)
  const [currentDistKm, setCurrentDistKm] = useState<number>(initialAnchorKm);

  // Sync anchor whenever train changes
  useEffect(() => {
    setCurrentDistKm(initialAnchorKm);
  }, [initialAnchorKm]);

  // 1. Initialize MapLibre Canvas
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialLng = Number(journey.liveStatus?.position?.lng) || 72.82;
    const initialLat = Number(journey.liveStatus?.position?.lat) || 18.97;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE_SPECS[mapStyleType],
      center: [initialLng, initialLat],
      zoom: 7.5,
      pitch: 28,
      bearing: 0,
      attributionControl: false
    });

    mapRef.current = map;

    const resizeTimer = setTimeout(() => {
      try {
        map.resize();
      } catch {
        // ignore
      }
    }, 200);

    const onStyleReady = () => {
      renderRouteAndStationPins(map);
      updateOrPositionTrain(map, currentDistKm);
    };

    map.on('load', onStyleReady);
    map.on('style.load', onStyleReady);

    return () => {
      clearTimeout(resizeTimer);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (singleTrainMarkerRef.current) singleTrainMarkerRef.current.remove();
      singleTrainMarkerRef.current = null;
      map.remove();
    };
  }, [journey.train.trainNumber]);

  // 2. Switch Map Style (Dark Rails, Street Map, Satellite)
  const switchMapStyle = (newType: 'DARK' | 'STREETS' | 'HYBRID') => {
    if (newType === mapStyleType || !mapRef.current) return;
    setMapStyleType(newType);
    const map = mapRef.current;

    map.once('style.load', () => {
      renderRouteAndStationPins(map);
      updateOrPositionTrain(map, currentDistKm);
    });

    try {
      map.setStyle(MAP_STYLE_SPECS[newType]);
    } catch (err) {
      console.warn('Map style switch error:', err);
    }
  };

  // 3. Render Route Track & Clean Station Nodes
  const renderRouteAndStationPins = (map: maplibregl.Map) => {
    // Clear old station markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Fit route bounds smoothly
    const coords = journey.routeGeoJson?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length > 1) {
      try {
        const bounds = new maplibregl.LngLatBounds();
        for (const coord of coords) {
          if (Array.isArray(coord) && !isNaN(coord[0]) && !isNaN(coord[1])) {
            bounds.extend(coord as [number, number]);
          }
        }
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 64, maxZoom: 9.5, duration: 800 });
        }
      } catch (err) {
        console.warn('fitBounds error:', err);
      }
    }

    // Add Route GeoJSON Source & Layers
    try {
      if (!map.getSource('rail-route')) {
        map.addSource('rail-route', {
          type: 'geojson',
          data: journey.routeGeoJson
        });
      }

      // Outer route glow
      if (!map.getLayer('rail-route-glow')) {
        map.addLayer({
          id: 'rail-route-glow',
          type: 'line',
          source: 'rail-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0A84FF',
            'line-width': 12,
            'line-opacity': 0.35,
            'line-blur': 6
          }
        });
      }

      // Primary railway track corridor
      if (!map.getLayer('rail-route-line')) {
        map.addLayer({
          id: 'rail-route-line',
          type: 'line',
          source: 'rail-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0A84FF',
            'line-width': 4.5,
            'line-opacity': 0.95
          }
        });
      }

      // High-speed rail center core
      if (!map.getLayer('rail-route-core')) {
        map.addLayer({
          id: 'rail-route-core',
          type: 'line',
          source: 'rail-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FFFFFF',
            'line-width': 1.6,
            'line-opacity': 0.85
          }
        });
      }
    } catch (err) {
      console.warn('Route layer addition error:', err);
    }

    // Station Nodes: Clean, distinct milestones (NO pulsing duplicate marker!)
    const totalStops = journey.stops.length;
    journey.stops.forEach((stop, idx) => {
      const sLng = Number(stop.station?.location?.lng);
      const sLat = Number(stop.station?.location?.lat);
      if (isNaN(sLng) || isNaN(sLat) || sLng === 0 || sLat === 0) return;

      const isOrigin = idx === 0;
      const isDestination = idx === totalStops - 1;
      const isPassed = stop.status === 'PASSED';
      const isNext = stop.station.code === journey.liveStatus.nextStation?.code;

      const el = document.createElement('div');
      el.className = 'station-milestone-marker relative flex items-center justify-center cursor-pointer group';

      // Sleek station node with distinct hub styling
      let nodeHtml = '';
      if (isOrigin) {
        nodeHtml = `<div class="w-3.5 h-3.5 rounded-full bg-[#30B158] border-2 border-white shadow-md ring-2 ring-[#30B158]/50"></div>`;
      } else if (isDestination) {
        nodeHtml = `<div class="w-3.5 h-3.5 rounded-full bg-[#FF453A] border-2 border-white shadow-md ring-2 ring-[#FF453A]/50"></div>`;
      } else if (isNext) {
        // Clean upcoming halt badge - distinctly NOT a train
        nodeHtml = `<div class="w-3 h-3 rounded-full bg-[#FF9F0A] border-2 border-white shadow-md ring-2 ring-[#FF9F0A]/40"></div>`;
      } else {
        nodeHtml = `<div class="w-2.5 h-2.5 rounded-full ${
          isPassed ? 'bg-[#0A84FF]' : 'bg-[#C7C7CC]'
        } border-[1.5px] border-white/90 shadow-sm"></div>`;
      }

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${nodeHtml}
          <!-- Station Label Pill -->
          <div class="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap glass-dark-overlay px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-medium text-[#F5F5F7] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-sm pointer-events-none">
            ${isNext ? '<span class="text-[#FF9F0A] font-bold">NEXT • </span>' : ''}${stop.station.name} (${stop.station.code})
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([sLng, sLat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // 4. Position and Update the Miniature 3D Train Model
  const updateOrPositionTrain = (map: maplibregl.Map, distKm: number) => {
    if (!routeLine) return;

    try {
      const clampedKm = Math.max(0.2, Math.min(totalTrackKm - 0.2, distKm));
      const trainPt = turf.along(routeLine, clampedKm, { units: 'kilometers' });
      const [lng, lat] = trainPt.geometry.coordinates;

      // Bearing calculation along track curve
      const aheadPt = turf.along(routeLine, Math.min(totalTrackKm, clampedKm + 0.8), { units: 'kilometers' });
      const bearing = turf.bearing(trainPt, aheadPt);

      if (!singleTrainMarkerRef.current) {
        const trainContainer = document.createElement('div');
        trainContainer.className = 'miniature-3d-train-container relative flex items-center justify-center select-none cursor-pointer';
        trainContainer.style.width = '60px';
        trainContainer.style.height = '110px';

        trainContainer.innerHTML = `
          <!-- Floating Telemetry Glass Tag (stays upright) -->
          <div class="train-hud-pill absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
            <div class="glass-dark-overlay px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-xl border border-white/20">
              <span class="w-1.5 h-1.5 rounded-full bg-[#30B158] animate-pulse"></span>
              <span>${journey.train.trainNumber}</span>
              <span class="text-white/30">•</span>
              <span class="text-[#4DA3FF] tabular-nums font-semibold">${speedKmh} km/h</span>
            </div>
          </div>

          <!-- Miniature 3D Locomotive (rotates to track bearing) -->
          <div class="train-loco-rotator w-full h-full flex items-center justify-center transition-transform duration-150 ease-out" style="transform: rotate(${bearing}deg); transform-origin: 50% 50%;">
            ${buildMiniature3DTrainSvg()}
          </div>
        `;

        const marker = new maplibregl.Marker({ element: trainContainer, anchor: 'center' })
          .setLngLat([lng, lat])
          .addTo(map);

        singleTrainMarkerRef.current = marker;
      } else {
        singleTrainMarkerRef.current.setLngLat([lng, lat]);

        // Rotate the 3D locomotive to align exactly with track angle
        const rotator = singleTrainMarkerRef.current.getElement().querySelector('.train-loco-rotator') as HTMLElement;
        if (rotator) {
          rotator.style.transform = `rotate(${bearing}deg)`;
        }

        // Update speed in HUD pill
        const speedText = singleTrainMarkerRef.current.getElement().querySelector('.train-hud-pill .tabular-nums');
        if (speedText) {
          speedText.textContent = `${speedKmh} km/h`;
        }
      }

      // Smooth camera follow
      if (isFollowMode && map) {
        map.easeTo({
          center: [lng, lat],
          duration: 350
        });
      }
    } catch (err) {
      console.warn('Train positioning calculation error:', err);
    }
  };

  // 5. Realistic Smooth Train Flow Simulation (strictly stays on track corridor)
  useEffect(() => {
    if (!isPlayingMotion || !routeLine) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setCurrentDistKm(prevKm => {
        // Step forward by real speed (speed in km/s)
        const speedKms = (speedKmh || 105) / 3600;
        // 4x visual pacing gives smooth palpable forward glide along the rails
        const advanceKm = speedKms * deltaSec * 4;
        let nextKm = prevKm + advanceKm;

        // Loop gently within active corridor so train never skips ahead to destination prematurely
        if (nextKm >= totalTrackKm - 2) {
          nextKm = initialAnchorKm;
        }

        if (mapRef.current) {
          updateOrPositionTrain(mapRef.current, nextKm);
        }

        return nextKm;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlayingMotion, isFollowMode, speedKmh, routeLine, totalTrackKm, initialAnchorKm]);

  // Recenter and snap directly to train
  const handleRecenter = () => {
    if (!mapRef.current || !singleTrainMarkerRef.current) return;
    const pos = singleTrainMarkerRef.current.getLngLat();
    mapRef.current.flyTo({
      center: [pos.lng, pos.lat],
      zoom: 9.2,
      pitch: 35,
      essential: true
    });
    if (!isFollowMode) {
      onToggleFollow();
    }
  };

  // Snap train back to the real-time verified GPS anchor
  const handleSnapToLiveGps = () => {
    setCurrentDistKm(initialAnchorKm);
    if (mapRef.current) {
      updateOrPositionTrain(mapRef.current, initialAnchorKm);
      const pos = singleTrainMarkerRef.current?.getLngLat();
      if (pos) {
        mapRef.current.flyTo({
          center: [pos.lng, pos.lat],
          zoom: 9,
          pitch: 30,
          essential: true
        });
      }
    }
  };

  const progressPercent = Math.min(100, Math.max(1, Math.round((currentDistKm / totalTrackKm) * 100)));

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#0B0D12] overflow-hidden select-none">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '380px', height: '100%' }} />

      {/* Floating Telemetry & Controls Pill (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="glass-dark-overlay px-3.5 py-1.5 rounded-full flex items-center gap-2.5 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#30B158] animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-wider font-semibold text-[#F5F5F7] uppercase">3D Rail Radar</span>
          <span className="text-white/20">|</span>
          <span className="text-[11px] font-mono font-medium text-white tabular-nums">{speedKmh} km/h</span>
          <span className="text-white/20">|</span>
          <span className="text-[11px] font-mono text-[#4DA3FF] tabular-nums font-semibold">
            {Math.round(currentDistKm)} km ({progressPercent}%)
          </span>
        </div>

        {/* Snap to Real GPS Button */}
        <button
          onClick={handleSnapToLiveGps}
          className="glass-dark-overlay px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-medium text-white hover:bg-white/10 active:scale-95 transition-all shadow-md"
          title="Reset & Snap to exact Live GPS position"
        >
          <LocateFixed className="w-3.5 h-3.5 text-[#30B158]" />
          <span className="hidden sm:inline">Snap Live</span>
        </button>

        {/* Play / Pause Motion Flow */}
        <button
          onClick={() => setIsPlayingMotion(!isPlayingMotion)}
          className="glass-dark-overlay px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-medium text-white hover:bg-white/10 active:scale-95 transition-all shadow-md"
          title={isPlayingMotion ? 'Pause train movement' : 'Play smooth journey movement'}
        >
          {isPlayingMotion ? (
            <>
              <Pause className="w-3 h-3 text-[#4DA3FF]" />
              <span className="hidden sm:inline">Flowing</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-[#30B158]" />
              <span className="hidden sm:inline">Resume</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Basemap Style Switcher (Top-Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-1 p-1 rounded-full glass-dark-overlay shadow-2xl border border-white/10">
        {[
          { id: 'DARK', label: 'Dark Rails' },
          { id: 'STREETS', label: 'Street Map' },
          { id: 'HYBRID', label: 'Satellite' }
        ].map((style) => (
          <button
            key={style.id}
            onClick={() => switchMapStyle(style.id as any)}
            className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              mapStyleType === style.id
                ? 'bg-[#0A84FF] text-white shadow-md'
                : 'text-[#8E93A0] hover:text-white hover:bg-white/5'
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* Floating Map Action Controls (Right Side) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="w-9 h-9 rounded-full glass-dark-overlay hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
          title="Recenter on Miniature Train"
        >
          <Navigation className="w-4 h-4 text-[#4DA3FF]" />
        </button>

        <button
          onClick={onToggleFollow}
          className={`w-9 h-9 rounded-full glass-dark-overlay transition-all flex items-center justify-center active:scale-95 shadow-md ${
            isFollowMode ? 'ring-2 ring-[#0A84FF] text-[#4DA3FF]' : 'text-white hover:bg-white/10'
          }`}
          title={isFollowMode ? 'Follow Mode: Active' : 'Enable Follow Camera'}
        >
          <Compass className={`w-4 h-4 ${isFollowMode ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>

        <button
          onClick={() => {
            const next = mapStyleType === 'DARK' ? 'STREETS' : mapStyleType === 'STREETS' ? 'HYBRID' : 'DARK';
            switchMapStyle(next);
          }}
          className="w-9 h-9 rounded-full glass-dark-overlay hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
          title={`Cycle Basemap: Currently ${mapStyleType}`}
        >
          <Layers className="w-4 h-4 text-[#4DA3FF]" />
        </button>

        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          className="w-9 h-9 rounded-full glass-dark-overlay hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Live Corridor Tracking Badge */}
      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 text-[11px] font-mono glass-dark-overlay px-3.5 py-1 rounded-full text-[#8E93A0] shadow-lg">
        <ShieldCheck className="w-3.5 h-3.5 text-[#30B158]" />
        <span>Corridor Locked • {mapStyleType} Rendering Live</span>
      </div>
    </div>
  );
};
