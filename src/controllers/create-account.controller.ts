import {
	Controller,
	Post,
	HttpCode,
	UsePipes,
	Body,
	ConflictException,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";

import { z } from "zod";

export const createAccountBodySchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Controller()
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}

	@Post("/accounts")
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBody): Promise<void> {
		const { name, email, password } = body;
		const userWithEmail = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (userWithEmail) {
			throw new ConflictException("Email already in use");
		}
		const hashedPassword = await hash(password, 8);
		await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	}
}
