import { hackTools, nukeServer, terminalInput, log, getNsDataThroughFile, runCommand } from 'util.js';

const doc = eval("document")

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.print("Script started");

	async function checkFactionInvites() {
		let factionInvites = await getNsDataThroughFile(ns, `ns.checkFactionInvitations()`, 'player-faction-invites.txt');
		//check for invitations from main factions
		for (let fac of factionNames) {
			if (factionInvites.includes(fac)) {
				runCommand(ns, `ns.joinFaction(${fac})`)
				ns.print("Joined " + fac);
			}
		}
		//check for invitations from other factions
		for (let fac of otherFactionNames) {
			if (factionInvites.includes(fac)) {
				runCommand(ns, `ns.joinFaction(${fac})`)
				ns.print("Joined " + fac);
			}
		}
	}

	async function checkTerminal() {
		//check if we're on the terminal screen
		if (doc.getElementById("terminal-input") == null) {
			log(ns, "WARN: Player isn't on the terminal screen")
			while (doc.getElementById("terminal-input") == null) {
				checkFactionInvites();
				await ns.sleep(100);
			}
		}
	}

	function runOtherManagers() {
		//since this script will be running until we finish the bitnode, we use this to run the gang and corporation managers
		let karma = ns.heart.break();
        if (karma < -54000) {
            if (ns.run('/managers/gang-manager.js') > 0) {
                log(ns, 'INFO: Starting gang-manager.js');
            }
        }

		if (ns.getPlayer().money > 150e9) {
            if (ns.run('/managers/corp-manager.js') > 0) {
                log(ns, 'INFO: Starting corp-manager.js');
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
		"Bladeburners"
	]; //factions that don't stop us from joining other factions
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"]; //backdoor based faction server names
	const factionHackLvl = []; //required hacking levels
	const factionTools = ["1", "2", "3", "4", "5"]; //number of programs needed to root
	var numTools = hackTools(ns); //number of hacking tools that we have
	var count = 0;
	var hackingLvl = ns.getPlayer().hacking; //player hacking level
	var playerAugs = ns.read('/data/player-augs-purchased.txt');

	//get the paths to the faction servers
	var temp_factionPaths = ns.read('/data/faction-paths.txt');
	var factionPaths = temp_factionPaths.split(",");
	log(ns, "SUCCESS: Got faction server paths");

	for (let faction of factionServerNames) {
		//get faction hacking level requirement
		factionHackLvl.push(ns.getServerRequiredHackingLevel(faction));
	}

	while (count < factionServerNames.length) {
		if (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
			//if backdoor hasn't been installed, start a loop
			while (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
				if (factionHackLvl[count] <= hackingLvl && numTools >= factionTools[count]) {
					//if our hacking level and hacking tools are higher than the server needs
					if (factionServerNames[count] == "w0r1d_d43m0n") {
						//if we're waiting to backdoor world_daemon, check that we have The Red Pill
						while (!playerAugs.includes("The Red Pill")) {
							await checkFactionInvites();
							await ns.sleep(1000);
						}
					}
					await nukeServer(ns, factionServerNames[count]); //make sure we have root access on the target
					await checkTerminal(); //check that we're on the terminal
					await terminalInput(factionPaths[count]);
					await ns.sleep(100);
					log(ns, "INFO: Installing backdoor on " + factionServerNames[count] + "...", true);
					await checkTerminal();
					await ns.installBackdoor();
					if (ns.getServer(factionServerNames[count]).backdoorInstalled === true) {
						log(ns, "SUCCESS: Successfully backdoored " + factionServerNames[count], true);
						log(ns, "INFO: Returning home");
						await terminalInput("home");
						++count;
					} else {
						log(ns, "ERROR: Failed backdoor");
						log(ns, "INFO: Returning home and retrying")
						await terminalInput("home");
					}
				} else {
					log(ns, "WARN: Trying to backdoor " + factionServerNames[count] + ". Need hacking level " + factionHackLvl[count] + ", have " + hackingLvl + ". Need " + factionTools[count] + " tools, have " + numTools);
				}
				//refresh vars
				numTools = hackTools(ns);
				hackingLvl = ns.getPlayer().hacking;
				await checkFactionInvites();
				runOtherManagers();
				await ns.sleep(1000);
			}
		} else {
			log(ns, "INFO: Already backdoored " + factionServerNames[count]);
			++count;
		}
	}
}
