import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotificationUseCase: SendNotificationUseCase,
	) {
		this.setupSuscription();
	}

	setupSuscription(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}
	private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);
		if (!question) {
			return;
		}
		await this.sendNotificationUseCase.execute({
			recipientID: question.autorId.toString(),
			title: `Nova resposta na pergunta "${question.title}"`,
			content: answer.excerpt,
		});
	}
}
