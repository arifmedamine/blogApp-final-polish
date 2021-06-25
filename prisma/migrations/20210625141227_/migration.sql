/*
  Warnings:

  - You are about to drop the `Issues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Issues" DROP CONSTRAINT "Issues_articleId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "issueId" INTEGER;

-- DropTable
DROP TABLE "Issues";

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "authorId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archive" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArchiveToArticle" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArchiveToIssue" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Archive_userId_unique" ON "Archive"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ArchiveToArticle_AB_unique" ON "_ArchiveToArticle"("A", "B");

-- CreateIndex
CREATE INDEX "_ArchiveToArticle_B_index" ON "_ArchiveToArticle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArchiveToIssue_AB_unique" ON "_ArchiveToIssue"("A", "B");

-- CreateIndex
CREATE INDEX "_ArchiveToIssue_B_index" ON "_ArchiveToIssue"("B");

-- AddForeignKey
ALTER TABLE "Article" ADD FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArchiveToArticle" ADD FOREIGN KEY ("A") REFERENCES "Archive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArchiveToArticle" ADD FOREIGN KEY ("B") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArchiveToIssue" ADD FOREIGN KEY ("A") REFERENCES "Archive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArchiveToIssue" ADD FOREIGN KEY ("B") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
