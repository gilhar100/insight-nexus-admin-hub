
import React, { createContext, useContext } from 'react';
import { useGroupData } from '@/hooks/useGroupData';

interface GroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
    dominant_archetype?: string;
  }>;
}

interface GroupDataContextType {
  data: GroupData | null;
  isLoading: boolean;
  error: string | null;
}

const GroupDataContext = createContext<GroupDataContextType | undefined>(undefined);

export const useGroupDataContext = () => {
  const context = useContext(GroupDataContext);
  if (context === undefined) {
    throw new Error('useGroupDataContext must be used within a GroupDataProvider');
  }
  return context;
};

interface GroupDataProviderProps {
  groupNumber: number;
  children: React.ReactNode;
}

export const GroupDataProvider: React.FC<GroupDataProviderProps> = ({ groupNumber, children }) => {
  const { data, isLoading, error } = useGroupData(groupNumber);

  return (
    <GroupDataContext.Provider value={{ data, isLoading, error }}>
      {children}
    </GroupDataContext.Provider>
  );
};
