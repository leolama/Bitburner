/** @param {NS} ns **/
import { hackTools, nukeServer } from "util.js";

export async function main(ns) {
	var factionNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"]; //hacking based factions (that I know of so far)
	var factionHackLvl = ["54", "203", "358", "511"]; //required hacking level
	var factionProgs = ["1", "2", "3", "4"];
	var numTools = hackTools(ns);
	var count = 0;
	var hackingLvl = ns.getPlayer().hacking;

	while (count < factionNames.length) {
		if (ns.getServer(factionNames[count]).backdoorInstalled === false) {
			if (factionHackLvl[count] <= hackingLvl && numTools >= factionProgs[count]) {
				await nukeServer(ns, factionNames[count]);
				ns.tprint("Installing a backdoor on " + factionNames[count] + " in 3 seconds");
				await ns.sleep(3000);
				ns.run("scripts/connect.js", 1, factionNames[count]);
				await ns.sleep(100);
				await ns.installBackdoor();
				if (ns.getServer(factionNames[count]).backdoorInstalled === true) {
					++count;
					ns.tprint("Successful backdoor");
					ns.tprint("Returning home");
					ns.run("scripts/connect.js", 1, "home");
				} else {
					ns.tprint("Failed backdoor");
					ns.tprint("Returning home, stopping script");
					ns.run("scripts/connect.js", 1, "home");
					return;
				}
				await ns.sleep(2000);
			} else {
				await ns.sleep(2000);
			}
		} else {
			++count;
		}
		var numTools = hackTools(ns);
		var hackingLvl = ns.getPlayer().hacking;
	}
}