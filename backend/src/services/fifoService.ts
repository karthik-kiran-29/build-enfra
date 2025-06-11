import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export interface GRNWithBalance {
  id: string;
  grnNumber: string;
  date: Date;
  quantity: number;
  rate: number;
  remainingQuantity: number;
}

export interface FIFOCalculationItem {
  grnId: string;
  grnNumber: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface FIFOCalculationResult {
  items: FIFOCalculationItem[];
  totalQuantity: number;
  weightedAverageRate: number;
  totalAmount: number;
  canFulfill: boolean;
  availableStock: number;
}

export class FIFOService {
  /**
   * Calculate available stock for a material
   */
  async getAvailableStock(materialId: string): Promise<number> {
    // Get total received quantity from GRNs
    const totalReceived = await prisma.gRN.aggregate({
      _sum: { quantity: true },
      where: { materialId }
    });

    // Get total issued quantity
    const totalIssued = await prisma.issueNote.aggregate({
      _sum: { totalQuantity: true },
      where: { materialId }
    });

    return (totalReceived._sum.quantity || 0) - (totalIssued._sum.totalQuantity || 0);
  }

  /**
   * Get GRNs with their remaining balances for FIFO calculation
   */
  async getGRNsWithBalance(materialId: string): Promise<GRNWithBalance[]> {
    // Get all GRNs for the material, ordered by date (FIFO)
    const grns = await prisma.gRN.findMany({
      where: { materialId },
      orderBy: { date: 'asc' },
      include: {
        issueItems: {
          select: {
            quantity: true
          }
        }
      }
    });

    // Calculate remaining quantity for each GRN
    return grns.map(grn => {
      const totalIssued = grn.issueItems.reduce((sum, item) => sum + item.quantity, 0);
      const remainingQuantity = grn.quantity - totalIssued;

      return {
        id: grn.id,
        grnNumber: grn.grnNumber,
        date: grn.date,
        quantity: grn.quantity,
        rate: grn.rate,
        remainingQuantity
      };
    }).filter(grn => grn.remainingQuantity > 0); // Only include GRNs with remaining stock
  }

  /**
   * Calculate FIFO breakdown for a given quantity
   */
  async calculateFIFO(materialId: string, requestedQuantity: number): Promise<FIFOCalculationResult> {
    const grnsWithBalance = await this.getGRNsWithBalance(materialId);
    const availableStock = grnsWithBalance.reduce((sum, grn) => sum + grn.remainingQuantity, 0);

    if (requestedQuantity > availableStock) {
      return {
        items: [],
        totalQuantity: 0,
        weightedAverageRate: 0,
        totalAmount: 0,
        canFulfill: false,
        availableStock
      };
    }

    const items: FIFOCalculationItem[] = [];
    let remainingToIssue = requestedQuantity;
    let totalAmount = 0;

    for (const grn of grnsWithBalance) {
      if (remainingToIssue <= 0) break;

      const quantityFromThisGRN = Math.min(remainingToIssue, grn.remainingQuantity);
      const amountFromThisGRN = quantityFromThisGRN * grn.rate;

      items.push({
        grnId: grn.id,
        grnNumber: grn.grnNumber,
        quantity: quantityFromThisGRN,
        rate: grn.rate,
        amount: amountFromThisGRN
      });

      totalAmount += amountFromThisGRN;
      remainingToIssue -= quantityFromThisGRN;
    }

    const weightedAverageRate = totalAmount / requestedQuantity;

    return {
      items,
      totalQuantity: requestedQuantity,
      weightedAverageRate,
      totalAmount,
      canFulfill: true,
      availableStock
    };
  }

  /**
   * Create an issue note with FIFO calculation
   */
  async createIssueNote(data: {
    materialId: string;
    quantity: number;
    issuedTo: string;
    purpose?: string;
    approvedBy: string;
  }) {
    const fifoResult = await this.calculateFIFO(data.materialId, data.quantity);

    if (!fifoResult.canFulfill) {
      throw new Error(`Insufficient stock. Available: ${fifoResult.availableStock}, Requested: ${data.quantity}`);
    }

    // Generate issue number
    const lastIssue = await prisma.issueNote.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { issueNumber: true }
    });

    const nextNumber = lastIssue 
      ? parseInt(lastIssue.issueNumber.split('/').pop() || '0') + 1
      : 1;
    
    const issueNumber = `ISN/${new Date().getFullYear()}/${nextNumber.toString()}`;

    // Create issue note with items in a transaction
    return await prisma.$transaction(async (tx) => {
      const issueNote = await tx.issueNote.create({
        data: {
          issueNumber,
          date: new Date(),
          materialId: data.materialId,
          totalQuantity: fifoResult.totalQuantity,
          weightedRate: fifoResult.weightedAverageRate,
          totalAmount: fifoResult.totalAmount,
          issuedTo: data.issuedTo,
          purpose: data.purpose,
          approvedBy: data.approvedBy
        }
      });

      // Create issue items
      await tx.issueItem.createMany({
        data: fifoResult.items.map(item => ({
          issueNoteId: issueNote.id,
          grnId: item.grnId,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      });

      return issueNote;
    });
  }

  /**
   * Get stock report for all materials
   */
  async getStockReport() {
    const materials = await prisma.material.findMany({
      include: {
        grns: {
          select: {
            quantity: true,
            totalAmount: true
          }
        },
        issues: {
          select: {
            totalQuantity: true,
            totalAmount: true
          }
        }
      }
    });

    return await Promise.all(materials.map(async (material) => {
      const availableStock = await this.getAvailableStock(material.id);
      const totalReceived = material.grns.reduce((sum, grn) => sum + grn.quantity, 0);
      const totalIssued = material.issues.reduce((sum, issue) => sum + issue.totalQuantity, 0);
      const totalReceivedValue = material.grns.reduce((sum, grn) => sum + grn.totalAmount, 0);
      const totalIssuedValue = material.issues.reduce((sum, issue) => sum + issue.totalAmount, 0);

      return {
        id: material.id,
        name: material.name,
        unit: material.unit,
        category: material.category,
        minStockLevel: material.minStockLevel,
        totalReceived,
        totalIssued,
        availableStock,
        stockValue: totalReceivedValue - totalIssuedValue,
        isLowStock: availableStock < material.minStockLevel
      };
    }));
  }
}