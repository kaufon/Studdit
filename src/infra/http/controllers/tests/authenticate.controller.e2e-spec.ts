import { DatabaseModule } from "@/infra/database/database.module";
import { AppModule } from "../../../app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
describe("create account e2e", () => {
	let app: INestApplication;
	let studentFactory: StudentFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule,DatabaseModule],
      providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		await app.init();
	});
	test("POST /sessions", async () => {
    await studentFactory.makePrismaStudent({
      email: "johndoe@example.com",
      password: await hash("password123", 6),
    })
		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "johndoe@example.com",
			password: "password123",
		});
		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			acess_token: expect.any(String),
		});
	});
});
