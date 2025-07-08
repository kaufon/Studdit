import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { Injectable } from "@nestjs/common";
import { Prisma, User as PrismaUser } from "@prisma/client";

@Injectable()
export class PrismaStudentMapper {
	static toDomain(prismaUser: PrismaUser): Student {
		return Student.create(
			{
				name: prismaUser.name,
				email: prismaUser.email,
				password: prismaUser.password,
			},
			new UniqueEntityId(prismaUser.id),
		);
	}

	static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: student.id.toString(),
			name: student.name,
			email: student.email,
			password: student.password,
		};
	}
}
