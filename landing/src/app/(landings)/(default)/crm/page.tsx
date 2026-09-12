'use client';

// ============================================================================
// CRM Assessment Page (/crm)
// Architecture:
// Wrap in <CrmProvider> (Context lives at top)
// Reads currentView from Context, conditional-renders pages:
// HomeView / UserView / AdminView / OwnerView
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import ContainerWrapper from '@/components/ContainerWrapper';
import { CrmProvider, useCrm } from '@/contexts/CrmContext';
import RoleCards from '@/components/crm-assessment/RoleCards';
import HomeView from '@/components/crm-assessment/HomeView';
import UserView from '@/components/crm-assessment/UserView';
import AdminView from '@/components/crm-assessment/AdminView';
import OwnerView from '@/components/crm-assessment/OwnerView';

function CrmContent() {
  const { currentView } = useCrm();

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, minHeight: '80vh' }}>
      <ContainerWrapper>
        {/* Navigation Selector */}
        <RoleCards />

        {/* Conditional View Rendering based on currentView */}
        {currentView === 'home' && <HomeView />}
        {currentView === 'user' && <UserView />}
        {currentView === 'admin' && <AdminView />}
        {currentView === 'owner' && <OwnerView />}
      </ContainerWrapper>
    </Box>
  );
}

export default function CrmPage() {
  return (
    <CrmProvider>
      <CrmContent />
    </CrmProvider>
  );
}
