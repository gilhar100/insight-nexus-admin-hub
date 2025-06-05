
import { useState } from 'react';
import { useWorkshopData } from '@/hooks/useWorkshopData';

export const useWorkshopInsights = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | undefined>();
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showNames, setShowNames] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [viewMode, setViewMode] = useState<'workshop' | 'individual'>('workshop');
  
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshopId);

  const handleWorkshopSelect = (value: string) => {
    setSelectedWorkshopId(Number(value));
    setSelectedParticipant(null);
    setViewMode('workshop');
  };

  const handleParticipantSelect = (participant: any) => {
    setSelectedParticipant(participant);
    setSelectedWorkshopId(undefined);
    setViewMode('individual');
  };

  const toggleNames = () => setShowNames(!showNames);
  const togglePresenterMode = () => setPresenterMode(!presenterMode);

  return {
    selectedWorkshopId,
    selectedParticipant,
    showNames,
    presenterMode,
    viewMode,
    workshopData,
    workshops,
    isLoading,
    error,
    handleWorkshopSelect,
    handleParticipantSelect,
    toggleNames,
    togglePresenterMode,
    setPresenterMode
  };
};
