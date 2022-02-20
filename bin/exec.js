import { getServerPath } from 'util.js';


/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	var args = ns.args[0];
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"];
	const scripts = ["hack-manager.js", "buy-manager.js", "faction-manager.js", "crime-manager.js", "gang-manager.js", "stock-manager.js"];
	var scriptsToStart = [];
	var reqRam = 0;
	var factionPaths = [];

	//get required ram of each script
	for (let script of scripts) {
		let ram = ns.getScriptRam("/managers/" + script);
		ns.print(script + " - " + ram + "GB");
		reqRam += ram;
	}

	if (await ns.prompt("Start all managers? (requires " + reqRam + "GB of home RAM)")) {
		scriptsToStart = [
			"/managers/hack-manager.js",
			"/managers/buy-manager.js",
			"/managers/gang-manager.js",
			"/managers/faction-manager.js",
			"/managers/stock-manager.js",
			"/managers/crime-manager.js"
		];
	} else {
		for (let script of scripts) {
			if (await ns.prompt("Start " + script + "?")) {
				scriptsToStart.push("/managers/" + script);
			}
		}
	}

	if (scriptsToStart.includes("/managers/buy-manager.js")) {
		if (await ns.prompt("Reset purchased server data?")) {
			await ns.write("/data/purchasedservers.txt", "128,1024,16384,1048576", "w");
		}
	}

	if (scriptsToStart.includes("/managers/faction-manager.js")) {
		if (await ns.prompt("Reset server paths?")) {
			for (let faction of factionServerNames) {		
				let path = getServerPath(ns, faction);
				factionPaths.push(path);
			}
			await ns.write("/data/faction-paths.txt",factionPaths, "w")	
		}
	}

		

	ns.tprint("--");
	for (let i = 0; i < scriptsToStart.length; i++) {
		if (ns.fileExists(scriptsToStart[i])) {
			if (!ns.isRunning(scriptsToStart[i], "home")) {
				if (args != null && scriptsToStart[i] === "/managers/hack-manager.js") {
					if (ns.run(scriptsToStart[i], 1, args) > 0) {
						ns.tprint("Started " + scriptsToStart[i] + " with args: " + args);
					} else {
						ns.tprint("Failed to start " + scriptsToStart[i] + " with args: " + args);
					}
				} else {
					if (ns.run(scriptsToStart[i]) > 0) {
						ns.tprint("Started " + scriptsToStart[i]);
					} else {
						ns.tprint("Failed to start " + scriptsToStart[i] + " with args: " + args);
					}
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