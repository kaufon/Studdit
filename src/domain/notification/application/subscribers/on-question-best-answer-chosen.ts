import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import type { SendNotificationUseCase } from "../use-cases/send-notification";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChoosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private answersRepository: AnswerRepository,
		private sendNotificationUseCase: SendNotificationUseCase,
	) {
		this.setupSuscription();
	}

	setupSuscription(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChoosenEvent.name,
		);
	}
	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChoosenEvent) {
		console.log("chegou aqi");
		const answer = await this.answersRepository.findById(
			bestAnswerId.toString(),
		);
		if (!answer) {
			return;
		}
		await this.sendNotificationUseCase.execute({
			recipientID: answer.authorId.toString(),
			title: "Sua resposta foi escolhida!",
			content: `A resposta que voce enviou em ${question.title} foi escolhida como a melhor resposta da pergunta.`,
		});
	}
}
