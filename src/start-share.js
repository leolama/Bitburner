import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var threads = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
	threads /= ns.getScriptRam("/src/share.js", "home");
	threads = Math.floor(threads) - 8; //spares ~36GB RAM
	try {
		if (ns.run("/src/share.js", threads) > 0) {
			log(ns, 'SUCCESS: Started share.js with ' + threads + ' threads.', true)
		}
	} catch {
		log(ns, "ERROR: Not enough RAM available to run share.js", true)
	}
}