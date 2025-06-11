-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minStockLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grns" (
    "id" TEXT NOT NULL,
    "grnNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "supplierName" TEXT NOT NULL,
    "invoiceRef" TEXT,
    "receivedBy" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_notes" (
    "id" TEXT NOT NULL,
    "issueNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "materialId" TEXT NOT NULL,
    "totalQuantity" DOUBLE PRECISION NOT NULL,
    "weightedRate" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "issuedTo" TEXT NOT NULL,
    "purpose" TEXT,
    "approvedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_items" (
    "id" TEXT NOT NULL,
    "issueNoteId" TEXT NOT NULL,
    "grnId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "issue_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grns_grnNumber_key" ON "grns"("grnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "issue_notes_issueNumber_key" ON "issue_notes"("issueNumber");

-- AddForeignKey
ALTER TABLE "grns" ADD CONSTRAINT "grns_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_notes" ADD CONSTRAINT "issue_notes_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_items" ADD CONSTRAINT "issue_items_issueNoteId_fkey" FOREIGN KEY ("issueNoteId") REFERENCES "issue_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_items" ADD CONSTRAINT "issue_items_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "grns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
