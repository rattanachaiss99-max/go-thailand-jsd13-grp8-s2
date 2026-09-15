'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { MapPointFeature, MapLineFeature, MapAreaFeature } from '@/data/provinceMapData';

export interface FeatureSearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  provinceName: string;
  searchQuery: string;
  onSearch: (q: string) => void;
  isSearching: boolean;
  searchResults: {
    points: MapPointFeature[];
    lines: MapLineFeature[];
    areas: MapAreaFeature[];
    source: 'vector' | 'keyword';
  } | null;
  selectedFeature: {
    type: 'point' | 'line' | 'area';
    data: any;
  } | null;
  onSelectFeature: (feature: { type: 'point' | 'line' | 'area'; data: any } | null) => void;
  allPoints: MapPointFeature[];
  allLines: MapLineFeature[];
  allAreas: MapAreaFeature[];
}

export default function FeatureSearchSidebar({
  isOpen,
  onClose,
  provinceName,
  searchQuery,
  onSearch,
  isSearching,
  searchResults,
  selectedFeature,
  onSelectFeature,
  allPoints,
  allLines,
  allAreas
}: FeatureSearchSidebarProps) {
  const [localInput, setLocalInput] = useState(searchQuery);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(localInput);
    }
  };

  const hasResults =
    searchResults &&
    (searchResults.points.length > 0 || searchResults.lines.length > 0 || searchResults.areas.length > 0);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 300, md: 320 },
        height: '100%',
        bgcolor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 20,
        boxShadow: '4px 0 16px rgba(0,0,0,0.04)',
        animation: 'slideInLeft 0.25s ease'
      }}
    >
      {/* Header matching OpenStreetMap iD: "ค้นหาคุณลักษณะ" */}
      <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
            ค้นหาคุณลักษณะ
          </Typography>
          <Chip
            label={provinceName}
            size="small"
            sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Stack>

        {/* Search Input Box with Search Icon */}
        <TextField
          fullWidth
          size="small"
          placeholder="🔍 ค้นหา (จุด, เส้นทาง, กาแฟ...)"
          value={localInput}
          onChange={(e) => {
            setLocalInput(e.target.value);
            if (!e.target.value) onSearch('');
          }}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isSearching ? (
                    <CircularProgress size={16} />
                  ) : localInput ? (
                    <Button
                      size="small"
                      onClick={() => onSearch(localInput)}
                      sx={{ minWidth: 28, p: 0.2, fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      ค้นหา
                    </Button>
                  ) : null}
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#f8fafc',
              fontSize: '0.85rem'
            }
          }}
        />

        {/* Vector DB status indicator */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10b981' }} />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
            {searchResults?.source === 'vector'
              ? '⚡ แสดงผลด้วย Vector Database Search'
              : 'เชื่อมต่อ MongoDB Vector Atlas'}
          </Typography>
        </Box>
      </Box>

      {/* Scrollable Content: Feature Inspector or Search List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* CASE 1: Feature Inspector (User clicked a point, line, or area) */}
        {selectedFeature ? (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Chip
                label={
                  selectedFeature.type === 'point'
                    ? '📍 จุดคุณลักษณะ'
                    : selectedFeature.type === 'line'
                      ? '🛣️ เส้นทางหลวง / สายน้ำ'
                      : '⬡ พื้นที่เขต'
                }
                size="small"
                sx={{
                  bgcolor:
                    selectedFeature.type === 'point'
                      ? '#fee2e2'
                      : selectedFeature.type === 'line'
                        ? '#ffedd5'
                        : '#d1fae5',
                  color:
                    selectedFeature.type === 'point'
                      ? '#ef4444'
                      : selectedFeature.type === 'line'
                        ? '#ea580c'
                        : '#059669',
                  fontWeight: 700,
                  fontSize: '0.7rem'
                }}
              />
              <Button
                size="small"
                onClick={() => onSelectFeature(null)}
                sx={{ fontSize: '0.72rem', color: '#94a3b8', minWidth: 40 }}
              >
                ✕ ปิด
              </Button>
            </Stack>

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: '0.95rem' }}>
              {selectedFeature.data.name}
            </Typography>

            {selectedFeature.data.nameEn && (
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                {selectedFeature.data.nameEn}
              </Typography>
            )}

            {/* Highway shield if applicable */}
            {selectedFeature.data.hwy && (
              <Box sx={{ my: 1 }}>
                <Chip
                  label={`ทางหลวงแผ่นดินหมายเลข ${selectedFeature.data.hwy}`}
                  size="small"
                  sx={{ bgcolor: '#0f172a', color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}
                />
              </Box>
            )}

            {/* Description */}
            <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.82rem', lineHeight: 1.6, my: 1 }}>
              {selectedFeature.data.description}
            </Typography>

            {/* Coordinates & District */}
            <Card
              variant="outlined"
              sx={{ p: 1.5, my: 1.5, bgcolor: '#f8fafc', borderRadius: 2, borderColor: '#e2e8f0' }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                ข้อมูลพิกัดเชิงเวกเตอร์:
              </Typography>
              {selectedFeature.type === 'point' && selectedFeature.data.coordinates && (
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#0284c7', display: 'block' }}>
                  Lat: {selectedFeature.data.coordinates[0].toFixed(4)}, Lng:{' '}
                  {selectedFeature.data.coordinates[1].toFixed(4)}
                </Typography>
              )}
              {selectedFeature.data.district && (
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                  อำเภอ: <strong>{selectedFeature.data.district}</strong>
                </Typography>
              )}
            </Card>

            {/* Tags */}
            {selectedFeature.data.tags && (
              <Stack direction="row" spacing={0.6} flexWrap="wrap" sx={{ mt: 1 }}>
                {selectedFeature.data.tags.map((t: string) => (
                  <Chip
                    key={t}
                    label={`#${t}`}
                    size="small"
                    sx={{ fontSize: '0.68rem', bgcolor: '#f1f5f9', color: '#475569' }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        ) : searchResults ? (
          /* CASE 2: Search Results List */
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>
              ผลลัพธ์การค้นหา ({searchResults.points.length + searchResults.lines.length + searchResults.areas.length}{' '}
              รายการ):
            </Typography>

            {searchResults.points.map((p) => (
              <Box
                key={p.id}
                onClick={() => onSelectFeature({ type: 'point', data: p })}
                sx={{
                  p: 1.2,
                  mb: 1,
                  borderRadius: 1.5,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#ef4444' },
                  transition: 'all 0.15s ease'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                  📍 {p.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                  {p.district ? `อ.${p.district} • ` : ''}
                  {p.description.slice(0, 48)}...
                </Typography>
              </Box>
            ))}

            {searchResults.lines.map((l) => (
              <Box
                key={l.id}
                onClick={() => onSelectFeature({ type: 'line', data: l })}
                sx={{
                  p: 1.2,
                  mb: 1,
                  borderRadius: 1.5,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#f97316' },
                  transition: 'all 0.15s ease'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                  🛣️ {l.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                  {l.description ? l.description.slice(0, 48) + '...' : ''}
                </Typography>
              </Box>
            ))}

            {!hasResults && (
              <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', my: 3 }}>
                ไม่พบคุณลักษณะที่ตรงกับคำค้นหา
              </Typography>
            )}
          </Box>
        ) : (
          /* CASE 3: Default Feature Overview for the Province */
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>
              คุณลักษณะทั้งหมดใน {provinceName} ({allPoints.length + allLines.length + allAreas.length} รายการ):
            </Typography>

            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', mb: 1.5 }}>
              คลิกหมุดหรือเส้นทางบนแผนที่เพื่อดูข้อมูลคุณลักษณะ
            </Typography>

            {allPoints.map((p) => (
              <Box
                key={p.id}
                onClick={() => onSelectFeature({ type: 'point', data: p })}
                sx={{
                  p: 1.2,
                  mb: 1,
                  borderRadius: 1.5,
                  border: '1px solid #f1f5f9',
                  bgcolor: '#ffffff',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                  transition: 'all 0.15s ease'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                  {p.icon || '📍'} {p.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                  {p.district ? `อ.${p.district}` : 'แลนด์มาร์ก'}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>
              โครงข่ายถนนสำคัญ:
            </Typography>

            {allLines.map((l) => (
              <Box
                key={l.id}
                onClick={() => onSelectFeature({ type: 'line', data: l })}
                sx={{
                  p: 1.2,
                  mb: 1,
                  borderRadius: 1.5,
                  border: '1px solid #f1f5f9',
                  bgcolor: '#ffffff',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                  transition: 'all 0.15s ease'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                  {l.type === 'river' ? '🌊' : '🛣️'} {l.name}
                </Typography>
                {l.hwy && (
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600 }}>
                    สาย {l.hwy}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
