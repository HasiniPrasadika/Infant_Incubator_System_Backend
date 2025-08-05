/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `product_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `service_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `product_categories_name_key` ON `product_categories`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `service_categories_name_key` ON `service_categories`(`name`);
