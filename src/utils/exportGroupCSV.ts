
import { PDFTemplateData } from '@/hooks/useGroupPDFTemplate';
import { GroupData } from '@/hooks/useGroupData';
import { WorkshopData } from '@/types/workshopTypes';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';

interface ArchetypeDistribution {
  manager_opportunity: number;
  manager_empowering: number;
  manager_curious: number;
}

export const exportGroupInsightsCSV = (
  templateData: PDFTemplateData,
  groupData: GroupData | null,
  workshopData: WorkshopData | null
) => {
  try {
    console.log('Starting CSV export for group:', templateData.groupNumber);
    
    // Calculate archetype distribution
    let archetypeDistribution: ArchetypeDistribution = {
      manager_opportunity: 0,
      manager_empowering: 0,
      manager_curious: 0
    };

    if (groupData?.participants) {
      const validArchetypes = groupData.participants.filter(p => 
        p.dominant_archetype && 
        typeof p.dominant_archetype === 'string' && 
        p.dominant_archetype.trim() !== '' && 
        p.dominant_archetype !== 'null'
      );

      const total = validArchetypes.length;
      if (total > 0) {
        const counts = validArchetypes.reduce((acc, p) => {
          const archetype = p.dominant_archetype?.toLowerCase();
          if (archetype?.includes('הזדמנות') || archetype?.includes('opportunity')) {
            acc.manager_opportunity++;
          } else if (archetype?.includes('מעצים') || archetype?.includes('empowering')) {
            acc.manager_empowering++;
          } else if (archetype?.includes('סקרן') || archetype?.includes('curious')) {
            acc.manager_curious++;
          }
          return acc;
        }, { manager_opportunity: 0, manager_empowering: 0, manager_curious: 0 });

        archetypeDistribution = {
          manager_opportunity: (counts.manager_opportunity / total) * 100,
          manager_empowering: (counts.manager_empowering / total) * 100,
          manager_curious: (counts.manager_curious / total) * 100
        };
      }
    }

    // Calculate WOCA analysis
    let wocaAnalysis = null;
    let zoneDistribution = {
      zone_opportunity: 0,
      zone_comfort: 0,
      zone_apathy: 0,
      zone_war: 0
    };

    if (workshopData) {
      wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
      if (wocaAnalysis?.groupZoneCounts && workshopData.participant_count > 0) {
        const total = workshopData.participant_count;
        zoneDistribution = {
          zone_opportunity: (wocaAnalysis.groupZoneCounts.opportunity / total) * 100,
          zone_comfort: (wocaAnalysis.groupZoneCounts.comfort / total) * 100,
          zone_apathy: (wocaAnalysis.groupZoneCounts.apathy / total) * 100,
          zone_war: (wocaAnalysis.groupZoneCounts.war / total) * 100
        };
      }
    }

    // Create CSV data with safe fallbacks
    const csvData = {
      // Basic group info
      group_number: templateData.groupNumber || 0,
      participant_count: templateData.participantCount || 0,
      
      // SALIMA data
      salimaScore: (templateData.salimaScore || 0).toFixed(2),
      strongestDimension_name: templateData.strongestDimension?.name || 'N/A',
      strongestDimension_score: (templateData.strongestDimension?.score || 0).toFixed(2),
      weakestDimension_name: templateData.weakestDimension?.name || 'N/A',
      weakestDimension_score: (templateData.weakestDimension?.score || 0).toFixed(2),
      
      // SALIMA dimension scores
      strategy: groupData?.averages?.strategy?.toFixed(2) || '0',
      adaptability: groupData?.averages?.adaptability?.toFixed(2) || '0',
      learning: groupData?.averages?.learning?.toFixed(2) || '0',
      inspiration: groupData?.averages?.inspiration?.toFixed(2) || '0',
      meaning: groupData?.averages?.meaning?.toFixed(2) || '0',
      authenticity: groupData?.averages?.authenticity?.toFixed(2) || '0',
      
      // Archetype percentages
      manager_opportunity: archetypeDistribution.manager_opportunity.toFixed(1),
      manager_empowering: archetypeDistribution.manager_empowering.toFixed(1),
      manager_curious: archetypeDistribution.manager_curious.toFixed(1),
      
      // WOCA data
      wocaParticipantCount: templateData.wocaParticipantCount || 0,
      wocaScore: (templateData.wocaScore || 0).toFixed(2),
      wocaZoneLabel: templateData.wocaZoneLabel || 'N/A',
      
      // WOCA category scores
      trust: wocaAnalysis?.groupCategoryScores?.trust?.toFixed(2) || '0',
      communication: wocaAnalysis?.groupCategoryScores?.communication?.toFixed(2) || '0',
      engagement: wocaAnalysis?.groupCategoryScores?.engagement?.toFixed(2) || '0',
      initiative: wocaAnalysis?.groupCategoryScores?.initiative?.toFixed(2) || '0',
      
      // WOCA zone percentages
      zone_opportunity: zoneDistribution.zone_opportunity.toFixed(1),
      zone_comfort: zoneDistribution.zone_comfort.toFixed(1),
      zone_apathy: zoneDistribution.zone_apathy.toFixed(1),
      zone_war: zoneDistribution.zone_war.toFixed(1)
    };

    // Convert to CSV format
    const headers = Object.keys(csvData);
    const values = Object.values(csvData);
    
    // Escape values that might contain commas
    const escapedValues = values.map(value => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    
    const csvContent = [
      headers.join(','),
      escapedValues.join(',')
    ].join('\n');

    console.log('CSV content generated:', csvContent);

    // Create and download the file
    const BOM = '\uFEFF'; // UTF-8 BOM for proper Hebrew encoding
    const dataBlob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `group_${templateData.groupNumber}_insights.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('CSV export completed successfully');
  } catch (error) {
    console.error('CSV Export Error:', error);
    throw new Error(`Failed to export CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
