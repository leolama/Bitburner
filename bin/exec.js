/** @param {NS} ns **/
export async function main(ns) {
	ns.print("Script started");
	var args = ns.args[0];
	var programs = ["/managers/hack-manager.js", "/managers/buy-manager.js","/managers/gang-manager.js","/managers/faction-manager.js", "/managers/stock-manager.js"];
	/*
	var gitPrompt = await ns.prompt("Do you want to run gitfetch.js?");

	if (gitPrompt === true) {
		ns.exec("gitfetch.js");
	}
	*/

	ns.tprint("--");
	for (let i = 0; i < programs.length; i++) {
		if (ns.fileExists(programs[i])) {
			if (!ns.isRunning(programs[i], "home")) {
				if (args != null && programs[i] === "/managers/hack-manager.js") {
					ns.run(programs[i], 1, args);
					ns.tprint("Started " + programs[i] + " with args: " + args);
				} else {
					ns.run(programs[i]);
					ns.tprint("Started " + programs[i]);
				}
			} else {
				ns.tprint(programs[i] + " is already running");
			}
		} else {
			ns.tprint("No file called " + programs[i]);
		}
	}
	ns.tprint("--");
}