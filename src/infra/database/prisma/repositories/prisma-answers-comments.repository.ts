import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment.mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!answerComment) {
			return null;
		}

		return PrismaAnswerCommentMapper.toDomain(answerComment);
	}

	async findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<AnswerComment[]> {
		const answerComments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return answerComments.map(PrismaAnswerCommentMapper.toDomain);
	}

	async create(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

		await this.prisma.comment.create({
			data,
		});
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: answerComment.id.toString(),
			},
		});
	}
}
