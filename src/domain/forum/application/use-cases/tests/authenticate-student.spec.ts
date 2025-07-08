import { RegisterStudentUseCase } from "../register-student";
import { InMemoryStudentsRepository } from "test/repositorioes/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateStudentUseCase } from "../authenticate-student";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;
describe("Regist student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		sut = new AuthenticateStudentUseCase(
			inMemoryStudentsRepository,
			fakeHasher,
			fakeEncrypter,
		);
	});
	it("shoudl be able to authenticate student", async () => {
		const student = makeStudent({
			email: "johndoe@gmail.com",
			password: await fakeHasher.hash("123456"),
		});
		inMemoryStudentsRepository.items.push(student);
		const result = await sut.execute({
			email: "johndoe@gmail.com",
			password: "123456",
		});
		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			acessToken: expect.any(String),
		});
	});
});
