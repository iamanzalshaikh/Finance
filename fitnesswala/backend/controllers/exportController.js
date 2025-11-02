import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction.js';

export const exportCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    const fields = ['date', 'type', 'category', 'description', 'amount', 'currency'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Financial Transactions Report', { align: 'center' });
    doc.moveDown();

    transactions.forEach((tx) => {
      doc.fontSize(10);
      doc.text(`${tx.date.toDateString()} | ${tx.type.toUpperCase()} | ${tx.category}`);
      doc.text(`${tx.description} - ${tx.amount} ${tx.currency}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
