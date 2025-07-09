import { type Either, left, right } from "../either";

function doSomething(shouldSucess: boolean): Either<string, number> {
	if (shouldSucess) {
		return right(10);
	}
	return left("error");
}

test("sucess result", () => {
	const sucess = doSomething(true);
	expect(sucess.value).toEqual(10);
	expect(sucess.isRight()).toBe(true);
	expect(sucess.isLeft()).toBe(false);
});
test("error result", () => {
	const error = doSomething(false);
	expect(error.value).toEqual("error");
	expect(error.isLeft()).toBe(true);
	expect(error.isRight()).toBe(false);
});
