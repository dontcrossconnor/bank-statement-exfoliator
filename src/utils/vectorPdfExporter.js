import jsPDF from 'jspdf';
import { formatCurrency, formatDate } from './formatters';

// Map of institutional font file candidates in /public/fonts/
const FONT_FILE_MAP = {
  bofa_sim: { name: 'ConnectionsSans', file: '/fonts/ConnectionsSans.ttf', fontStyle: 'normal' },
  wells_sim: { name: 'WellsFargoSans', file: '/fonts/WellsFargoSans.ttf', fontStyle: 'normal' },
  schwab_sim: { name: 'SchwabSans', file: '/fonts/SchwabSans.ttf', fontStyle: 'normal' },
  fidelity_sim: { name: 'FidelitySans', file: '/fonts/FidelitySans.ttf', fontStyle: 'normal' }
};

/**
 * ArrayBuffer to Binary String converter for jsPDF addFileToVFS
 */
function arrayBufferToBinaryString(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

/**
 * Helper to dynamically load font file if present in /public/fonts/ and register to jsPDF
 */
async function loadAndRegisterCustomFont(doc, institution) {
  const fontSpec = FONT_FILE_MAP[institution.id] || (institution.pdfFontName ? {
    name: institution.pdfFontName,
    file: `/fonts/${institution.pdfFontName}.ttf`,
    fontStyle: 'normal'
  } : null);

  if (!fontSpec) return 'Helvetica';

  try {
    const response = await fetch(fontSpec.file);
    if (!response.ok) {
      console.info(`[FontLoader] Custom font asset '${fontSpec.file}' not found. Falling back to standard Helvetica vector stack.`);
      return 'Helvetica';
    }

    const buffer = await response.arrayBuffer();
    const binaryFont = arrayBufferToBinaryString(buffer);

    // Register VFS file and add font face to jsPDF
    const vfsFileName = `${fontSpec.name}.ttf`;
    doc.addFileToVFS(vfsFileName, binaryFont);
    doc.addFont(vfsFileName, fontSpec.name, fontSpec.fontStyle);

    console.log(`[FontLoader] Successfully registered and embedded custom font glyphs for '${fontSpec.name}' into vector PDF.`);
    return fontSpec.name;
  } catch (err) {
    console.warn(`[FontLoader] Unable to load custom font '${fontSpec.file}':`, err);
    return 'Helvetica';
  }
}

export async function exportVectorizedPdf(institution, customerInfo, statementMeta, account, totals, filename = 'Official_Account_Statement.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  // Dynamically detect, register, and embed custom font file if dropped into /public/fonts/
  const bodyFontName = await loadAndRegisterCustomFont(doc, institution);

  // Pull institution-specific PDF metadata profile or fallback
  const metaProfile = institution.pdfMetadata || {};

  // Build 1:1 Exact PDF Property Object matching institution specs
  const pdfProps = {};

  pdfProps.title = metaProfile.title || `${institution.shortName} Monthly Account Statement - ${account.fullAccountNumber.slice(-4)}`;
  pdfProps.subject = metaProfile.subject || `Monthly Financial Account Statement for Period ${formatDate(statementMeta.startDate)} - ${formatDate(statementMeta.endDate)}`;

  if (metaProfile.author !== undefined) {
    if (metaProfile.author !== '') pdfProps.author = metaProfile.author;
  } else {
    pdfProps.author = `${institution.name} Core Enterprise Reporting Engine`;
  }

  if (metaProfile.creator !== undefined) {
    if (metaProfile.creator !== '') pdfProps.creator = metaProfile.creator;
  } else {
    pdfProps.creator = `${institution.shortName} Core Banking Document System (v24.1)`;
  }

  if (metaProfile.producer !== undefined) {
    if (metaProfile.producer !== '') pdfProps.producer = metaProfile.producer;
  } else {
    pdfProps.producer = 'Adobe PDF Library 15.0 / Core Financial Exporter';
  }

  if (metaProfile.keywords !== undefined) {
    if (metaProfile.keywords !== '') pdfProps.keywords = metaProfile.keywords;
  } else {
    pdfProps.keywords = `${institution.shortName}, Bank Statement, Account Summary, Financial Ledger, FDIC, NCUA, Reg DD`;
  }

  doc.setProperties(pdfProps);

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryHex = institution.accentColor || '#0f172a';
  let currentPage = 1;

  // Helper for multi-page headers & footers
  const renderHeader = (pageNumber) => {
    if (pageNumber > 1) {
      doc.setFont(bodyFontName, 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#475569');
      doc.text(institution.name, margin, 10);
      doc.text(`Account Number: ${account.fullAccountNumber}`, pageWidth / 2, 10, { align: 'center' });
      doc.text(`Page ${pageNumber}`, pageWidth - margin, 10, { align: 'right' });
      
      doc.setDrawColor('#cbd5e1');
      doc.setLineWidth(0.3);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  const renderFooter = (pageNumber, totalPages) => {
    doc.setFont(bodyFontName, 'normal');
    doc.setFontSize(7);
    doc.setTextColor('#94a3b8');
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  };

  // 1. PAGE 1 HEADER BRANDING & BARCODE
  doc.setFillColor(primaryHex);
  doc.rect(margin, y, 10, 10, 'F');

  doc.setTextColor('#ffffff');
  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(12);
  doc.text(institution.logoText?.[0] || 'A', margin + 3, y + 7);

  doc.setTextColor('#0f172a');
  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(16);
  doc.text(institution.name, margin + 14, y + 7);

  // Right Header: Routing & Contact
  doc.setFont(bodyFontName, 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#475569');
  doc.text(`Routing (ABA): ${institution.routingNumber}`, pageWidth - margin, y + 3, { align: 'right' });
  doc.text(`Support: ${institution.customerServicePhone}`, pageWidth - margin, y + 7, { align: 'right' });

  y += 14;

  // Document Barcode
  doc.setFillColor('#0f172a');
  [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2].forEach((w, i) => {
    doc.rect(margin + (i * 1.5), y, w * 0.3, 4, 'F');
  });
  doc.setFont('Courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor('#64748b');
  doc.text(`*DOC-${account.fullAccountNumber.slice(-4)}-2026*`, margin, y + 6.5);

  y += 9;

  // Vector Line Separator
  doc.setDrawColor('#cbd5e1');
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  // 2. CUSTOMER & STATEMENT PERIOD BLOCK
  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(11);
  doc.setTextColor('#0f172a');
  doc.text(customerInfo.name, margin, y);

  doc.setFont(bodyFontName, 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#475569');
  doc.text(customerInfo.address, margin, y + 4.5);
  doc.text(customerInfo.cityStateZip, margin, y + 9);

  // Right Side Account Meta Box
  doc.setFillColor('#f8fafc');
  doc.setDrawColor('#e2e8f0');
  doc.roundedRect(pageWidth - margin - 75, y - 3, 75, 16, 1, 1, 'FD');

  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(8);
  doc.setTextColor('#475569');
  doc.text('STATEMENT PERIOD', pageWidth - margin - 70, y + 1);
  doc.setFont('Courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor('#0f172a');
  doc.text(`${formatDate(statementMeta.startDate)} - ${formatDate(statementMeta.endDate)}`, pageWidth - margin - 70, y + 5.5);

  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(8);
  doc.setTextColor('#475569');
  doc.text('ACCOUNT NUMBER:', pageWidth - margin - 70, y + 10);
  doc.setFont('Courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor('#0f172a');
  doc.text(account.fullAccountNumber, pageWidth - margin - 35, y + 10);

  y += 20;

  // 3. ACCOUNT FINANCIAL SUMMARY BANNER
  doc.setFillColor('#f1f5f9');
  doc.rect(margin, y, contentWidth, 14, 'F');

  const colW = contentWidth / 4;
  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#64748b');

  doc.text('STARTING BALANCE', margin + 4, y + 4);
  doc.text('TOTAL DEPOSITS', margin + colW + 4, y + 4);
  doc.text('TOTAL WITHDRAWALS', margin + colW * 2 + 4, y + 4);
  doc.text('ENDING BALANCE', margin + colW * 3 + 4, y + 4);

  doc.setFont('Courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor('#0f172a');
  doc.text(formatCurrency(account.startingBalance), margin + 4, y + 10);
  doc.setTextColor('#059669');
  doc.text(`+${formatCurrency(totals.totalDeposits)}`, margin + colW + 4, y + 10);
  doc.setTextColor('#dc2626');
  doc.text(`-${formatCurrency(totals.totalWithdrawals)}`, margin + colW * 2 + 4, y + 10);
  doc.setTextColor('#1e3a8a');
  doc.text(formatCurrency(totals.endingBalance), margin + colW * 3 + 4, y + 10);

  y += 20;

  // 4. TRANSACTION LEDGER TABLE HEADER
  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(10);
  doc.setTextColor('#0f172a');
  doc.text('TRANSACTION LEDGER BREAKDOWN', margin, y);

  y += 4;

  doc.setFillColor('#0f172a');
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(8);
  doc.setTextColor('#ffffff');
  doc.text('DATE', margin + 3, y + 4.5);
  doc.text('DESCRIPTION / MERCHANT', margin + 28, y + 4.5);
  doc.text('TYPE', margin + 115, y + 4.5);
  doc.text('AMOUNT ($)', margin + 145, y + 4.5, { align: 'right' });
  doc.text('BALANCE ($)', pageWidth - margin - 3, y + 4.5, { align: 'right' });

  y += 7;

  // Table Rows (Vector Multi-page Loop with Running Headers)
  const txList = totals.processedTransactions || [];

  txList.forEach((tx, index) => {
    if (y > pageHeight - 20) {
      currentPage++;
      doc.addPage();
      renderHeader(currentPage);
      y = 18;

      // Repeat Table Header
      doc.setFillColor('#0f172a');
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont(bodyFontName, 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#ffffff');
      doc.text('DATE', margin + 3, y + 4.5);
      doc.text('DESCRIPTION / MERCHANT', margin + 28, y + 4.5);
      doc.text('TYPE', margin + 115, y + 4.5);
      doc.text('AMOUNT ($)', margin + 145, y + 4.5, { align: 'right' });
      doc.text('BALANCE ($)', pageWidth - margin - 3, y + 4.5, { align: 'right' });
      y += 7;
    }

    if (index % 2 === 1) {
      doc.setFillColor('#f8fafc');
      doc.rect(margin, y, contentWidth, 6, 'F');
    }

    doc.setDrawColor('#f1f5f9');
    doc.setLineWidth(0.2);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);

    doc.setFont('Courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#334155');
    doc.text(formatDate(tx.date), margin + 3, y + 4.2);

    doc.setFont(bodyFontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#0f172a');
    const descText = doc.splitTextToSize(tx.description, 82)[0];
    doc.text(descText, margin + 28, y + 4.2);

    doc.setFontSize(7.5);
    doc.setTextColor('#64748b');
    doc.text(tx.type || 'POS Debit', margin + 115, y + 4.2);

    doc.setFont('Courier', 'bold');
    doc.setFontSize(8);
    if (tx.amount >= 0) {
      doc.setTextColor('#059669');
      doc.text(`+${formatCurrency(tx.amount)}`, margin + 145, y + 4.2, { align: 'right' });
    } else {
      doc.setTextColor('#0f172a');
      doc.text(formatCurrency(tx.amount), margin + 145, y + 4.2, { align: 'right' });
    }

    doc.setTextColor('#0f172a');
    doc.text(formatCurrency(tx.runningBalance), pageWidth - margin - 3, y + 4.2, { align: 'right' });

    y += 6;
  });

  y += 8;

  // 5. REG DD FEE SUMMARY & REGULATORY FOOTER
  if (y > pageHeight - 45) {
    currentPage++;
    doc.addPage();
    renderHeader(currentPage);
    y = 18;
  }

  // Reg DD Box in PDF
  doc.setFillColor('#f8fafc');
  doc.setDrawColor('#e2e8f0');
  doc.rect(margin, y, contentWidth, 22, 'FD');

  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor('#0f172a');
  doc.text('FEDERAL REGULATION DD — SUMMARY OF FEES & OVERDRAFT CHARGES', margin + 3, y + 4.5);

  doc.setFont(bodyFontName, 'normal');
  doc.setFontSize(7);
  doc.setTextColor('#475569');
  doc.text('Total Overdraft Fees (This Period / YTD): $0.00 / $0.00', margin + 3, y + 10);
  doc.text('Total Returned Item Fees (This Period / YTD): $0.00 / $0.00', margin + 3, y + 14);
  doc.text('Account Maintenance & Service Fees (This Period / YTD): $0.00 / $0.00', margin + 3, y + 18);

  y += 26;

  doc.setDrawColor('#cbd5e1');
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 4;
  doc.setFont(bodyFontName, 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#475569');
  doc.text(`${institution.regulatoryBody} REGULATORY DISCLOSURE & IN CASE OF ERRORS`, margin, y);
  
  y += 3.5;
  doc.setFont(bodyFontName, 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor('#64748b');
  doc.text(
    `In case of errors or questions about electronic transfers, call ${institution.customerServicePhone} or write to ${institution.address}. ${institution.regulatoryNotice}`,
    margin,
    y,
    { maxWidth: contentWidth }
  );

  // Render footers for all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    renderFooter(i, totalPages);
  }

  // Save vectorized PDF document
  doc.save(filename);
}
