import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { exportCSV, exportPDF } from '../controllers/exportController.js';

const exportRoutes = express.Router();


// Download transactions as CSV or PDF
exportRoutes.get('/csv',authMiddleware ,exportCSV);
exportRoutes.get('/pdf',authMiddleware, exportPDF);

export default exportRoutes;
