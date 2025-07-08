import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question.mapper";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentMapper } from "../mappers/prisma-student.mapper";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
	constructor(private readonly prismaService: PrismaService) {}
	async findByEmail(email: string): Promise<Student | null> {
		const student = await this.prismaService.user.findUnique({
			where: {
				email: email,
				role: "STUDENT",
			},
		});
		if (!student) {
			return null;
		}
		return PrismaStudentMapper.toDomain(student);
	}
	async create(answer: Student): Promise<void> {
		const data = PrismaStudentMapper.toPrisma(answer);
		await this.prismaService.user.create({
			data,
		});
	}
}
