import PDFDocument from 'pdfkit';

export function buildReportPdf(input: {
  title: string;
  summary: string;
  sections: Array<{ label: string; value: string }>;
}) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).fillColor('#111827').text(input.title, { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#374151').text(input.summary, { align: 'left' });
    doc.moveDown(1);

    input.sections.forEach((section) => {
      doc.fontSize(12).fillColor('#111827').text(section.label, { continued: false });
      doc.fontSize(10).fillColor('#4B5563').text(section.value);
      doc.moveDown(0.5);
    });

    doc.end();
  });
}