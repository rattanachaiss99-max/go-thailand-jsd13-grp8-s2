'use client';

import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Polygon,
  Tooltip,
  useMap
} from 'react-leaflet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MapPointFeature, MapLineFeature, MapAreaFeature } from '@/data/provinceMapData';

export interface OsmMapCanvasProps {
  center: [number, number];
  zoom: number;
  tileStyle: 'satellite' | 'street';
  showPoints: boolean;
  showLines: boolean;
  showAreas: boolean;
  points: MapPointFeature[];
  lines: MapLineFeature[];
  areas: MapAreaFeature[];
  activeTrailRoadIds?: string[];
  activeTrailPoiIds?: string[];
  selectedFeatureId?: string | null;
  onSelectFeature: (feature: { type: 'point' | 'line' | 'area'; data: any }) => void;
  onSelectRoad?: (roadInfo: { hwy: string; name: string }) => void;
  height?: string | number;
}

// Controller component to smoothly fly/pan when province center or zoom changes
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);

  return null;
}

export default function OsmMapCanvas({
  center,
  zoom,
  tileStyle,
  showPoints,
  showLines,
  showAreas,
  points,
  lines,
  areas,
  activeTrailRoadIds = [],
  activeTrailPoiIds = [],
  selectedFeatureId,
  onSelectFeature,
  onSelectRoad,
  height = '540px'
}: OsmMapCanvasProps) {
  const isSatellite = tileStyle === 'satellite';

  // Extract junction nodes from lines to replicate the OpenStreetMap iD editor's white node dots
  const roadNodes = useMemo(() => {
    const nodes: Array<{ id: string; position: [number, number]; roadName: string }> = [];
    lines.forEach((line) => {
      line.coordinates.forEach((coord, idx) => {
        nodes.push({
          id: `${line.id}-node-${idx}`,
          position: coord,
          roadName: line.name
        });
      });
    });
    return nodes;
  }, [lines]);

  return (
    <Box sx={{ width: '100%', height, position: 'relative', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <MapViewController center={center} zoom={zoom} />

        {/* Base Tile Layer: Satellite (Esri/Bing-like) vs OpenStreetMap Standard */}
        {isSatellite ? (
          <>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            {/* Reference labels overlay for satellite view */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
              opacity={0.7}
            />
          </>
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* LAYER 1: Areas (Polygons - Districts, National Parks, Landuse) */}
        {showAreas &&
          areas.map((area) => {
            const isSelected = selectedFeatureId === area.id;
            return (
              <Polygon
                key={area.id}
                positions={area.coordinates}
                pathOptions={{
                  color: isSelected ? '#38bdf8' : area.strokeColor || '#22c55e',
                  fillColor: isSelected ? '#38bdf8' : area.fillColor || '#22c55e',
                  fillOpacity: isSelected ? 0.35 : 0.22,
                  weight: isSelected ? 3 : 2,
                  dashArray: '5, 5'
                }}
                eventHandlers={{
                  click: () => onSelectFeature({ type: 'area', data: area })
                }}
              >
                <Tooltip direction="center" permanent={false} opacity={0.9}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    ⬡ {area.name}
                  </Typography>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* LAYER 2: Road Underlay Casing (for crisp OpenStreetMap look) */}
        {showLines &&
          lines.map((line) => {
            if (line.type === 'river') return null;
            return (
              <Polyline
                key={`casing-${line.id}`}
                positions={line.coordinates}
                pathOptions={{
                  color: '#334155',
                  weight: 7,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            );
          })}

        {/* LAYER 3: Road Foreground Lines (Yellow/Orange OSM Style) */}
        {showLines &&
          lines.map((line) => {
            const isActive = line.id && activeTrailRoadIds.includes(line.id);
            const isSelected = selectedFeatureId === line.id;
            const lineColor =
              line.type === 'river'
                ? '#38bdf8'
                : isActive
                  ? '#0284c7'
                  : isSelected
                    ? '#38bdf8'
                    : line.type === 'primary'
                      ? '#facc15' // OSM Yellow Road
                      : '#fb923c';

            return (
              <Polyline
                key={line.id}
                positions={line.coordinates}
                pathOptions={{
                  color: lineColor,
                  weight: line.type === 'river' ? 5 : isActive ? 6 : 5,
                  opacity: 0.95,
                  dashArray: isActive ? '10, 6' : undefined,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
                eventHandlers={{
                  click: () => {
                    onSelectFeature({ type: 'line', data: line });
                    if (onSelectRoad && line.hwy) {
                      onSelectRoad({ hwy: line.hwy, name: line.name });
                    }
                  }
                }}
              >
                <Tooltip sticky direction="top" opacity={0.95}>
                  <Box sx={{ p: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      {line.type === 'river' ? '🌊' : '🛣️'} {line.name}
                    </Typography>
                    {line.hwy && (
                      <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700 }}>
                        ทางหลวงหมายเลข {line.hwy}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              </Polyline>
            );
          })}

        {/* LAYER 4: OpenStreetMap iD White Junction Nodes */}
        {showLines &&
          roadNodes.map((node) => (
            <CircleMarker
              key={node.id}
              center={node.position}
              radius={4}
              pathOptions={{
                color: '#475569',
                fillColor: '#ffffff',
                fillOpacity: 1,
                weight: 1.5
              }}
            />
          ))}

        {/* LAYER 5: Points (POIs / Landmarks with OSM Pin Style) */}
        {showPoints &&
          points.map((pt) => {
            const isActive = pt.id && activeTrailPoiIds.includes(pt.id);
            const isSelected = selectedFeatureId === pt.id;
            const fillColor = isActive
              ? '#7c3aed'
              : isSelected
                ? '#0284c7'
                : pt.category === 'temple'
                  ? '#8b5cf6'
                  : pt.category === 'cafe'
                    ? '#0284c7'
                    : pt.category === 'viewpoint'
                      ? '#ea580c'
                      : '#e11d48';

            return (
              <CircleMarker
                key={pt.id}
                center={pt.coordinates}
                radius={isActive || isSelected ? 10 : 8}
                pathOptions={{
                  color: '#ffffff',
                  fillColor,
                  fillOpacity: 1,
                  weight: 3
                }}
                eventHandlers={{
                  click: () => onSelectFeature({ type: 'point', data: pt })
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <Box sx={{ p: 0.5, maxWidth: 200 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      {pt.icon || '📍'} {pt.name}
                    </Typography>
                    {pt.district && (
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                        อ.{pt.district}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* OSM Custom Scale Bar (Matching the screenshot's "200 ม." indicator) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,0,0,0.2)',
          px: 1.2,
          py: 0.4,
          borderRadius: 1,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 4,
            borderLeft: '2px solid #0f172a',
            borderRight: '2px solid #0f172a',
            borderBottom: '2px solid #0f172a',
            mb: 0.3
          }}
        />
        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
          200 ม.
        </Typography>
      </Box>

      {/* Bing / OSM Attribution Badge matching the screenshot */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 12,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          px: 1,
          py: 0.3,
          borderRadius: 1,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600 }}>
          {isSatellite ? 'ภาพถ่ายทางอากาศ Bing Maps / Esri' : '© OpenStreetMap contributors'} • GoThailand Vector GIS
        </Typography>
      </Box>
    </Box>
  );
}
