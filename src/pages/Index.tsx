
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { IndividualInsights } from '@/components/IndividualInsights';
import { GroupWorkshopInsights } from '@/components/GroupWorkshopInsights';
import { ColleagueComparison } from '@/components/ColleagueComparison';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'group' | 'colleague'>('individual');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'individual' && <IndividualInsights />}
      {activeTab === 'group' && <GroupWorkshopInsights />}
      {activeTab === 'colleague' && <ColleagueComparison />}
    </DashboardLayout>
  );
};

export default Index;
