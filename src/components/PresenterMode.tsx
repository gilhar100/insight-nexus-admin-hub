
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface PresenterModeProps {
  isPresenterMode: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const PresenterMode: React.FC<PresenterModeProps> = ({
  isPresenterMode,
  onToggle,
  children
}) => {
  if (isPresenterMode) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        <div className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-end mb-8">
              <Button
                onClick={onToggle}
                variant="outline"
                size="lg"
                className="text-lg"
              >
                <Minimize2 className="h-5 w-5 mr-2" />
                יציאה ממצב מציג
              </Button>
            </div>
            <div className="presenter-mode">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          מצב מציג
        </Button>
      </div>
      {children}
    </div>
  );
};
