-- AlterTable
ALTER TABLE "Wardrobe" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "url" TEXT;
