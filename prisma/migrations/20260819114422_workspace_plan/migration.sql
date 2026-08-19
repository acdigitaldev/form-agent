-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'free';
ALTER TABLE "Workspace" ADD COLUMN "billingInterval" TEXT;
