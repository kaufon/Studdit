import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { z } from "zod";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/public";

export const authenticateBodySchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string(),
});
export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Public()
@Controller("/sessions")
export class AuthenticateController {
	constructor(
		private readonly authenticateStudentUseCase: AuthenticateStudentUseCase,
	) {}
	@Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const result = await this.authenticateStudentUseCase.execute({
			email: body.email,
			password: body.password,
		});
		if (result.isLeft()) {
			const error = result.value;
			switch (error.constructor) {
				case WrongCredentialsError: {
					throw new UnauthorizedException(error.message);
				}
				default: {
					throw new BadRequestException("An unexpected error occurred");
				}
			}
		}
		const acessToken = result.value.acessToken;
		return {
			acess_token: acessToken,
		};
	}
}
