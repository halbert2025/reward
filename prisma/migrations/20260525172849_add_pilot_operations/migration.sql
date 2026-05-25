-- CreateTable
CREATE TABLE "PilotFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyId" TEXT,
    "submittedById" TEXT,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "message" TEXT NOT NULL,
    "handlerNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PilotFeedback_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PilotFeedback_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyId" TEXT,
    "sourceType" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "summary" TEXT NOT NULL,
    "reviewerNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reviewedAt" DATETIME,
    CONSTRAINT "RiskSignal_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PilotFeedback_familyId_status_idx" ON "PilotFeedback"("familyId", "status");

-- CreateIndex
CREATE INDEX "PilotFeedback_status_type_idx" ON "PilotFeedback"("status", "type");

-- CreateIndex
CREATE INDEX "RiskSignal_familyId_status_idx" ON "RiskSignal"("familyId", "status");

-- CreateIndex
CREATE INDEX "RiskSignal_status_level_idx" ON "RiskSignal"("status", "level");
