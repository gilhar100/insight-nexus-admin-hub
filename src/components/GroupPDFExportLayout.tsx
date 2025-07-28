import React from 'react';

interface GroupPDFExportLayoutProps {
  pdfImages: Record<string, string>;
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
  archetypeLegendText?: string;
  wocaZoneLabel: string;
  wocaScore: number;
  wocaParticipantCount: number;
}

export const GroupPDFExportLayout: React.FC<GroupPDFExportLayoutProps> = ({
  pdfImages,
  groupNumber,
  participantCount,
  salimaScore,
  strongestDimension,
  weakestDimension,
  archetypeLegendText,
  wocaZoneLabel,
  wocaScore,
  wocaParticipantCount
}) => {
  const rootStyle: React.CSSProperties = {
    width: '794px',
    height: '1123px',
    margin: '0 auto',
    direction: 'rtl',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    boxSizing: 'border-box'
  };

  const pageStyle: React.CSSProperties = {
    ...rootStyle,
    padding: '40px',
    pageBreakAfter: 'always',
    display: 'flex',
    flexDirection: 'column'
  };

  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid hsl(var(--primary))',
    paddingBottom: '20px',
    width: '100%'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'hsl(var(--primary))',
    marginBottom: '10px'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: 'hsl(var(--muted-foreground))',
    marginBottom: '20px'
  };

  const chartContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '25px',
    width: '100%',
    maxWidth: '650px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const chartImageStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    display: 'block',
    margin: '0 auto'
  };

  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <div id="pdf-export-root" style={rootStyle}>
      <div style={pageStyle}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>דוח תובנות קבוצתי SALIMA</h1>
            <p style={subtitleStyle}>קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים</p>
          </div>

          <div style={chartContainerStyle}>
            <h2 style={titleStyle}>תרשים רדאר קבוצתי</h2>
            {pdfImages['radar-chart'] && (
              <img src={pdfImages['radar-chart']} alt="Group Radar Chart" style={chartImageStyle} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};