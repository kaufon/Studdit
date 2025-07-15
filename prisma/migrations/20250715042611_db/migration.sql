/*
  Warnings:

  - You are about to drop the column `answerId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_answerId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_questionId_fkey";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "answer_id" TEXT,
ADD COLUMN     "question_id" TEXT;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "answerId",
DROP COLUMN "questionId",
ADD COLUMN     "answer_id" TEXT,
ADD COLUMN     "question_id" TEXT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
