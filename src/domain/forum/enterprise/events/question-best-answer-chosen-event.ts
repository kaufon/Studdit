import type { DomainEvent } from "@/core/events/domain-event";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Question } from "../entities/question";

export class QuestionBestAnswerChoosenEvent implements DomainEvent {
	public occuredAt: Date;
	public question: Question;
	public bestAnswerId: UniqueEntityId;
	constructor(question: Question, bestAnswerId: UniqueEntityId) {
		this.question = question;
		this.bestAnswerId = bestAnswerId;
		this.occuredAt = new Date();
	}
	getAggregateId(): UniqueEntityId {
		return this.question.id;
	}
}
