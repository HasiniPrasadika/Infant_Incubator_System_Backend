/*
  Warnings:

  - You are about to drop the column `level` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customers` DROP COLUMN `level`,
    ADD COLUMN `levelId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `customer_levels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `minSpent` DECIMAL(10, 2) NOT NULL,
    `maxSpent` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customer_levels_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `customer_levels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
