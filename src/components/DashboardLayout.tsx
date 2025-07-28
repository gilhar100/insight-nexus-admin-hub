
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User, Users, FileText } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'individual' | 'group' | 'pdf-report';
  onTabChange: (tab: 'individual' | 'group' | 'pdf-report') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            מערכת ניתוח מנהיגות ושינוי ארגוני
          </h1>
          <p className="text-gray-600">
            כלי לניתוח תובנות אישיות וקבוצתיות במנהיגות ובשינוי ארגוני
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              תובנות אישיות
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              תובנות קבוצתיות
            </TabsTrigger>
            <TabsTrigger value="pdf-report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate PDF Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <Card>
              <CardContent className="p-6">
                {activeTab === 'individual' && children}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group">
            <Card>
              <CardContent className="p-6">
                {activeTab === 'group' && children}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf-report">
            <Card>
              <CardContent className="p-6">
                {activeTab === 'pdf-report' && children}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
