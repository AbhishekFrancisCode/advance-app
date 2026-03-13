-- AlterTable
ALTER TABLE "DeadLetterEvent" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
