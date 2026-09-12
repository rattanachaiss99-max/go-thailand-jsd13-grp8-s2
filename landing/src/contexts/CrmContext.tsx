'use client';

// ============================================================================
// CRM Context — Central Shared State Layer
// Follows react-crm-lifecycle:
// 1. "state used by many components → Context; state used by ONE component → local useState"
// 2. Mount → fetch once with [] deps + cleanup flag (let active = true; return () => { active = false; })
// 3. State updates are IMMUTABLE (prev => [...prev, created], filter for delete)
// 4. Exposes useCrm() hook for components to consume
// ============================================================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { crmService, CrmMember } from '@/services/crmService';

export type CrmView = 'home' | 'user' | 'admin' | 'owner';

interface CrmContextType {
  members: CrmMember[];
  currentView: CrmView;
  setCurrentView: (view: CrmView) => void;
  loading: boolean;
  error: string | null;
  addMember: (input: { firstName: string; lastName: string; position: string; role?: 'user' | 'admin' }) => Promise<CrmMember>;
  removeMember: (id: string) => Promise<void>;
  editMember: (id: string, updates: Partial<Omit<CrmMember, 'id'>>) => Promise<void>;
  refreshMembers: () => Promise<void>;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<CrmMember[]>([]);
  const [currentView, setCurrentView] = useState<CrmView>('home');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mount → fetch once → store in state → cleanup flag prevents setState after unmount
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    crmService
      .getMembers()
      .then((data) => {
        if (active) {
          setMembers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'ไม่สามารถโหลดรายชื่อสมาชิกได้');
          setLoading(false);
        }
      });

    return () => {
      active = false; // Prevents memory leaks / unmounted setState
    };
  }, []);

  // Event handler for refresh (Manual reload)
  const refreshMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crmService.getMembers();
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'โหลดข้อมูลล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  // Event handler fetch: CREATE (Immutable update: prev => [...prev, created])
  const addMember = async (input: { firstName: string; lastName: string; position: string; role?: 'user' | 'admin' }) => {
    setError(null);
    const created = await crmService.createMember(input);
    setMembers((prev) => [...prev, created]);
    return created;
  };

  // Event handler fetch: DELETE (Immutable update: filter)
  const removeMember = async (id: string) => {
    setError(null);
    await crmService.deleteMember(id);
    setMembers((prev) => prev.filter((item) => item.id !== id));
  };

  // Event handler fetch: UPDATE (Immutable update: map)
  const editMember = async (id: string, updates: Partial<Omit<CrmMember, 'id'>>) => {
    setError(null);
    const updated = await crmService.updateMember(id, updates);
    setMembers((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  return (
    <CrmContext.Provider
      value={{
        members,
        currentView,
        setCurrentView,
        loading,
        error,
        addMember,
        removeMember,
        editMember,
        refreshMembers
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

// Custom Hook to consume CRM Context
export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within CrmProvider');
  }
  return context;
}
