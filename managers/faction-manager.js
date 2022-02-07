/** @param {import("../.").NS} ns */
import { hackTools, nukeServer } from "util.js";

export async function main(ns) {
	ns.disableLog("ALL");
	ns.print("Script started");
	await ns.sleep(2000);
	const factionNames = ["CyberSec", "NiteSec", "The Black Hand", "BitRunners"]; //backdoor based factions
	const otherFactionNames = [
		"Daedalus",
		"Tian Di Hui",
		"Netburners",
		"ECorp",
		"MegaCorp",
		"KuaiGong International",
		"Four Sigma",
		"NWO",
		"Blade Industries",
		"ImnoTek Incorporated",
		"Bachman & Associates",
		"Clarke Incorporated",
		"Fulcrum Secret Technologies",
		"Slum Snakes",
		"Tetrads",
		"Silhouette",
		"Speakers for the Dead",
		"The Dark Army",
		"The Syndicate",
		"The Covenant",
		"Illuminati",
	]; //factions that don't block other factions
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"];
	const factionHackLvl = []; //required hacking levels
	const factionTools = ["1", "2", "3", "4", "5"]; //number of programs needed to root
	var numTools = hackTools(ns);
	var count = 0;
	var hackingLvl = ns.getPlayer().hacking;

	for (let faction of factionServerNames) {
		factionHackLvl.push(ns.getServerRequiredHackingLevel(faction)); //get faction hacking level requirement
	}

	while (count < factionServerNames.length) {
		if (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
			if (factionHackLvl[count] <= hackingLvl && numTools >= factionTools[count]) {
				await nukeServer(ns, factionServerNames[count]);
				//search for terminal-input and wait if null
				let terminalInput = document.getElementById("terminal-input");
				while (terminalInput == null) {
					await ns.sleep(1000)
					terminalInput = document.getElementById("terminal-input");
				}
				for (let i = 3; i > 0;--i) {
					//countdown to backdoor
					ns.tprint("Installing a backdoor on " + factionServerNames[count] + " in " + i + " seconds");
					await ns.sleep(1000);
				}
				ns.run("src/connect.js", 1, factionServerNames[count]);
				await ns.sleep(100);
				ns.tprint("Installing backdoor...");
				await ns.installBackdoor();
				if (ns.getServer(factionServerNames[count]).backdoorInstalled === true) {
					ns.tprint("Successful backdoor");
					ns.tprint("Returning home");
					ns.run("src/connect.js", 1, "home");
					++count;
				} else {
					ns.tprint("Failed backdoor");
					ns.tprint("Returning home, stopping script");
					ns.run("src/connect.js", 1, "home");
					return;
				}
			}
		} else {
			++count;
		}
		//check for invitations from main factions
		for (let fac of factionNames) {
			if (ns.checkFactionInvitations().includes(fac)) {
				ns.joinFaction(fac);
				ns.print("Joined " + fac);
			}
		}
		//check for invitations from other factions
		for (let fac of otherFactionNames) {
			if (ns.checkFactionInvitations().includes(fac)) {
				ns.joinFaction(fac);
				ns.print("Joined " + fac);
			}
		}
		numTools = hackTools(ns);
		hackingLvl = ns.getPlayer().hacking;
		await ns.sleep(1000);
	}
}
