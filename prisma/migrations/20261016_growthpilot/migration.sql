-- CreateTable
CREATE TABLE "GrowthState" (
    "id" TEXT NOT NULL DEFAULT 'okko',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "leaseUntil" TIMESTAMP(3),
    "leaseOwner" TEXT,
    "lastHeartbeat" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthOpportunity" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "cluster" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "commercialPath" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "evidence" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthArticle" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "checks" JSONB,
    "sources" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthRevision" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthRun" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "logs" JSONB NOT NULL DEFAULT '[]',
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "apiCostCents" INTEGER NOT NULL DEFAULT 0,
    "articleId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthBacklink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "proposal" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPPORTUNITY',
    "verifiedAt" TIMESTAMP(3),
    "checkedAt" TIMESTAMP(3),
    "target" TEXT,
    "rel" TEXT,
    "evidence" TEXT,
    "automationAllowed" BOOLEAN NOT NULL DEFAULT false,
    "permissionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthBacklink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthMetric" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GrowthMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthSnapshot" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrowthOpportunity_topic_key" ON "GrowthOpportunity"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthArticle_opportunityId_key" ON "GrowthArticle"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthArticle_slug_key" ON "GrowthArticle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthBacklink_url_key" ON "GrowthBacklink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthMetric_day_path_event_key" ON "GrowthMetric"("day", "path", "event");

-- AddForeignKey
ALTER TABLE "GrowthArticle" ADD CONSTRAINT "GrowthArticle_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "GrowthOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthRevision" ADD CONSTRAINT "GrowthRevision_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "GrowthArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

