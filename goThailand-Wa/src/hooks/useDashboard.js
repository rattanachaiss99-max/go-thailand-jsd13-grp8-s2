import { useEffect, useState, useCallback } from 'react';
import {
  fetchDashboardStats,
  fetchCurrentUser,
  CURRENT_USER_ID
} from '../services/dashboardService';

// ============================================================================
// useDashboard — โหลดสถิติ 4 การ์ด + ข้อมูล user
// cleanup ด้วย flag `active` กัน setState หลัง unmount (stale update)
// ============================================================================

export default function useDashboard(userId = CURRENT_USER_ID) {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    Promise.all([fetchDashboardStats(userId), fetchCurrentUser(userId)])
      .then(([nextStats, nextUser]) => {
        if (!active) return;
        setStats(nextStats);
        setUser(nextUser);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'UNKNOWN_ERROR');
        setStats(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  return { stats, user, loading, error, reload };
}
