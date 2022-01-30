/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var threads;
	threads = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
	threads /= ns.getScriptRam("/src/share.js", "home");
	threads = Math.floor(threads) - 5; //spares ~20GB RAM

	ns.run("/src/share.js", threads);
}