
import { useWorkshops } from '@/hooks/useWorkshops';
import { useWorkshopDetails } from '@/hooks/useWorkshopDetails';

export const useWorkshopData = (groupId?: number) => {
  const { workshops, error: workshopsError } = useWorkshops();
  const { workshopData, isLoading, error: workshopError } = useWorkshopDetails(groupId);

  // Combine errors from both hooks
  const error = workshopsError || workshopError;

  return { 
    workshopData, 
    workshops, 
    isLoading, 
    error 
  };
};

// Re-export types for backward compatibility
export type { WorkshopParticipant, WorkshopData, Workshop } from '@/types/workshopTypes';
