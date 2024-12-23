-- CreateTable
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "phone" TEXT NOT NULL
);

-- CopyData
INSERT INTO "new_User" ("id", "createdAt", "updatedAt", "email", "password", "company", "role", "zipCode", "phone", "firstName", "lastName")
SELECT "id", "createdAt", "updatedAt", "email", "password", "company", "role", "zipCode", "phone", 
       CASE WHEN instr("email", '@') > 0 THEN substr("email", 1, instr("email", '@') - 1) ELSE "email" END as "firstName",
       '' as "lastName"
FROM "User";

-- DropTable
DROP TABLE "User";

-- RenameTable
ALTER TABLE "new_User" RENAME TO "User";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

