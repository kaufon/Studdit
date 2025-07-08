import { RegisterStudentUseCase } from "../register-student";
import { InMemoryStudentsRepository } from "test/repositorioes/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;
describe("Regist student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();
		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
	});
	it("shoudl be able to register student", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "johndoe@gmai.com",
			password: "123456",
		});
		expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
		expect(inMemoryStudentsRepository.items[0].name).toEqual("John Doe");
    const hashedPassword = await fakeHasher.hash("123456");
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
	});
});
