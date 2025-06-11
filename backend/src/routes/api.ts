import express, { Request, Response } from 'express';
import  {PrismaClient}  from '../generated/prisma/client';
import { FIFOService } from '../services/fifoService';

const router = express.Router();
const prisma = new PrismaClient();
const fifoService = new FIFOService();

// ========== MATERIAL MANAGEMENT ==========

// Get all materials
router.get('/materials', async (_req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Create material
router.post('/materials', async (req, res) => {
  try {
    const { name, unit, category, minStockLevel } = req.body;
    
    const material = await prisma.material.create({
      data: { name, unit, category, minStockLevel }
    });
    
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create material' });
  }
});

// Get material by ID
router.get('/materials/:id', async (req: any, res: any) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id: req.params.id },
      include: {
        grns: { orderBy: { date: 'desc' } },
        issues: { orderBy: { date: 'desc' } }
      }
    });
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    const availableStock = await fifoService.getAvailableStock(material.id);
    
    res.json({
      ...material,
      availableStock
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch material' });
  }
});

// Update material
router.put('/materials/:id', async (req, res) => {
  try {
    const { name, unit, category, minStockLevel } = req.body;
    
    const material = await prisma.material.update({
      where: { id: req.params.id },
      data: { name, unit, category, minStockLevel }
    });
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// ========== GRN MANAGEMENT ==========

// Get all GRNs
router.get('/grns', async (req, res) => {
  try {
    const { materialId, startDate, endDate } = req.query;
    
    const where: any = {};
    if (materialId) where.materialId = materialId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
    
    const grns = await prisma.gRN.findMany({
      where,
      include: { material: true },
      orderBy: { date: 'desc' }
    });
    
    res.json(grns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GRNs' });
  }
});

// Create GRN
router.post('/grns', async (req, res) => {
  try {
    const {
      materialId,
      quantity,
      rate,
      supplierName,
      invoiceRef,
      receivedBy,
      remarks
    } = req.body;
    
    // Generate GRN number
    const lastGRN = await prisma.gRN.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { grnNumber: true }
    });
    
    const nextNumber = lastGRN 
      ? parseInt(lastGRN.grnNumber.split('/').pop() || '0') + 1
      : 1;
    
    const grnNumber = `GRN/${new Date().getFullYear()}/${nextNumber.toString().padStart(3, '0')}`;
    
    const grn = await prisma.gRN.create({
      data: {
        grnNumber,
        date: new Date(),
        materialId,
        quantity: parseFloat(quantity),
        rate: parseFloat(rate),
        totalAmount: parseFloat(quantity) * parseFloat(rate),
        supplierName,
        invoiceRef,
        receivedBy,
        remarks
      },
      include: { material: true }
    });
    
    res.status(201).json(grn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create GRN' });
  }
});

// Get GRN by ID
router.get('/grns/:id', async (req: any, res: any) => {
  try {
    const grn = await prisma.gRN.findUnique({
      where: { id: req.params.id },
      include: { 
        material: true,
        issueItems: {
          include: {
            issueNote: true
          }
        }
      }
    });
    
    if (!grn) {
      return res.status(404).json({ error: 'GRN not found' });
    }
    
    res.json(grn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GRN' });
  }
});

// ========== ISSUE NOTE MANAGEMENT ==========

// Preview FIFO calculation
router.post('/issues/preview', async (req, res) => {
  try {
    const { materialId, quantity } = req.body;
    
    const fifoResult = await fifoService.calculateFIFO(
      materialId,
      parseFloat(quantity)
    );
    
    res.json(fifoResult);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate FIFO preview' });
  }
});

// Get all issue notes
router.get('/issues', async (req, res) => {
  try {
    const { materialId, startDate, endDate } = req.query;
    
    const where: any = {};
    if (materialId) where.materialId = materialId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
    
    const issues = await prisma.issueNote.findMany({
      where,
      include: { material: true },
      orderBy: { date: 'desc' }
    });
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issue notes' });
  }
});

// Create issue note
router.post('/issues', async (req, res) => {
  try {
    const { materialId, quantity, issuedTo, purpose, approvedBy } = req.body;
    
    const issueNote = await fifoService.createIssueNote({
      materialId,
      quantity: parseFloat(quantity),
      issuedTo,
      purpose,
      approvedBy
    });
    
    res.status(201).json(issueNote);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create issue note';
    res.status(400).json({ error: message });
  }
});

router.get('/issues/:id', async (req: any, res: any) => {
  try {
    const issue = await prisma.issueNote.findUnique({
      where: { id: req.params.id },
      include: {
        material: true,
        issueItems: {
          include: {
            grn: true
          }
        }
      }
    });
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue note not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issue note' });
  }
});


// ========== STOCK REPORTS ==========

router.get('/stock/current', async (_req: Request, res: Response) => {
  try {
    const stockReport = await fifoService.getStockReport();
    res.json(stockReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate stock report' });
  }
});


// Stock movements for a material
router.get('/stock/movements/:materialId', async (req, res) => {
  try {
    const { materialId } = req.params;
    const { startDate, endDate } = req.query;
    
    const where: any = { materialId };
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
    
    const grns = await prisma.gRN.findMany({
      where,
      orderBy: { date: 'asc' }
    });
    
    const issues = await prisma.issueNote.findMany({
      where,
      orderBy: { date: 'asc' }
    });
    
    // Combine and sort by date
    const movements = [
      ...grns.map(grn => ({
        type: 'GRN',
        date: grn.date,
        reference: grn.grnNumber,
        quantity: grn.quantity,
        rate: grn.rate,
        amount: grn.totalAmount,
        balance: 0 // Will be calculated
      })),
      ...issues.map(issue => ({
        type: 'ISSUE',
        date: issue.date,
        reference: issue.issueNumber,
        quantity: -issue.totalQuantity,
        rate: issue.weightedRate,
        amount: -issue.totalAmount,
        balance: 0 // Will be calculated
      }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate running balance
    let runningBalance = 0;
    movements.forEach(movement => {
      runningBalance += movement.quantity;
      movement.balance = runningBalance;
    });
    
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock movements' });
  }
});

router.get('/dashboard/summary', async (_req: Request, res: Response) => {
  try {
    const totalMaterials = await prisma.material.count();
    const totalGRNs = await prisma.gRN.count();
    const totalIssues = await prisma.issueNote.count();
    
    const recentGRNs = await prisma.gRN.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { material: true }
    });
    
    const recentIssues = await prisma.issueNote.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { material: true }
    });
    
    const stockReport = await fifoService.getStockReport();
    const lowStockMaterials = stockReport.filter(item => item.isLowStock);
    
    res.json({
      totalMaterials,
      totalGRNs,
      totalIssues,
      lowStockCount: lowStockMaterials.length,
      recentGRNs,
      recentIssues,
      lowStockMaterials
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

export default router;