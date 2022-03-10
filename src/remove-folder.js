import { log } from "util.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	const files = ns.ls("home", ns.args[0]);
	log(ns, 'Removing /' + ns.args[0] + '/', true);
	for (const file of files) {
		ns.rm(file);
	}
}