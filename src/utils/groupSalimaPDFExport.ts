
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
    console.log('Starting PDF export for group:', groupData.group_number);
    
    // Create a temporary container for the PDF layout
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(container);

    // Import React and ReactDOM
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    
    // Import the PDF layout component
    const { GroupSalimaPDFLayout } = await import('@/components/pdf/GroupSalimaPDFLayout');

    // Create the PDF layout
    const pdfElement = React.createElement(GroupSalimaPDFLayout, { groupData });
    
    // Render to the temporary container
    const root = ReactDOM.createRoot(container);
    root.render(pdfElement);

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Wait for charts to render
    await new Promise(resolve => {
      const checkCharts = () => {
        const charts = container.querySelectorAll('svg, canvas');
        if (charts.length > 0) {
          console.log('Charts found:', charts.length);
          resolve(true);
        } else {
          setTimeout(checkCharts, 200);
        }
      };
      checkCharts();
    });

    // Additional wait for complete rendering
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all page elements
    const pages = container.querySelectorAll('[data-page]');
    console.log('Found pages:', pages.length);
    
    if (pages.length === 0) {
      throw new Error('No pages found in PDF layout');
    }

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
      console.log(`Processing page ${i + 1}/${pages.length}`);
      
      // Add new page
      pdf.addPage();

      // Capture the page
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: page.scrollWidth,
        height: page.scrollHeight,
        logging: false
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
        canvas.toDataURL('image/jpeg', 0.8),
        'JPEG',
        (210 - finalWidth) / 2, // Center horizontally
        10, // Small top margin
        finalWidth,
        finalHeight
      );
    }

    // Clean up
    document.body.removeChild(container);
    root.unmount();

    // Download the PDF
    const fileName = `salima-group-${groupData.group_number}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Downloading PDF:', fileName);
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
