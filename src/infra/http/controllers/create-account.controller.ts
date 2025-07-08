import {
	Controller,
	Post,
	UsePipes,
	Body,
	ConflictException,
	BadRequestException,
} from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";

import { z } from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { StudentWithSameEmailError } from "@/domain/forum/application/use-cases/errors/student-with-same-email-error";
import { Public } from "@/infra/auth/public";

export const createAccountBodySchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Public()
@Controller()
export class CreateAccountController {
	constructor(private registerStudentUseCase: RegisterStudentUseCase) {}

	@Post("/accounts")
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBody): Promise<void> {
		const { name, email, password } = body;
		const result = await this.registerStudentUseCase.execute({
			name,
			email,
			password,
		});
		if (result.isLeft()) {
			const error = result.value;
			switch (error.constructor) {
				case StudentWithSameEmailError: {
					throw new ConflictException(error.message);
				}
				default: {
					throw new BadRequestException("An unexpected error occurred");
				}
			}
		}
	}
}
