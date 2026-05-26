-- CreateTable
CREATE TABLE "OperationalEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actorUserId" TEXT,
    "familyId" TEXT,
    "metadataJson" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "OperationalEvent_level_eventName_idx" ON "OperationalEvent"("level", "eventName");

-- CreateIndex
CREATE INDEX "OperationalEvent_createdAt_idx" ON "OperationalEvent"("createdAt");
