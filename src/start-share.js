/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var threads;
	threads = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
	threads /= ns.getScriptRam("/src/share.js", "home");
	threads = Math.floor(threads) - 8; //spares ~36GB RAM
	try {
		ns.run("/src/share.js", threads);
		ns.tprint('Started share.js with ' + threads + ' threads.')
	} catch {
		ns.tprint("Not enough RAM available to run share.js")
	}
}