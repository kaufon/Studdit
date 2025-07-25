import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaQuestionAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-question-attachemnt.mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}
	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const questionAttachments = await this.prisma.attachment.findMany({
			where: {
				questionId,
			},
		});

		return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
	}
	async deleteManyByQuestionId(questionId: string): Promise<void> {
		await this.prisma.attachment.deleteMany({
			where: {
				questionId,
			},
		});
	}
}
