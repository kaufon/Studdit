import { Slug } from "./value-objets/slug";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChoosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
	title: string;
	content: string;
	autorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId | null;
	createdAt: Date;
	updatedAt?: Date | null;
	slug: Slug;
	attachments: QuestionAttachmentList;
}

export class Question extends AggregateRoot<QuestionProps> {
	get title(): string {
		return this.props.title;
	}

	get slug(): Slug {
		return this.props.slug;
	}

	get autorId(): UniqueEntityId {
		return this.props.autorId;
	}

	get content(): string {
		return this.props.content;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined | null {
		return this.props.updatedAt;
	}

	get bestAnswerId(): UniqueEntityId | undefined | null {
		return this.props.bestAnswerId;
	}
	get attachments(): QuestionAttachmentList {
		return this.props.attachments;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}
	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set bestAnswerId(answerId: UniqueEntityId | undefined | null) {
		if (answerId) {
			this.addDomainEvent(new QuestionBestAnswerChoosenEvent(this, answerId));
		}
		this.props.bestAnswerId = answerId;
		this.touch();
	}

	static create(
		props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
		id?: UniqueEntityId,
	) {
		const question = new Question(
			{
				...props,
				attachments: props.attachments ?? new QuestionAttachmentList(),
				slug: props.slug ?? Slug.createFromText(props.title),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return question;
	}
}
