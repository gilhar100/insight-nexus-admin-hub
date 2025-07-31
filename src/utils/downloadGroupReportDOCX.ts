
export async function downloadGroupReportDOCX(requestBody: any, groupNumber: number) {
  try {
    console.log('🚀 Sending DOCX generation request to backend...');
    
    // Add Hebrew titles to the request body
    const requestWithTitles = {
      ...requestBody,
      titles: {
        report: 'דוח תובנות קבוצתי חברת OPPORTUNITY',
        radarChart: 'פרופיל ניהולי',
        archetypeChart: 'התפלגות סגנונות מנהיגות',
        wocaPie: 'התפלגות אזורי תודעה ארגונית',
        wocaBar: 'עוצמת אזורי תודעה ארגונית לפי ציון',
        wocaMatrix: 'מטריצת אזורי תודעה ארגונית'
      }
    };
    
    const response = await fetch("https://d777ae11-e9fa-4f0c-af8f-c3e7efff8ab2-00-335a5t4423dpw.pike.replit.dev/generate-docx", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      },
      body: JSON.stringify(requestWithTitles)
    });

    if (!response.ok) {
      throw new Error(`DOCX generation failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ DOCX generated successfully, downloading...');
    
    // Create blob from response
    const blob = await response.blob();
    
    // Verify the blob is not empty
    if (blob.size === 0) {
      throw new Error("Received empty DOCX file");
    }
    
    // Create temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = `Group_Report_${groupNumber}.docx`;
    link.style.display = "none";
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the temporary URL
    window.URL.revokeObjectURL(url);
    
    console.log('📄 DOCX download completed successfully!');
  } catch (error) {
    console.error('❌ DOCX Download Error:', error);
    throw error;
  }
}
