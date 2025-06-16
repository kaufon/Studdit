import { WatchedList } from "../watched-list";

class NumbersWatchedList extends WatchedList<number> {
	compareItems(a: number, b: number): boolean {
		return a === b;
	}
}
describe("watched list", () => {
	it("should return the current items", () => {
		const list = new NumbersWatchedList([1, 2, 3]);
		expect(list.currentItems).toHaveLength(3);
	});
	it("should be able to add new items ti the list", () => {
		const list = new NumbersWatchedList([1, 2, 3]);
		list.add(4);
		expect(list.currentItems).toHaveLength(4);
		expect(list.getNewItems()).toEqual([4]);
	});
	it("should be able to remove new items ti the list", () => {
		const list = new NumbersWatchedList([1, 2, 3]);
		list.remove(2);
		expect(list.currentItems).toHaveLength(2);
		expect(list.getRemovedItems()).toEqual([2]);
	});
	it("it should be able to add an item even if it was removed before", () => {
		const list = new NumbersWatchedList([1, 2, 3]);
		list.remove(2);
		list.add(2);
		expect(list.currentItems).toHaveLength(3);
		expect(list.getRemovedItems()).toEqual([]);
		expect(list.getNewItems()).toEqual([]);
	});
	it("it should be able to remove an item even if it was added before", () => {
		const list = new NumbersWatchedList([1, 2, 3]);
		list.add(4);
		list.remove(4);
		expect(list.currentItems).toHaveLength(3);
		expect(list.getRemovedItems()).toEqual([]);
		expect(list.getNewItems()).toEqual([]);
	});
	it("it should be able to update an list", () => {
		const list = new NumbersWatchedList([1, 2, 3]);
		list.update([1, 3, 5]);
		expect(list.getRemovedItems()).toEqual([2]);
		expect(list.getNewItems()).toEqual([5]);
	});
});
