import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { z } from "zod";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
});
const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);
type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
export class CreateQuestionController {
	constructor(private readonly createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBody,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content } = body;
		const userId = user.sub;
		await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			atacchmentsIds: [],
		});
	}
}
