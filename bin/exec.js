/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var args = ns.args[0];
	var scripts = ["hack-manager.js", "buy-manager.js","gang-manager.js","faction-manager.js", "stock-manager.js", "crime-manager.js"]
	var scriptsToStart = [];
	var reqRam = 0;

	for (let script of scripts) {
		let ram = ns.getScriptRam("/managers/" + script);
		reqRam += ram;
	}

	if (await ns.prompt("Start all managers? (requires " + reqRam + "GB of home RAM)")) {
		scriptsToStart = ["/managers/hack-manager.js", "/managers/buy-manager.js","/managers/gang-manager.js","/managers/faction-manager.js", "/managers/stock-manager.js", "/managers/crime-manager.js"];
	} else {
		for (let script of scripts) {
			if (await ns.prompt("Start " + script + "?")) {
				scriptsToStart.push("/managers/" + script);
			}
		}
	}

	ns.tprint("--");
	for (let i = 0; i < scriptsToStart.length; i++) {
		if (ns.fileExists(scriptsToStart[i])) {
			if (!ns.isRunning(scriptsToStart[i], "home")) {
				if (args != null && scriptsToStart[i] === "/managers/hack-manager.js") {
					ns.run(scriptsToStart[i], 1, args);
					ns.tprint("Started " + scriptsToStart[i] + " with args: " + args);
				} else {
					ns.run(scriptsToStart[i]);
					ns.tprint("Started " + scriptsToStart[i]);
				}
			} else {
				ns.tprint(scriptsToStart[i] + " is already running");
			}
		} else {
			ns.tprint("No file called /managers/" + scriptsToStart[i]);
		}
	}
	ns.tprint("--");
}