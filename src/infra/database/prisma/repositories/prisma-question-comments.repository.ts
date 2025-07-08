import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionsCommentsRepository implements QuestionsCommentRepository{
    findById(id: string): Promise<QuestionComment | null> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
        throw new Error("Method not implemented.");
    }
    create(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(question: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
