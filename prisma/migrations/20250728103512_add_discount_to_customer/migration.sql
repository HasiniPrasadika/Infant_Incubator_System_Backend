-- AlterTable
ALTER TABLE `customer_levels` ADD COLUMN `discount` DECIMAL(5, 2) NULL;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `discount` DECIMAL(5, 2) NULL;
