import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
});
const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);
type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	private generateSlug(title: string): string {
		return title
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBody,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content } = body;
		const userId = user.sub;
		const slug = this.generateSlug(title);

		await this.prisma.question.create({
			data: {
				authorId: userId,
				title,
				content,
				slug,
			},
		});
	}
}
