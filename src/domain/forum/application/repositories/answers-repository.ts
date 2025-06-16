import { PaginationParams } from "@/core/repositories/pagination-params"
import type { Answer } from "../../enterprise/entities/answer" 

export interface AnswerRepository {
  create(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
}
