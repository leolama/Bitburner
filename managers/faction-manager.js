import { hackTools, nukeServer, terminalInput } from 'util.js';

const doc = eval("document")

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.print("Script started");

	function checkRedPill() {
		//check if we have The Red Pill
		return ns.getOwnedAugmentations().includes("The Red Pill");
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

	async function checkTerminal() {
		//check if we're on the terminal screen
		if (doc.getElementById("terminal-input") == null) {
			ns.print("Player isn't on the terminal screen")
			while (doc.getElementById("terminal-input") == null) {
				await ns.sleep(500);
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
		"OmniTek Incorporated",
		"Slum Snakes",
		"Tetrads",
		"Silhouette",
		"Speakers for the Dead",
		"The Dark Army",
		"The Syndicate",
		"The Covenant",
		"Illuminati",
	]; //factions that don't stop us from joining other factions
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"]; //backdoor based faction server names
	const factionHackLvl = []; //required hacking levels
	const factionTools = ["1", "2", "3", "4", "5"]; //number of programs needed to root
	var numTools = hackTools(ns); //number of hacking tools we have
	var count = 0;
	var hackingLvl = ns.getPlayer().hacking; //player hacking level

	//get the paths to the faction servers
	ns.tprint("--")
	ns.tprint("Getting faction server paths...");
	var temp_factionPaths = ns.read('/data/faction-paths.txt');
	var factionPaths = temp_factionPaths.split(",");
	ns.tprint("Got faction server paths");
	ns.tprint("--")

	for (let faction of factionServerNames) {
		//get faction hacking level requirement
		factionHackLvl.push(ns.getServerRequiredHackingLevel(faction));
	}

	while (count < factionServerNames.length) {
		ns.print("Trying to backdoor " + factionServerNames[count] + ". Need hacking level " + factionHackLvl[count] + ", have " + hackingLvl + ". Need " + factionTools[count] + " tools, have " + numTools);
		if (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
			//if backdoor hasn't been installed, start a loop
			while (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
				if (factionHackLvl[count] <= hackingLvl && numTools >= factionTools[count]) {
					//if our hacking level and hacking tools are higher than the server needs
					if (factionServerNames[count] == "w0r1d_d43m0n") {
						//if we're waiting to backdoor world_daemon, check that we have The Red Pill
						while (checkRedPill() == false) {
							checkFactionInvites();
							await ns.sleep(1000);
						}
					}
					await nukeServer(ns, factionServerNames[count]); //make sure we have root access on the target
					await checkTerminal()
					terminalInput(factionPaths[count]);
					await ns.sleep(100);
					ns.tprint("Installing backdoor on " + factionServerNames[count] + "...");
					await checkTerminal();
					await ns.installBackdoor();
					if (ns.getServer(factionServerNames[count]).backdoorInstalled === true) {
						ns.tprint("Successful backdoor");
						ns.tprint("Returning home");
						terminalInput("home");
						++count;
					} else {
						ns.tprint("Failed backdoor");
						ns.tprint("Returning home and retrying")
						terminalInput("home");
					}
				}
				//refresh vars
				numTools = hackTools(ns);
				hackingLvl = ns.getPlayer().hacking;
				checkFactionInvites();
				await ns.sleep(1000);
			}
		} else {
			ns.print("Already backdoored " + factionServerNames[count]);
			++count;
		}
	}
}
