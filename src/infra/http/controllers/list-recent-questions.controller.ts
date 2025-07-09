import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { z } from "zod";
import { ListRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/list-recent-questions";
import { QuestionPresenter } from "../presenters/question.presenter";

const pageQueryPAramSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryPAramSchema);
type PageQueryParam = z.infer<typeof pageQueryPAramSchema>;

@Controller("/questions")
export class ListQuestionsController {
	constructor(
		private readonly listQuestionsUseCase: ListRecentQuestionsUseCase,
	) {}

	@Get()
	async handle(@Query("page", queryValidationPipe) page: PageQueryParam) {
		const result = await this.listQuestionsUseCase.execute({
			page: page,
		});
		if (result.isLeft()) {
			throw new Error();
		}
		const questions = result.value.questions;
		return { questions: questions.map(QuestionPresenter.toHTTP) };
	}
}
