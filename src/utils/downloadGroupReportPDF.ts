
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function downloadGroupReportPDF(elementId: string, filename = "Group_Report.pdf") {
  try {
    console.log('🚀 Starting client-side PDF generation...');
    
    // Get the element to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log('📸 Capturing element as canvas...');
    
    // Capture the element as canvas with high quality
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      height: element.scrollHeight,
      width: element.scrollWidth,
    });

    console.log('📄 Converting canvas to PDF...');
    
    // Calculate dimensions for A4 landscape
    const pageWidth = 297; // A4 landscape width in mm
    const pageHeight = 210; // A4 landscape height in mm
    const imgWidth = pageWidth - 20; // Account for margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF document in landscape orientation
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    let position = 0;
    let pageNumber = 1;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position + 10, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 20); // Account for margins

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pageNumber++;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position + 10, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);
    }

    console.log(`💾 Downloading PDF with ${pageNumber} pages...`);
    
    // Download the PDF
    pdf.save(filename);
    
    console.log('✅ PDF download completed successfully!');
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    throw error;
  }
}
