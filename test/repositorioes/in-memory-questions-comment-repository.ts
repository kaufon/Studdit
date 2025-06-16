import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionsCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentRepository
	implements QuestionsCommentRepository
{
	public items: QuestionComment[] = [];

	async create(answer: QuestionComment): Promise<void> {
		this.items.push(answer);
	}
	async findById(id: string): Promise<QuestionComment | null> {
		const answer = this.items.find((item) => item.id.toString() === id);
		return answer ? answer : null;
	}
	async delete(question: QuestionComment): Promise<void> {
		const answerIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);
		this.items.splice(answerIndex, 1);
		return Promise.resolve();
	}
	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);
		return answers;
	}
}
