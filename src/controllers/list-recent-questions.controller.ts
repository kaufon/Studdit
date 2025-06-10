import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const pageQueryPAramSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryPAramSchema);
type PageQueryParam = z.infer<typeof pageQueryPAramSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class ListQuestionsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	async handle(@Query("page", queryValidationPipe) page: PageQueryParam) {
		const perPage = 1;
		const questions = await this.prisma.question.findMany({
			take: perPage,
      skip: (page - 1) * perPage,
			orderBy: {
				createdAt: "desc",
			},
		});
		return { questions };
	}
}
