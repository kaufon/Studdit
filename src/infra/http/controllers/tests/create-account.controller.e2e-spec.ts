import { AppModule } from "../../../app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service"; 
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
describe("create account e2e", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);
		await app.init();
	});
	test("POST /accounts", async () => {
		const response = await request(app.getHttpServer()).post("/accounts").send({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "password123",
		});
		expect(response.statusCode).toBe(201);
		const userOnDatabase = await prisma.user.findUnique({
			where: { email: "johndoe@example.com" },
		});
    expect(userOnDatabase).toBeTruthy()
	});
});
