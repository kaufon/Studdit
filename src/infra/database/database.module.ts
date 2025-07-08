import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions.repository";
import { PrismaQuestionsCommentsRepository } from "./prisma/repositories/prisma-question-comments.repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments.repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answers.repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answers-comments.repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answers-attachments.repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students.repository";

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
		PrismaQuestionsCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswerRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswerAttachmentsRepository,
	],
	exports: [
		PrismaService,
		StudentsRepository,
		QuestionsRepository,
		PrismaQuestionsCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswerRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswerAttachmentsRepository,
	],
})
export class DatabaseModule {}
