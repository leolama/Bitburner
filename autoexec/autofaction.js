//https://github.com/leolama/Bitburner
import { countTools } from "util"
/** @param {NS} ns **/
export async function main(ns) {
	let numTools = countTools();

	ns.tprint(numTools);
}
