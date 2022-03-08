import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");

	const statNames = ["strength", "defense", "dexterity", "agility"];

	function crime() {
		if (ns.getCrimeChance("homicide") < 0.6) {
			return "mug someone";
		} else {
			return "homicide";
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
				if (!ns.isBusy()) {
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
	var agi = ns.getPlayer().agility;
	var dex = ns.getPlayer().dexterity;
	var oldKarma = 0;
	var busy = 0;

	//if player stats are under 15 then train at the gym until they aren't
	if (str < 15 || def < 15 || agi < 15 || dex < 15) {
		await trainStats();
	}

	//main
	while (true) {
		var karma = ns.heart.break();
		var bestCrime = crime();

		if (karma < -54000 && !ns.isRunning("/managers/gang-manager.js","home")) {
			let pid = ns.run("/managers/gang-manager.js")
			if (pid > 0) {
				log(ns, "SUCCESS: Started /managers/gang-manager.js with PID " + pid)
			} else {
				log(ns, "ERROR: Failed to start /managers/gang-manager.js")
			}
		}
		
		//get and format the time into 24h
		var date = new Date(Date.now() + ns.getCrimeStats(bestCrime).time);
		var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");

		if (!ns.isBusy()) {
			log(ns, "INFO: Attempting to commit " + bestCrime + ". Expecting finish at " + time);
			await ns.sleep(ns.commitCrime(bestCrime) - 500);
			if (!ns.isBusy()) {
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
				if (!ns.isBusy()) ++busy;
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
