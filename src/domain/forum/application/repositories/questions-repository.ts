import { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "../../enterprise/entities/question";

export abstract class QuestionsRepository {
	abstract findBySlug(slug: string): Promise<Question | null>;
	abstract findById(id: string): Promise<Question | null>;
	abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
	abstract create(answer: Question): Promise<void>;
	abstract save(answer: Question): Promise<void>;
	abstract delete(question: Question): Promise<void>;
}
