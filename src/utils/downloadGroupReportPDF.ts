
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
    
    // Calculate dimensions for A4 page
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    console.log('💾 Downloading PDF...');
    
    // Download the PDF
    pdf.save(filename);
    
    console.log('✅ PDF download completed successfully!');
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    throw error;
  }
}
