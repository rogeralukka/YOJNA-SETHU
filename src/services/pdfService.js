import PDFDocument from 'pdfkit';

/**
 * Generate a styled PDF report for user/business scheme eligibility
 * @param {Object} data - { user, business, eligibleSchemes, generatedAt }
 * @returns {Promise<Buffer>}
 */
export const generateEligibilityPDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header Banner
      doc
        .rect(0, 0, doc.page.width, 90)
        .fill('#0f2b5c');

      doc
        .fillColor('#ffffff')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('GOVERNMENT SCHEME PORTAL', 40, 25);

      doc
        .fontSize(12)
        .font('Helvetica')
        .text('Official Eligibility & Entitlement Summary Report', 40, 52);

      doc
        .fontSize(9)
        .text(`Generated on: ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`, doc.page.width - 250, 52, { align: 'right' });

      // Profile Information Box
      doc.moveDown(3);
      const startY = 110;
      doc
        .roundedRect(40, startY, doc.page.width - 80, data.business ? 110 : 90, 6)
        .lineWidth(1)
        .strokeColor('#d0d7de')
        .stroke();

      doc
        .fillColor('#0f2b5c')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('APPLICANT PROFILE DETAILS', 55, startY + 12);

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#333333');

      const col1X = 55;
      const col2X = 220;
      const col3X = 380;
      let infoY = startY + 35;

      doc.text(`Full Name: ${data.user.fullName || 'N/A'}`, col1X, infoY);
      doc.text(`Email: ${data.user.email || 'N/A'}`, col2X, infoY);
      doc.text(`Mobile: ${data.user.mobile || 'N/A'}`, col3X, infoY);

      infoY += 18;
      doc.text(`Age: ${data.user.age ? `${data.user.age} Years` : 'Not specified'}`, col1X, infoY);
      doc.text(`State: ${data.user.state || 'Not specified'}`, col2X, infoY);
      doc.text(`Category: ${data.user.category || 'General'}`, col3X, infoY);

      if (data.business) {
        infoY += 18;
        doc
          .font('Helvetica-Bold')
          .fillColor('#1e40af')
          .text(`Selected Business: ${data.business.name} (${data.business.type})`, col1X, infoY);
        doc
          .font('Helvetica')
          .fillColor('#333333')
          .text(`Industry: ${data.business.industryCategory || 'N/A'}`, col3X, infoY);
      }

      // Eligible Schemes Section
      const tableStartY = infoY + 35;
      doc
        .fillColor('#107569')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`Eligible Schemes Summary (${data.eligibleSchemes.length} Schemes Matched)`, 40, tableStartY);

      let currentY = tableStartY + 25;

      if (!data.eligibleSchemes || data.eligibleSchemes.length === 0) {
        doc
          .fontSize(10)
          .font('Helvetica-Oblique')
          .fillColor('#666666')
          .text('No matching schemes found for the current profile filters.', 40, currentY);
      } else {
        data.eligibleSchemes.forEach((scheme, index) => {
          // Check for page break
          if (currentY > doc.page.height - 100) {
            doc.addPage();
            currentY = 40;
          }

          doc
            .roundedRect(40, currentY, doc.page.width - 80, 55, 4)
            .fillColor('#f8fafc')
            .fill()
            .strokeColor('#e2e8f0')
            .stroke();

          doc
            .fillColor('#0f172a')
            .fontSize(11)
            .font('Helvetica-Bold')
            .text(`${index + 1}. ${scheme.name}`, 52, currentY + 10);

          doc
            .fillColor('#475569')
            .fontSize(9)
            .font('Helvetica')
            .text(`Dept: ${scheme.department} | Category: ${scheme.category}`, 52, currentY + 26);

          const deadlineText = scheme.deadline
            ? `Deadline: ${new Date(scheme.deadline).toLocaleDateString('en-IN')}`
            : 'Deadline: Ongoing / Open';

          doc
            .fillColor('#0369a1')
            .text(deadlineText, 52, currentY + 39);

          doc
            .roundedRect(doc.page.width - 125, currentY + 12, 70, 18, 3)
            .fillColor('#dcfce7')
            .fill();

          doc
            .fillColor('#166534')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text('ELIGIBLE', doc.page.width - 125, currentY + 16, { width: 70, align: 'center' });

          currentY += 65;
        });
      }

      // Footer
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#94a3b8')
        .text('This is a computer generated summary report from the Government Scheme Portal. For official filings, visit the official portal.', 40, doc.page.height - 35, { align: 'center', width: doc.page.width - 80 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
