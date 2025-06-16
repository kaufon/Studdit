import { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentRepository {
	findById(id: string): Promise<AnswerComment | null>;
	create(questionComment: AnswerComment): Promise<void>;
	findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>;
	// save(answer: Question): Promise<void>;
	delete(question: AnswerComment): Promise<void>;
}
