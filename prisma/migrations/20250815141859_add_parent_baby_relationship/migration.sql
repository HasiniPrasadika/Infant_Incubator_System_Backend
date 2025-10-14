-- AlterTable
ALTER TABLE `babies` ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `babies` ADD CONSTRAINT `babies_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
