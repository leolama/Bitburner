/** @param {NS} ns **/
export async function main(ns) {

	var programs = [
		"/managers/hack-manager.js",
		"/autoexec/autobuy.js",
		"/autoexec/autofaction.js",
		"/managers/stock-manager.js"
		//"/autoexec/repl.js"
	];
	var gitPrompt = await ns.prompt("Do you want to run gitfetch.js?");

	if (gitPrompt === true) {
		ns.exec("gitfetch.js");
		if (gitPrompt === true && !ns.isRunning("gitfetch.js")) {
			for (let i = 0;i < programs.length; i++) {
				if (ns.fileExists(programs[i])) {
					if (!ns.isRunning(programs[i], "home")) {
						ns.run(programs[i]);
						ns.tprint("Started " + programs[i]);
						await ns.sleep(500);
					}
					else {
						ns.tprint(programs[i] + " is already running");
						await ns.sleep(500);
					}
				}
				else {
					ns.tprint("No file called " + programs[i]);
				}
			}
		}
	}
	else if (gitPrompt === false) {
		for (let i = 0;i < programs.length; i++) {
			if (ns.fileExists(programs[i])) {
				if (!ns.isRunning(programs[i], "home")) {
					ns.run(programs[i]);
					ns.tprint("Started " + programs[i]);
					await ns.sleep(500);
				}
				else {
					ns.tprint(programs[i] + " is already running");
					await ns.sleep(500);
				}
			}
			else {
				ns.tprint("No file called " + programs[i]);
			}
		}
	}
}
