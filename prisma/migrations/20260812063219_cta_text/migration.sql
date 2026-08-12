-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "fields" TEXT NOT NULL,
    "gdprText" TEXT NOT NULL DEFAULT 'By submitting this form, you agree to let us store and process the information above to respond to your request.',
    "ctaText" TEXT NOT NULL DEFAULT 'Submit',
    "successMessage" TEXT NOT NULL DEFAULT 'Thanks! Your submission was received.',
    "redirectUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Form_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("createdAt", "description", "fields", "gdprText", "id", "isActive", "name", "redirectUrl", "slug", "successMessage", "updatedAt", "workspaceId") SELECT "createdAt", "description", "fields", "gdprText", "id", "isActive", "name", "redirectUrl", "slug", "successMessage", "updatedAt", "workspaceId" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_slug_key" ON "Form"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
