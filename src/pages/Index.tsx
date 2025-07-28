import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { IndividualInsights } from '@/components/IndividualInsights';
import { GroupWorkshopInsights } from '@/components/GroupWorkshopInsights';
import { PDFReportGenerator } from '@/components/PDFReportGenerator';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'group' | 'pdf-report'>('individual');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'individual' && <IndividualInsights />}
      {activeTab === 'group' && <GroupWorkshopInsights />}
      {activeTab === 'pdf-report' && <PDFReportGenerator />}
    </DashboardLayout>
  );
};

export default Index;
