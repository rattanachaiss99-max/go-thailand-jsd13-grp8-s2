import React from 'react';
import useDashboard from '../hooks/useDashboard';
import DashboardStats from '../components/DashboardStats';

// ============================================================================
// DashboardView — หน้า CRM dashboard ของลูกค้า
// ข้อมูลมาจาก useDashboard → dashboardService (mock ตอนนี้, API ทีหลัง)
// ============================================================================

const TIER_LABEL = {
  bronze: 'Bronze Member',
  silver: 'Silver Member',
  gold: 'Gold Member',
  platinum: 'Platinum Member'
};

export default function DashboardView() {
  const { stats, user, loading, error, reload } = useDashboard();

  const greetingName = user ? user.firstName : '';

  return (
    <section className="w-full">
      <div className="mb-stack-lg">
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          My Dashboard
        </p>
        <h1 className="font-headline-lg text-headline-lg text-primary mt-stack-sm">
          {greetingName ? `สวัสดี, ${greetingName}` : 'สวัสดี'}
        </h1>
        {user?.membershipTier && (
          <span className="inline-flex items-center gap-stack-sm mt-stack-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-4 py-2 rounded-full">
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              workspace_premium
            </span>
            {TIER_LABEL[user.membershipTier] ?? user.membershipTier}
          </span>
        )}
      </div>

      <DashboardStats stats={stats} loading={loading} error={error} onRetry={reload} />
    </section>
  );
}
