
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { IndividualInsights } from '@/components/IndividualInsights';
import { GroupWorkshopInsights } from '@/components/GroupWorkshopInsights';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'individual' && <IndividualInsights />}
      {activeTab === 'group' && <GroupWorkshopInsights />}
    </DashboardLayout>
  );
};

export default Index;
