
export async function downloadGroupReportPDF(elementId: string, filename = "Group_Report.pdf") {
  try {
    console.log('🚀 Starting server-side PDF generation...');
    
    const layout = document.getElementById(elementId);
    if (!layout) {
      alert("Report is not loaded correctly.");
      return;
    }

    console.log('📄 Getting HTML content from element...');
    const html = layout.outerHTML;

    console.log('🌐 Sending request to PDF service...');
    
    const response = await fetch("https://salima-pdf-backend.onrender.com/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html })
    });

    if (!response.ok) {
      throw new Error(`PDF service responded with status: ${response.status}`);
    }

    console.log('💾 Downloading generated PDF...');
    
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
