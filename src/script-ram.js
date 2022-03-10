import { findFile, log } from 'util.js';

/** @param {import('../.').NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var fileLocation = findFile(ns, ns.args[0]);
	var ram = ns.getScriptRam(fileLocation)

	if (fileLocation != false) {
			log(ns, 'INFO: ' + fileLocation + " needs " + ram + "GB of RAM", true);
			return;
	} else {
		log(ns, "ERROR: Cannot find " + ns.args[0] + " on this system", true);
	}
}