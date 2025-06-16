export async function waitFor(
	assertions: () => void,
	maxDuration = 1000,
): Promise<void> {
	return new Promise((resolve, reject) => {
		let elapsed = 0;
		const interval = setInterval(() => {
			elapsed += 10;
			try {
				assertions();
				clearInterval(interval);
				resolve();
			} catch (error) {
				if (elapsed >= maxDuration) {
					clearInterval(interval);
					reject(new Error("Assertions failed after maximum duration"));
				}
			}
		}, 10);
	});
}
