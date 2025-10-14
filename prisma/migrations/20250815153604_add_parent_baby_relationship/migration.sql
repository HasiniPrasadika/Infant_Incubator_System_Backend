/*
  Warnings:

  - You are about to drop the column `parentId` on the `babies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `babies` DROP FOREIGN KEY `babies_parentId_fkey`;

-- DropIndex
DROP INDEX `babies_parentId_fkey` ON `babies`;

-- AlterTable
ALTER TABLE `babies` DROP COLUMN `parentId`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `babyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `babies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
