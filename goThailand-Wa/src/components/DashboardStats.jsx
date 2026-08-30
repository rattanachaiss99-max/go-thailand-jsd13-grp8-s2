import React from 'react';
import StatCard from './StatCard';

// ============================================================================
// DashboardStats — grid การ์ด 4 ใบ + loading skeleton + error state
// รับ stats จาก useDashboard (ไม่ fetch เอง) เพื่อให้ทดสอบง่าย
// ============================================================================

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter w-full';

const CARDS = [
  { key: 'upcomingTrips', icon: 'flight_takeoff', label: 'Upcoming Trips', variant: 'highlight' },
  { key: 'totalBookings', icon: 'calendar_month', label: 'Total Bookings' },
  { key: 'rewardsPoints', icon: 'stars', label: 'Rewards Points', suffix: 'PTS' },
  { key: 'savedPlaces', icon: 'bookmark', label: 'Saved Places' }
];

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/20 min-h-[148px] flex flex-col justify-between animate-pulse">
      <div className="h-8 w-8 rounded-lg bg-surface-container-high" />
      <div className="mt-stack-md space-y-stack-sm">
        <div className="h-3 w-24 rounded bg-surface-container-high" />
        <div className="h-8 w-16 rounded bg-surface-container-high" />
      </div>
    </div>
  );
}

export default function DashboardStats({ stats, loading, error, onRetry, onCardClick }) {
  if (loading) {
    return (
      <div className={GRID} aria-busy="true" aria-label="Loading dashboard statistics">
        {CARDS.map((c) => (
          <SkeletonCard key={c.key} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="w-full bg-error-container text-on-error-container p-stack-lg rounded-xl flex flex-col sm:flex-row items-center justify-between gap-stack-md"
      >
        <div className="flex items-center gap-stack-md">
          <span className="material-symbols-outlined" aria-hidden="true">
            error
          </span>
          <p className="font-body-md text-body-md">
            ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ ({error})
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors shrink-0"
          >
            ลองอีกครั้ง
          </button>
        )}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={GRID}>
      {CARDS.map(({ key, icon, label, suffix, variant }) => (
        <StatCard
          key={key}
          icon={icon}
          label={label}
          value={stats[key] ?? 0}
          suffix={suffix}
          variant={variant}
          onClick={onCardClick ? () => onCardClick(key) : undefined}
        />
      ))}
    </div>
  );
}
