
export async function downloadGroupReportPDF(elementId: string, filename = "Group_Report.pdf") {
  try {
    console.log('🚀 Starting server-side PDF generation...');
    
    // Get the element to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log('📄 Converting element to HTML...');
    
    // Get the HTML content from the element
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>דוח תובנות קבוצתי</title>
        <style>
          ${getInlineStyles()}
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
      </html>
    `;

    console.log('🌐 Sending request to PDF service...');
    
    // Send request to external PDF service
    const response = await fetch("https://salima-pdf-backend.onrender.com/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: htmlContent
      })
    });

    if (!response.ok) {
      throw new Error(`PDF service responded with status: ${response.status}`);
    }

    console.log('💾 Downloading generated PDF...');
    
    // Get the PDF blob and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
    
    console.log('✅ PDF download completed successfully!');
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    throw error;
  }
}

// Helper function to get inline styles for the PDF
function getInlineStyles(): string {
  return `
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    
    body { 
      margin: 0; 
      padding: 0;
      font-family: Arial, sans-serif;
      direction: rtl;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .page-break { 
      page-break-before: always !important; 
      break-before: page !important;
      height: 100vh !important;
      box-sizing: border-box !important;
    }
    
    .page-content {
      height: 100vh !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }
    
    .chart-container {
      max-width: 100%;
      height: auto;
      overflow: hidden;
    }
    
    .chart-container img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }
    
    .dimension-item {
      margin-bottom: 8px;
      padding: 6px 8px;
      border-right: 3px solid #2563eb;
      background-color: #f8fafc;
      break-inside: avoid;
    }
    
    .dimension-title {
      font-weight: bold;
      font-size: 14px;
      color: #1e40af;
      margin-bottom: 2px;
    }
    
    .dimension-description {
      font-size: 12px;
      color: #374151;
      line-height: 1.3;
    }

    /* Tailwind-like utility classes */
    .text-center { text-align: center; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .font-bold { font-weight: bold; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-3xl { font-size: 1.875rem; }
    .bg-white { background-color: white; }
    .text-black { color: black; }
  `;
}
