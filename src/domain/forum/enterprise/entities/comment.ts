
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

export type CommentProps = {
	content: string;
	authorId: UniqueEntityId;
	createdAt: Date;
	updatedAt?: Date;
};

export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
	get content(): string {
		return this.props.content;
	}

	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined {
		return this.props.updatedAt;
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
}
