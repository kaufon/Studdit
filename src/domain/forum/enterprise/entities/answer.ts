import { AggregateRoot } from "@/core/entities/aggregate-root";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { AnswerAttachmentList } from "./answer-attachment-list";
import { AnswerCreatedEvent } from "../events/answer-created-event";

export type AnswerProps = {
	content: string;
	questionId: UniqueEntityId;
	authorId: UniqueEntityId;
	createdAt: Date;
	updatedAt?: Date | null;
	attachments: AnswerAttachmentList;
};

export class Answer extends AggregateRoot<AnswerProps> {
	get content(): string {
		return this.props.content;
	}

	get questionId(): UniqueEntityId {
		return this.props.questionId;
	}

	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined | null {
		return this.props.updatedAt;
	}
	get attachments(): AnswerAttachmentList {
		return this.props.attachments;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}
	set attachments(attachments: AnswerAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	static create(
		props: Optional<AnswerProps, "createdAt" | "attachments">,
		id?: UniqueEntityId,
	) {
		const answer = new Answer(
			{
				...props,
				attachments: props.attachments ?? new AnswerAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		const isNewAnswer = !id;
		if (isNewAnswer) {
			answer.addDomainEvent(new AnswerCreatedEvent(answer));
		}
		return answer;
	}
}
