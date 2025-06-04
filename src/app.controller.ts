import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Controller("/api")
export class AppController {
	constructor(
		private readonly prismaService: PrismaService,
	) {}

	@Get("/hello")
	async getHello() {
		return await this.prismaService.user.findMany();
	}
}
