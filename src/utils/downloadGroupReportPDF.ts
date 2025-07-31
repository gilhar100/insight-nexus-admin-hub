
export async function downloadGroupReportPDF(html: string, filename = "Group_Report.pdf") {
  try {
    console.log('🚀 Sending PDF generation request to backend...');
    
    const response = await fetch("https://d777ae11-e9fa-4f0c-af8f-c3e7efff8ab2-00-335a5t4423dpw.pike.replit.dev/generate-pdf", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/pdf"
      },
      body: JSON.stringify({ html, filename })
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ PDF generated successfully, downloading...');
    
    // Create blob from response
    const blob = await response.blob();
    
    // Verify the blob is not empty
    if (blob.size === 0) {
      throw new Error("Received empty PDF file");
    }
    
    // Create temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    
    // Add to DOM, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the temporary URL
    window.URL.revokeObjectURL(url);
    
    console.log('📄 PDF download completed successfully!');
  } catch (error) {
    console.error('❌ PDF Download Error:', error);
    throw error;
  }
}
