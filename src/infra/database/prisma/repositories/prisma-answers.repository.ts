import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer.mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
	constructor(private readonly prisma: PrismaService) {}
	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		});

		if (!answer) {
			return null;
		}

		return PrismaAnswerMapper.toDomain(answer);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return answers.map(PrismaAnswerMapper.toDomain);
	}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await this.prisma.answer.create({
			data,
		});
	}

	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await Promise.all([
			this.prisma.answer.update({
				where: {
					id: answer.id.toString(),
				},
				data,
			}),
		]);
	}

	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.delete({
			where: {
				id: answer.id.toString(),
			},
		});
	}
}
