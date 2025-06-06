
import { useState } from 'react';
import { useWorkshopData } from '@/hooks/useWorkshopData';

export const useWorkshopInsights = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | undefined>();
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showNames, setShowNames] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [viewMode, setViewMode] = useState<'workshop' | 'individual'>('workshop');
  
  console.log('🎯 useWorkshopInsights state:', {
    selectedWorkshopId,
    selectedParticipant: selectedParticipant?.id,
    viewMode
  });
  
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshopId);

  const handleWorkshopSelect = (value: string) => {
    const workshopId = Number(value);
    console.log('🎯 handleWorkshopSelect called with:', { value, workshopId, type: typeof workshopId });
    console.log('🎯 Setting workshop state...');
    setSelectedWorkshopId(workshopId);
    setSelectedParticipant(null);
    setViewMode('workshop');
    console.log('🎯 Workshop selection updated, new selectedWorkshopId:', workshopId);
  };

  const handleParticipantSelect = (participant: any) => {
    console.log('🎯 handleParticipantSelect called with:', participant);
    setSelectedParticipant(participant);
    setSelectedWorkshopId(undefined);
    setViewMode('individual');
  };

  const toggleNames = () => setShowNames(!showNames);
  const togglePresenterMode = () => setPresenterMode(!presenterMode);

  console.log('🎯 useWorkshopInsights returning:', {
    selectedWorkshopId,
    workshopData: workshopData ? {
      workshop_id: workshopData.workshop_id,
      participant_count: workshopData.participant_count,
      participants: workshopData.participants?.length || 0
    } : null,
    workshops: workshops?.length || 0,
    isLoading,
    error,
    viewMode
  });

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
