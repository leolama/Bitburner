import { log } from "util.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	var args = ns.args.toString().split(",");
	ns.print("Script started");
	log(ns, "--", true);
	for (let arg of args) {
		if (ns.run(arg) > 0) {
			log(ns, "Started " + arg, true);
		} else {
			log(ns, "Failed to start " + arg, true);
		}
		
	}
	log(ns, "--", true);
}