import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ListQuestionsController } from "./controllers/list-recent-questions.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { ListRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/list-recent-questions";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { GetQuestionBySlugController } from "@/infra/http/controllers/get-question-by-slug.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		ListQuestionsController,
		CreateQuestionController,
    GetQuestionBySlugController
	],
	providers: [
		{
			provide: CreateQuestionUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new CreateQuestionUseCase(questionsRepository);
			},
			inject: [QuestionsRepository],
		},
		{
			provide: ListRecentQuestionsUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new ListRecentQuestionsUseCase(questionsRepository);
			},
			inject: [QuestionsRepository],
		},
		{
			provide: AuthenticateStudentUseCase,
			useFactory: (
				studentsRepository: StudentsRepository,
				hashComparer: HashComparer,
				encrypter: Encrypter,
			): AuthenticateStudentUseCase => {
				return new AuthenticateStudentUseCase(
					studentsRepository,
					hashComparer,
					encrypter,
				);
			},
			inject: [StudentsRepository, HashComparer, Encrypter],
		},
		{
			provide: RegisterStudentUseCase,
			useFactory: (
				studentsRepository: StudentsRepository,
				hashGenerator: HashGenerator,
			) => {
				return new RegisterStudentUseCase(studentsRepository, hashGenerator);
			},
			inject: [StudentsRepository, HashComparer],
		},
		{
			provide: GetQuestionBySlugUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new GetQuestionBySlugUseCase(questionsRepository);
			},
			inject: [QuestionsRepository],
		},
	],
})
export class HttpModule {}
