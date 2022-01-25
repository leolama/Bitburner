/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	while (true) {
		await ns.share();
	}
}