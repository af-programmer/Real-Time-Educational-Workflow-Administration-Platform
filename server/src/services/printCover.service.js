const PDFDocument = require('pdfkit');
const printRequestsDAL = require('../dal/printRequests.dal');
const AppError = require('../utils/AppError');

async function generateCoverPage(requestId, res) {
  const request = await printRequestsDAL.findById(requestId);
  if (!request) throw new AppError('Print request not found.', 404);

  const doc = new PDFDocument({ size: 'A4', margin: 50, autoFirstPage: false });
  doc.addPage({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="cover-${requestId}.pdf"`);
  doc.pipe(res);

  // Header background
  doc.rect(0, 0, doc.page.width, 120).fill('#1e3a5f');

  // Logo area
  doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold')
    .text('EduFlow', 50, 35, { align: 'left' });

  doc.fontSize(14).fillColor('#a0c4ff').font('Helvetica')
    .text('School Management Platform', 50, 75);

  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold')
    .text('PRINT JOB COVER SHEET', 0, 45, { align: 'right', width: doc.page.width - 50 });

  // Main content
  const startY = 140;
  const labelX = 50;
  const valueX = 220;
  const lineHeight = 28;

  function drawField(label, value, y) {
    doc.fontSize(11).fillColor('#6b7280').font('Helvetica-Bold')
      .text(label.toUpperCase(), labelX, y);
    doc.fontSize(14).fillColor('#111827').font('Helvetica')
      .text(String(value || '—'), valueX, y);
    doc.moveTo(labelX, y + 22).lineTo(doc.page.width - 50, y + 22)
      .strokeColor('#e5e7eb').lineWidth(1).stroke();
  }

  // Priority badge
  const priorityColors = { urgent: '#dc2626', important: '#d97706', normal: '#059669' };
  const priorityBg = priorityColors[request.priority] || '#6b7280';
  doc.roundedRect(doc.page.width - 160, 130, 110, 28, 6).fill(priorityBg);
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
    .text(request.priority.toUpperCase(), doc.page.width - 160, 139, { width: 110, align: 'center' });

  let y = startY;
  drawField('Teacher', request.teacher_name, y); y += lineHeight;
  drawField('Subject', request.subject_name, y); y += lineHeight;

  const classNames = (request.classes || []).map((c) => `${c.class_name} (${c.copies_count})`).join(', ');
  drawField('Classes', classNames, y); y += lineHeight;

  const totalStudents = (request.classes || []).reduce((sum, c) => sum + c.copies_count, 0);
  drawField('Total Students', totalStudents, y); y += lineHeight;
  drawField('Total Copies', request.total_copies, y); y += lineHeight;

  const lessonDate = request.lesson_date
    ? new Date(request.lesson_date).toLocaleDateString('en-GB') : '—';
  const lessonTime = request.lesson_time || '—';
  drawField('Lesson Date', `${lessonDate} at ${lessonTime}`, y); y += lineHeight;
  drawField('Request Status', request.status.replace('_', ' ').toUpperCase(), y); y += lineHeight;
  drawField('Submitted', new Date(request.created_at).toLocaleString('en-GB'), y); y += lineHeight;

  // Notes section
  if (request.notes) {
    y += 8;
    doc.fontSize(10).fillColor('#6b7280').font('Helvetica-Bold').text('NOTES', labelX, y);
    y += 16;
    doc.rect(labelX, y, doc.page.width - 100, 50).fill('#f9fafb').stroke('#e5e7eb');
    doc.fontSize(11).fillColor('#374151').font('Helvetica')
      .text(request.notes, labelX + 8, y + 8, { width: doc.page.width - 120, height: 36, ellipsis: true });
    y += 58;
  }

  if (request.files && request.files.length) {
    y += 8;
    doc.fontSize(10).fillColor('#6b7280').font('Helvetica-Bold')
      .text(`ATTACHED FILES (${request.files.length})`, labelX, y);
    y += 16;
    request.files.forEach((file, i) => {
      doc.fontSize(11).fillColor('#374151').font('Helvetica')
        .text(`${i + 1}. ${file.original_name}`, labelX + 10, y);
      y += 16;
    });
  }

  doc.end();
}

module.exports = { generateCoverPage };
