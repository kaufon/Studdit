export class Slug {
	public value: string;
	private constructor(value: string) {
		this.value = value;
	}
	static create(value: string) {
		return new Slug(value);
	}
	/**
	 *Reaceis a string and normalize as Slug
	 *
	 *
	 *  @param text {string}
	 * */

	static createFromText(text: string) {
		const slugText = text
			.normalize("NFKD")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_/g, "-")
			.replace(/--+/g, "-")
			.replace(/-$/g, "");

		return new Slug(slugText);
	}
}
