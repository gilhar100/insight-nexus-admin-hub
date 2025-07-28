
export async function downloadGroupReportPDF(html: string, filename = "Group_Report.pdf") {
  const response = await fetch("https://d777ae11-e9fa-4f0c-af8f-c3e7efff8ab2-00-335a5t4423dpw.pike.replit.dev/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, filename })
  });

  if (!response.ok) {
    throw new Error("PDF generation failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
