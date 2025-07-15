import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { QuestionPresenter } from "@/infra/http/presenters/question.presenter";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
	constructor(
		private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
	) {}

	@Get()
	async handle(@Param("slug") slug: string) {
		const result = await this.getQuestionBySlugUseCase.execute({
			slug,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return { question: QuestionPresenter.toHTTP(result.value.question) };
	}
}
