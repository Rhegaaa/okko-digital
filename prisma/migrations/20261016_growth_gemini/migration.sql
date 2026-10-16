CREATE TABLE "GrowthCredential" (
  "id" TEXT NOT NULL,
  "encryptedKey" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "freeTierConfirmedAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GrowthCredential_pkey" PRIMARY KEY ("id")
);
