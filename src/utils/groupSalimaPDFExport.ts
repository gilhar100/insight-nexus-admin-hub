
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
    dominant_archetype?: string;
  }>;
}

export const exportGroupSalimaPDF = async (groupData: GroupData) => {
  try {
    // Create a temporary container for the PDF layout
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    // Import the PDF layout component dynamically
    const { GroupSalimaPDFLayout } = await import('@/components/pdf/GroupSalimaPDFLayout');
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');

    // Create the PDF layout
    const pdfElement = React.createElement(GroupSalimaPDFLayout, { groupData });
    
    // Render to the temporary container
    const root = ReactDOM.createRoot(container);
    root.render(pdfElement);

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Wait for charts to render
    await new Promise(resolve => {
      const checkCharts = () => {
        const charts = container.querySelectorAll('svg');
        if (charts.length > 0) {
          resolve(true);
        } else {
          setTimeout(checkCharts, 100);
        }
      };
      checkCharts();
    });

    // Additional wait for complete rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get all pages
    const pages = container.querySelectorAll('[style*="pageBreakAfter"]');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Remove the first empty page
    pdf.deletePage(1);

    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      // Add new page for each section (except the first)
      if (i > 0) {
        pdf.addPage();
      } else {
        pdf.addPage();
      }

      // Capture the page
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: page.scrollWidth,
        height: page.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied
          const clonedPage = clonedDoc.querySelector('[style*="pageBreakAfter"]');
          if (clonedPage) {
            (clonedPage as HTMLElement).style.pageBreakAfter = 'auto';
          }
        }
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is too tall, scale it down
      const maxHeight = 297; // A4 height in mm
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      
      if (imgHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = (canvas.width * maxHeight) / canvas.height;
      }

      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.9),
        'JPEG',
        (210 - finalWidth) / 2, // Center horizontally
        0,
        finalWidth,
        finalHeight
      );
    }

    // Clean up
    document.body.removeChild(container);
    root.unmount();

    // Download the PDF
    const fileName = `salima-group-${groupData.group_number}-insights-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
