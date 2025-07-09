import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export interface AnswerAttachmentsRepository {
	findManyByAnswerId(answerID: string): Promise<AnswerAttachment[]>;
	deleteManyByAnswerId(answerId: string): Promise<void>;
}
