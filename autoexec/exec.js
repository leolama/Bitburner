/** @param {NS} ns **/
export async function main(ns) {
	var args = ns.args[0];
	var programs = ["/managers/hack-manager.js", "/autoexec/autobuy.js", "/autoexec/autofaction.js", "/managers/stock-manager.js"];
	var dataRefresh = await ns.prompt("Do you want to refresh all script data?");

	/*
	var gitPrompt = await ns.prompt("Do you want to run gitfetch.js?");

	if (gitPrompt === true) {
		ns.exec("gitfetch.js");
	}
	*/

	if (dataRefresh === true) {
		ns.tprint("--");
		ns.tprint("Refreshing script data");
		await ns.write("/data/servercost-data.txt", "180000000,5000000000,1200000000000", "w");
		await ns.write("/data/serverram-data.txt", "1024,16384,1048576", "w");
		ns.tprint("Refreshed script data");
	}

	ns.tprint("--");
	for (let i = 0; i < programs.length; i++) {
		if (ns.fileExists(programs[i])) {
			if (!ns.isRunning(programs[i], "home")) {
				if (args != null && programs[i] === "/managers/hack-manager.js") {
					ns.run(programs[i], 1, args);
					ns.tprint("Started " + programs[i] + " with args: " + args);
					await ns.sleep(500);
				} else {
					ns.run(programs[i]);
					ns.tprint("Started " + programs[i]);
					await ns.sleep(500);
				}
			} else {
				ns.tprint(programs[i] + " is already running");
				await ns.sleep(500);
			}
		} else {
			ns.tprint("No file called " + programs[i]);
		}
	}
	ns.tprint("--");
}