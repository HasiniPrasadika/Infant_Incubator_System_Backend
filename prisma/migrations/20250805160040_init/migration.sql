/*
  Warnings:

  - You are about to drop the column `branchId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `joinedDate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to drop the `booking_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee_bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee_service_commissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking_services` DROP FOREIGN KEY `booking_services_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `booking_services` DROP FOREIGN KEY `booking_services_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `branch_services` DROP FOREIGN KEY `branch_services_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `branch_services` DROP FOREIGN KEY `branch_services_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `employee_bookings` DROP FOREIGN KEY `employee_bookings_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `employee_bookings` DROP FOREIGN KEY `employee_bookings_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee_service_commissions` DROP FOREIGN KEY `employee_service_commissions_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee_service_commissions` DROP FOREIGN KEY `employee_service_commissions_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `services_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_branchId_fkey`;

-- DropIndex
DROP INDEX `users_branchId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `branchId`,
    DROP COLUMN `joinedDate`,
    DROP COLUMN `location`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'DOCTOR', 'NURSE', 'PARENT') NOT NULL;

-- DropTable
DROP TABLE `booking_services`;

-- DropTable
DROP TABLE `bookings`;

-- DropTable
DROP TABLE `branch_services`;

-- DropTable
DROP TABLE `branches`;

-- DropTable
DROP TABLE `brands`;

-- DropTable
DROP TABLE `customer_levels`;

-- DropTable
DROP TABLE `customers`;

-- DropTable
DROP TABLE `employee_bookings`;

-- DropTable
DROP TABLE `employee_service_commissions`;

-- DropTable
DROP TABLE `product_categories`;

-- DropTable
DROP TABLE `products`;

-- DropTable
DROP TABLE `service_categories`;

-- DropTable
DROP TABLE `services`;
