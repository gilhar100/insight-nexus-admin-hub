
export async function downloadGroupReportPDF(html: string, filename = "Group_Report.pdf") {
  try {
    console.log('🚀 Starting PDF generation process...');
    console.log('📊 HTML content length:', html.length);
    
    // Validate HTML content
    if (!html || html.length < 100) {
      throw new Error("HTML content is too short or empty");
    }
    
    // Check if HTML contains the expected content
    if (!html.includes('pdf-export-root')) {
      throw new Error("HTML content appears to be invalid - missing PDF root element");
    }
    
    console.log('✅ HTML validation passed, sending to backend...');
    
    const response = await fetch("https://d777ae11-e9fa-4f0c-af8f-c3e7efff8ab2-00-335a5t4423dpw.pike.replit.dev/generate-pdf", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/pdf"
      },
      body: JSON.stringify({ html, filename })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        console.log('Could not read error response text');
      }
      throw new Error(`PDF generation failed: ${errorMessage}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    console.log('📄 Response content type:', contentType);
    
    if (!contentType || !contentType.includes('application/pdf')) {
      console.warn('⚠️ Unexpected content type:', contentType);
    }
    
    console.log('✅ PDF generated successfully, creating blob...');
    
    // Create blob from response
    const blob = await response.blob();
    console.log('📦 Blob size:', blob.size, 'bytes');
    console.log('📦 Blob type:', blob.type);
    
    // Verify the blob is not empty
    if (blob.size === 0) {
      throw new Error("Received empty PDF file from server");
    }
    
    // Verify blob is actually a PDF (basic check)
    if (blob.type && !blob.type.includes('pdf')) {
      console.warn('⚠️ Blob type is not PDF:', blob.type);
    }
    
    // Create temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    console.log('🔗 Created blob URL:', url);
    
    // Create temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    
    // Add to DOM, click, and remove
    document.body.appendChild(a);
    console.log('⬇️ Triggering download...');
    a.click();
    document.body.removeChild(a);
    
    // Clean up the temporary URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      console.log('🧹 Cleaned up blob URL');
    }, 1000);
    
    console.log('📄 PDF download completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ PDF Download Error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
