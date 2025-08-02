import htmlDocx from 'html-docx-js/dist/html-docx';

export async function downloadGroupReportDOCX(elementId: string, filename = "Group_Report.docx") {
  try {
    console.log('🚀 Starting client-side DOCX generation...');
    
    // Get the element to convert to DOCX
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log('📝 Converting HTML to DOCX...');
    
    // Get the HTML content
    const htmlContent = element.innerHTML;
    
    // Create a complete HTML document with proper styling
    const completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .chart-container { margin: 20px 0; text-align: center; }
            .summary-section { margin: 30px 0; padding: 20px; border: 1px solid #ccc; }
            h1, h2, h3 { color: #333; text-align: center; }
            .flex { display: flex; justify-content: space-between; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .bg-gray-50 { background-color: #f9f9f9; }
            .border { border: 1px solid #e5e5e5; }
            .rounded-lg { border-radius: 8px; }
            .p-4 { padding: 16px; }
            .mb-4 { margin-bottom: 16px; }
            .text-center { text-align: center; }
            .font-semibold { font-weight: 600; }
            .text-lg { font-size: 18px; }
            .text-sm { font-size: 14px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .space-y-4 > * + * { margin-top: 16px; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Convert HTML to DOCX
    const docxBlob = htmlDocx.asBlob(completeHtml);
    
    console.log('💾 Downloading DOCX...');
    
    // Create download link and trigger download
    const url = URL.createObjectURL(docxBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ DOCX download completed successfully!');
  } catch (error) {
    console.error('❌ DOCX Generation Error:', error);
    throw error;
  }
}