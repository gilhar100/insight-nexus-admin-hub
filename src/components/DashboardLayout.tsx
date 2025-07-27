
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, Users } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'individual' | 'group';
  onTabChange: (tab: 'individual' | 'group') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                SALIMA & WOCA Analysis Platform
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <Button
              variant={activeTab === 'individual' ? 'default' : 'ghost'}
              onClick={() => onTabChange('individual')}
              className="flex items-center px-4 py-3 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Individual Insights (SALIMA)
            </Button>
            <Button
              variant={activeTab === 'group' ? 'default' : 'ghost'}
              onClick={() => onTabChange('group')}
              className="flex items-center px-4 py-3 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              Group Workshop Insights (WOCA)
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
