/** @param {NS} ns **/
import { hackTools, hackServer } from "util.js"
import { main } from "scripts/connect.js"

export async function main(ns) {
	var factionNames = ["CSEC","avmnite-02h","I.I.I.I","run4theh111z"]; //hacking based factions (that I know of so far)
	var factionHackLvl = ["54","203","358","511"]; //required hacking level
	var factionProgs = ["1","2","3","4"];
	var numTools = hackTools(ns);
	var count = 0;
	var hackingLvl = ns.getPlayer().hacking;

	while (count < factionNames.length - 1) {
		if (factionHackLvl[count] <= hackingLvl && numTools >= factionProgs[count]) {
			hackServer(ns, factionNames[count]);
			++count;
		}
	}
}
