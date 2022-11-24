import { log, getNsDataThroughFile } from 'util.js'

const scriptArgs = [
    ['crime', '']
];

export function autocomplete(data, args) {
    data.flags(scriptArgs);
    return [];
}

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");

	const flags = ns.flags(scriptArgs);
	const statNames = ["strength", "defense", "dexterity", "agility"];

	async function crime() {
		if (await getNsDataThroughFile(ns, `ns.singularity.getCrimeChance("homicide")`) > 0.6 && flags.crime == '') {
			return "homicide";
		} else if (await getNsDataThroughFile(ns, `ns.singularity.getCrimeChance("heist")`) > 0.6 && flags.crime == '') {
			return "heist";
		} else if (flags.crime == '') {
			return "mug someone";
		} else {
			return flags.crime;
		}
	}

	async function trainStats() {
		//get player stats
		var statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().dexterity, ns.getPlayer().agility];
		var gym = "powerhouse gym"; //assuming we're in sector-12

		for (let i = 0; i < statLevels.length;++i) {
			while (statLevels[i] < 15) {
				if (ns.getPlayer().className != 'training your ' + statNames[i] + ' at a gym') {
					log(ns, "SUCCESS: Training " + statNames[i]);
					ns.gymWorkout(gym, statNames[i]);
				}
				await ns.sleep(1000);
				statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().dexterity, ns.getPlayer().agility];
				if (!ns.singularity.isBusy()) {
					//if player has cancelled training then stop the script
					log(ns, "INFO: Cancelled by player");
					return;
				}
			}
		}
		ns.stopAction();
	}

	var str = ns.getPlayer().strength;
	var def = ns.getPlayer().defense;
	var dex = ns.getPlayer().dexterity;
	var agi = ns.getPlayer().agility;
	var oldKarma = 0;
	var busy = 0;

	//if player stats are under 15 then train at the gym until they aren't
	if (str < 15 || def < 15 || dex < 15 || agi < 15) {
		await trainStats();
	}

	//main
	while (true) {
		var karma = ns.heart.break();
		var bestCrime = await crime();
		
		//get and format the time into 24h
		var date = new Date(Date.now() + ns.singularity.getCrimeStats(bestCrime).time);
		var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");

		if (!ns.singularity.isBusy()) {
			log(ns, "INFO: Attempting to commit " + bestCrime + ". Expecting finish at " + time);
			await ns.sleep(ns.singularity.commitCrime(bestCrime) - 500);
			if (!ns.singularity.isBusy()) {
				//if the player cancels the crime, stop the script and print current karma into the terminal
				log(ns, "INFO: Current karma: " + karma, true);
				log(ns, "INFO: Cancelled by player");
				return;
			}
			if (oldKarma > karma) {
				log(ns, "SUCCESS: Completed crime");
				log(ns, "INFO: Current karma: " + karma);
			} else {
				log(ns, "WARN: Failed crime");
			}
		} else {
			log(ns, "INFO: Player is busy");
			busy = 0;
			while (busy < 1) {
				if (!ns.singularity.isBusy()) ++busy;
				//if player is busy then wait a second and try again
				else {
					await ns.sleep(1000);
				}
			}
		}
		await ns.sleep(500);
		oldKarma = karma; //copy karma into another var
	}
}