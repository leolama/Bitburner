/** @param {import("../.").NS} ns */
export async function main(ns) {
	var args = ns.args.toString().split(",");
	ns.print("Script started");
	ns.tprint("--");
	for (let arg of args) {
		if (ns.run(arg) > 0) {
			ns.tprint("Started " + arg);
		} else {
			ns.tprint("Failed to start " + arg);
		}
		
	}
	ns.tprint("--");
}