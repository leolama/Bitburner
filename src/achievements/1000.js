/** @param {import("../../.").NS} ns */
export async function main(ns) {
	let i = 0;

	while (i <= 1000) {
		ns.run("scripts/1000-script.js", 1, i);
		++i;
	}
}