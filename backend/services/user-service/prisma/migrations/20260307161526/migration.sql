/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserProfile_phone_key";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");
