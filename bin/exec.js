/** @param {import("../.").NS} ns */
export async function main(ns) {
	var args = ns.args.toString().split(",");
	ns.print("Script started");
	ns.tprint("--");
	for (let arg of args) {
		if (arg == "/managers/corp-manager.js") {
			if (ns.run(arg,1,"yeet") > 0) {
				ns.tprint('Started ' + arg + ' with arg: ["yeet"]');
			}
		} else if (ns.run(arg) > 0) {
			ns.tprint("Started " + arg);
		} else {
			ns.tprint("Failed to start " + arg);
		}
		
	}
	ns.tprint("--");
}