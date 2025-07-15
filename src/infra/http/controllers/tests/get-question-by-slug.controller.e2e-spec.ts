import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("GEt question by slug E2E", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();
		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);
		await app.init();
	});
	test("GET /questions/:slug", async () => {
		const user = await studentFactory.makePrismaStudent();
		const accessToken = jwt.sign({ sub: user.id.toString() });
		await questionFactory.makePrismaQuestion({
			autorId: user.id,
			title: "Question 01",
			slug: Slug.create("question-01"),
		});
		const response = await request(app.getHttpServer())
			.get("/questions/question-01")
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.statusCode).toBe(200);
		expect(response.body.question).toEqual(
			expect.objectContaining({
				title: "Question 01",
			}),
		);
	});
});
