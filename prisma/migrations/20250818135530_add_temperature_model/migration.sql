-- CreateTable
CREATE TABLE `temperatures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `temperatures` ADD CONSTRAINT `temperatures_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
