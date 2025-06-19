-- DropForeignKey
ALTER TABLE "Wardrobe" DROP CONSTRAINT "Wardrobe_typeId_fkey";

-- AlterTable
ALTER TABLE "Wardrobe" ALTER COLUMN "typeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Wardrobe" ADD CONSTRAINT "Wardrobe_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "WardrobeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
