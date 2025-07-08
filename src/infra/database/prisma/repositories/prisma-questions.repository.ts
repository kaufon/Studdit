import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question.mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private readonly prismaService: PrismaService) {}
	async findBySlug(slug: string): Promise<Question | null> {
		const question = await this.prismaService.question.findUnique({
			where: {
				slug,
			},
		});
		if (!question) {
			return null;
		}
		return PrismaQuestionMapper.toDomain(question);
	}
	async findById(id: string): Promise<Question | null> {
		const question = await this.prismaService.question.findUnique({
			where: {
				id,
			},
		});
		if (!question) {
			return null;
		}
		return PrismaQuestionMapper.toDomain(question);
	}
	async findManyRecent(params: PaginationParams): Promise<Question[]> {
		const questions = await this.prismaService.question.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});
		return questions.map(PrismaQuestionMapper.toDomain);
	}
	async create(answer: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(answer);
		await this.prismaService.question.create({
			data,
		});
	}
	async save(answer: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(answer);
		await this.prismaService.question.update({
			where: {
				id: data.id,
			},
			data,
		});
	}
	async delete(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);
		await this.prismaService.question.delete({
			where: {
				id: data.id,
			},
		});
	}
}
