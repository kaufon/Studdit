import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

export const authenticateBodySchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string(),
});
export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;
@Controller("/sessions")
export class AuthenticateAccountController {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
	) {}
	@Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body;
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) {
			throw new UnauthorizedException("User credentials are invalid");
		}
		const isPasswordValid = await compare(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException("User credentials are invalid");
		}
		const acessToken = this.jwt.sign({ sub: user.id });
		return {
			acess_token: acessToken,
		};
	}
}
