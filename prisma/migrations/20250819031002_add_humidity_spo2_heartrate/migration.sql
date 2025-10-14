-- CreateTable
CREATE TABLE `spo2s` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `spo2` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `heartrates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `heartRate` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `humidities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `spo2s` ADD CONSTRAINT `spo2s_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `heartrates` ADD CONSTRAINT `heartrates_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `humidities` ADD CONSTRAINT `humidities_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
