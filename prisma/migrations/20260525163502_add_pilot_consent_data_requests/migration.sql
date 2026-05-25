-- CreateTable
CREATE TABLE "PilotConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "familyId" TEXT,
    "scope" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" DATETIME,
    "noticeSnapshot" TEXT NOT NULL,
    CONSTRAINT "PilotConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PilotConsent_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyId" TEXT,
    "requestedById" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "requesterRole" TEXT NOT NULL,
    "requestSummary" TEXT NOT NULL,
    "handlerNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "DataRequest_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DataRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PilotConsent_userId_scope_status_idx" ON "PilotConsent"("userId", "scope", "status");

-- CreateIndex
CREATE INDEX "PilotConsent_familyId_scope_status_idx" ON "PilotConsent"("familyId", "scope", "status");

-- CreateIndex
CREATE INDEX "DataRequest_familyId_status_idx" ON "DataRequest"("familyId", "status");

-- CreateIndex
CREATE INDEX "DataRequest_requestedById_status_idx" ON "DataRequest"("requestedById", "status");
