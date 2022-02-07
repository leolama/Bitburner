/** @param {import('../.').NS} ns */

import { findFile } from 'util.js';

export async function main(ns) {
		var fileLocation = findFile(ns, ns.args[0]);
		var ram = ns.getScriptRam(fileLocation)

		if (fileLocation != false) {
				ns.tprint(fileLocation + " needs " + ram + "GB of RAM");
				return;
		} else {
			ns.tprint("Cannot find " + ns.args[0] + " on this system");
		}
}