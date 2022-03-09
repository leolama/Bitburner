import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var multipleOf = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576];
	var ram = ns.args[0];
	var hName = "personal-server-" + ram;

	for (let multiple of multipleOf) {
		if (ram === multiple) {
			//if ram equals a multiple of 2
			if (ns.purchaseServer(hName, ram)) {
				log(ns, "SUCCESS: Bought " + ram + "GB server", true);
			} else {
				log(ns, "ERROR: Failed to buy a server", true);
			}
			return;
		}
	}
}