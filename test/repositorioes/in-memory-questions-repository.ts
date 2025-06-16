import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	constructor(
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}
	public items: Question[] = [];

	async create(answer: Question): Promise<void> {
		this.items.push(answer);
	}
	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);
		return question ? question : null;
	}
	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((item) => item.id.toString() === id);
		return question ? question : null;
	}
	async delete(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);
		this.items.splice(questionIndex, 1);
		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
		return Promise.resolve();
	}
	async save(answer: Question): Promise<void> {
		const questionIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);
		this.items[questionIndex] = answer;
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);
		return questions;
	}
}
