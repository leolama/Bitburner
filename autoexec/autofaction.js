/** @param {NS} ns **/
import { hackTools } from "util"
import { playerStats } from "util"
playerStats(ns);

export async function main(ns) {
	var factionNames = ["CyberSec", //hacking based factions (that I know of so far)
		"NiteSec",
		"The Black Hand",
		"BitRunners",
		"Daedulus"
	]
	var factionHackLvl = ["54", //required hacking level
		"203",
		"358",
		"511",
		"2500"
	]
	var factionProgs = ["1",
		"2",
		"3",
		"4",
		"5"]
	var numTools = hackTools(ns);
	var count = 0

	while (count <= 4) {
		for (let i = 0; i < factionNames.length; ++i) {
			if (factionHackLvl[i] <= hackingLvl && numTools >= factionProgs[i]) {
				ns.tprint("testworkedpog")
			}
		}
	}
}
