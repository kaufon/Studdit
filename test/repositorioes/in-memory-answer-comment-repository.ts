import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentRepository
	implements AnswerCommentRepository
{
	public items: AnswerComment[] = [];

	async create(answer: AnswerComment): Promise<void> {
		this.items.push(answer);
	}
	async findById(id: string): Promise<AnswerComment | null> {
		const answer = this.items.find((item) => item.id.toString() === id);
		return answer ? answer : null;
	}
	async delete(question: AnswerComment): Promise<void> {
		const answerIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);
		this.items.splice(answerIndex, 1);
		return Promise.resolve();
	}
	async findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<AnswerComment[]> {
		const answers = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);
		return answers;
	}
}
