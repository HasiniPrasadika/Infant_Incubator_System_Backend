/*
  Warnings:

  - Added the required column `blood` to the `babies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cryStatus` to the `babies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cryTimeUpdate` to the `babies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jaundiceStatus` to the `babies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `babies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `babies` ADD COLUMN `blood` VARCHAR(191) NOT NULL,
    ADD COLUMN `cryStatus` ENUM('BURPING', 'TIRED', 'HUNGRY', 'DISCOMFORT', 'BELLY_PAIN') NOT NULL,
    ADD COLUMN `cryTimeUpdate` DATETIME(3) NOT NULL,
    ADD COLUMN `incubatorNo` INTEGER NULL,
    ADD COLUMN `jaundiceStatus` ENUM('NORMAL', 'ABNORMAL') NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
