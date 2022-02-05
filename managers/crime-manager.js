const statNames = ["strength", "defense", "dexterity", "agility"];

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");

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
				ns.print("Training " + statNames[i]);
				ns.gymWorkout(gym, statNames[i]);
				await ns.sleep(1000);
				statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().dexterity, ns.getPlayer().agility];
			}
		}
		ns.stopAction();
	}

	var str = ns.getPlayer().strength;
	var def = ns.getPlayer().defense;
	var agi = ns.getPlayer().agility;
	var dex = ns.getPlayer().dexterity;
	var oldKarma = 0;
	var karma = 0;
	var busy = 0;
	var bestCrime;

	//if player stats are under 15 then train at the gym until they aren't
	if (str < 15 || def < 15 || agi < 15 || dex < 15) {
		await trainStats();
	}

	//main
	while (karma < 54000) {
		bestCrime = crime();
		
		//get and format the time into 24h
		var date = new Date(Date.now() + ns.getCrimeStats(bestCrime).time);
		var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");

		if (!ns.isBusy()) {
			ns.print("Attempting to commit " + bestCrime + ". Expecting finish at " + time);
			await ns.sleep(ns.commitCrime(bestCrime) - 500);
			if (!ns.isBusy()) {
				//if the player cancels the crime, stop the script and print current karma into the terminal
				ns.tprint("Karma: " + oldKarma); //script needs to loop at least once for this idk
				ns.print("Cancelled by player");
				return;
			}
			karma = ns.heart.break(); //get karma value
			if (oldKarma > karma) {
				ns.print("Success!");
				ns.print("Current karma " + karma);
			} else {
				ns.print("Failed!");
			}
		} else {
			ns.print("Player is busy");
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
		oldKarma = karma; //move karma into another var
	}
}
