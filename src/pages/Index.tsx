
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { IndividualInsights } from '@/components/IndividualInsights';
import { GroupWorkshopInsights } from '@/components/GroupWorkshopInsights';
import { GenerateReport } from '@/components/GenerateReport';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'group' | 'report'>('individual');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'individual' && <IndividualInsights />}
      {activeTab === 'group' && <GroupWorkshopInsights />}
      {activeTab === 'report' && <GenerateReport />}
    </DashboardLayout>
  );
};

export default Index;
