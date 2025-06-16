import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment, type QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityId,
) {
	const question = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
	return question;
}
