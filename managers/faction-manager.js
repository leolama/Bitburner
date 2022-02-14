/** @param {import("../.").NS} ns */
import { hackTools, nukeServer, terminalInject, getServerPath } from 'util.js';

export async function main(ns) {
	ns.disableLog("ALL");
	ns.print("Script started");

	function checkTerminal() {
		terminalCheck = document.getElementById("terminal-input");
		return terminalCheck;
	}

	function checkRedPill() {
		if (ns.getOwnedAugmentations().includes("The Red Pill")) {
			return true;
		} else {
			return false;
		}
	}

	function checkFactionInvites() {
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
	}

	const factionNames = ["CyberSec", "NiteSec", "The Black Hand", "BitRunners", "w0r1d_d43m0n"]; //backdoor based factions
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
	]; //factions that don't stop us from joining other factions
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"];
	var temp_factionPaths = ns.read('/data/faction-paths.txt');
	const factionPaths = temp_factionPaths.split(",");
	const factionHackLvl = []; //required hacking levels
	const factionTools = ["1", "2", "3", "4", "5"]; //number of programs needed to root
	var numTools = hackTools(ns); //number of hacking tools we have
	var count = 0;
	var hackingLvl = ns.getPlayer().hacking; //player hacking level
	var terminalCheck;

	for (let faction of factionServerNames) {
		//get faction hacking level requirement
		factionHackLvl.push(ns.getServerRequiredHackingLevel(faction));
	}

	while (count < factionServerNames.length) {
		if (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
			if (factionHackLvl[count] <= hackingLvl && numTools >= factionTools[count]) {
				if (factionServerNames[count] == "w0r1d_d43m0n") {
					if (checkRedPill() == false) {
						while (checkRedPill() == false) {
							checkFactionInvites();
							await ns.sleep(1000);
						}
						var temp = getServerPath(factionServerNames[count])
						factionPaths.push(temp)
					}
				}
				await nukeServer(ns, factionServerNames[count]);
				for (let i = 3; i > 0;--i) {
					//search for terminal-input and wait if null
					if (checkTerminal() == null) {
						ns.tprint("Player isn't on the terminal screen, delaying backdoor...")
						while (checkTerminal() == null) {
							checkFactionInvites();
							await ns.sleep(500)
						}
						i = 3
					}
					//countdown to backdoor
					ns.tprint("Installing a backdoor on " + factionServerNames[count] + " in " + i + " seconds");
					await ns.sleep(1000);
					if (checkTerminal() == null) {
						ns.tprint("Player isn't on the terminal screen, delaying backdoor...")
						while (checkTerminal() == null) {
							checkFactionInvites();
							await ns.sleep(500)
						}
						i = 3
					}
				}
				terminalInject(factionPaths[count]);
				await ns.sleep(100);
				ns.tprint("Installing backdoor...");
				await ns.installBackdoor();
				if (ns.getServer(factionServerNames[count]).backdoorInstalled === true) {
					ns.tprint("Successful backdoor");
					ns.tprint("Returning home");
					terminalInject("home");
					++count;
				} else {
					ns.tprint("Failed backdoor");
					ns.tprint("Returning home, stopping script");
					terminalInject("home");
					return;
				}
			}
		} else {
			++count;
		}
		numTools = hackTools(ns);
		hackingLvl = ns.getPlayer().hacking;
		checkFactionInvites();
		await ns.sleep(100);
	}
}
