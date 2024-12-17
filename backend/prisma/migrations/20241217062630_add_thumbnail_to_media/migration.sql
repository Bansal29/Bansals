/*
  Warnings:

  - You are about to drop the column `uploaderId` on the `Media` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_uploaderId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "uploaderId",
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
