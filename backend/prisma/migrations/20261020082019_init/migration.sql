-- CreateTable
CREATE TABLE "Artisan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trade" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "recommendations" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artisan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Artisan_trade_idx" ON "Artisan"("trade");

-- CreateIndex
CREATE INDEX "Artisan_neighborhood_idx" ON "Artisan"("neighborhood");
