import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswerRepository {
	public items: Answer[] = [];

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find((item) => item.id.toString() === id);
		return answer ? answer : null;
	}
	async delete(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);
		this.items.splice(answerIndex, 1);
		return Promise.resolve();
	}
	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);
		this.items[answerIndex] = answer;
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);
		return answers;
	}
}
