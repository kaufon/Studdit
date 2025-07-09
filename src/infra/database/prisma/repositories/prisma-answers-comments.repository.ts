import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentRepository {
	findById(id: string): Promise<AnswerComment | null> {
		throw new Error("Method not implemented.");
	}
	create(questionComment: AnswerComment): Promise<void> {
		throw new Error("Method not implemented.");
	}
	findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]> {
		throw new Error("Method not implemented.");
	}
	delete(question: AnswerComment): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
