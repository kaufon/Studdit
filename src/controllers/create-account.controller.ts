import { Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller()
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}
	@Post("/accounts")
  @HttpCode(201)
	async handle(@Body() body: any) {
    const {name, email, password} = body;
    const userWithEmail = await this.prisma.user.findUnique({
    where: {
        email
      }
    })
    if (userWithEmail) {
      throw new ConflictException("Email already in use");
    }
		await this.prisma.user.create({
			data: {
				name,
				email,
				password, 
			},
		});
	}
}
