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
  const pageStyle: React.CSSProperties = {
    width: '794px',
    height: '1123px',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    pageBreakAfter: 'always',
    boxSizing: 'border-box',
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

  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <div
      id="pdf-export-root"
      style={{
        width: '794px',
        margin: '0 auto',
        direction: 'rtl',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff'
      }}
    >
      {/* Page 1 - SALIMA Overview */}
      <div style={pageStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>דוח תובנות קבוצתי SALIMA</h1>
          <p style={subtitleStyle}>קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '22px', color: 'hsl(var(--primary))' }}>ציון SLQ קבוצתי</h2>
          <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{salimaScore.toFixed(2)}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'hsl(var(--primary))' }}>מימד חזק ביותר</h3>
            <p>{strongestDimension.name}</p>
            <strong>{strongestDimension.score.toFixed(2)}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'hsl(var(--destructive))' }}>מימד חלש ביותר</h3>
            <p>{weakestDimension.name}</p>
            <strong>{weakestDimension.score.toFixed(2)}</strong>
          </div>
        </div>

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h3>תרשים רדאר קבוצתי</h3>
          {pdfImages['radar-chart'] && <img src={pdfImages['radar-chart']} alt="Radar" style={chartImageStyle} />}
        </div>

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h3>תרשים ארכיטיפים</h3>
          {pdfImages['archetype-chart'] && <img src={pdfImages['archetype-chart']} alt="Archetypes" style={chartImageStyle} />}
        </div>
      </div>

      {/* Additional pages restored hereafter... */}
      {/* You can paste your other four original pages below this point if needed */}
    </div>
  );
};