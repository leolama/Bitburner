/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");

	const crimeList = [
		"heist",
		"assassinate",
		"kidnap and ransom",
		"grand theft auto",
		"homicide",
		"traffick illegal arms",
		"bond forgery",
		"deal drugs",
		"larceny",
		"mug someone",
		"rob store",
		"shoplift",
	];
	const statNames = ["strength", "defense", "agility", "dexterity"];
	const possibleArgs = ["money","karma"];
	const noArg = "noArg";



	//test each crime with a special thrown-together algorithm
	function crime(arg) {
		let chance = 0;
		let time = 0;
		let stats = 0.0;
		let optimal = 0;
		let optimalCrime = "shoplift";

		if (arg = "noArg") {
			for (let i = 0; i < crimeList.length; ++i) {
				chance = ns.getCrimeChance(crimeList[i]);
				if (chance < 0.80) {
					continue;
				}
				time = ns.getCrimeStats(crimeList[i]).time;
				stats =
					ns.getCrimeStats(crimeList[i]).strength_exp +
					ns.getCrimeStats(crimeList[i]).defense_exp +
					ns.getCrimeStats(crimeList[i]).dexterity_exp +
					ns.getCrimeStats(crimeList[i]).agility_exp;
				stats /= time;
				if (stats > optimal) {
					optimal = stats;
					optimalCrime = crimeList[i];
				}
			}
			return optimalCrime;
		}
		else if (arg = "money") {
			for (let i = 0; i < crimeList.length; ++i) {
				chance = ns.getCrimeChance(crimeList[i]);
				if (chance < 0.80) {
					continue;
				}
				time = ns.getCrimeStats(crimeList[i]).time;
				stats = ns.getCrimeStats(crimeList[i]).money;
				stats /= time;
				if (stats > optimal) {
					optimal = stats;
					optimalCrime = crimeList[i];
				}
			}
			return optimalCrime;
		}
		else if (arg = "karma") {
			for (let i = 0; i < crimeList.length; ++i) {
				chance = ns.getCrimeChance(crimeList[i]);
				if (chance < 0.80) {
					continue;
				}
				time = ns.getCrimeStats(crimeList[i]).time;
				stats = ns.getCrimeStats(crimeList[i]).karma;
				stats /= time;
				if (stats > optimal) {
					optimal = stats;
					optimalCrime = crimeList[i];
				}
			}
			return optimalCrime;
		}

	}

	async function trainStats() {
		//get player stats
		var statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().agility, ns.getPlayer().dexterity];
		var gym = "powerhouse gym"; //assuming we're in sector-12

		for (let i = 0; i < statNames.length; ++i) {
			ns.print("Training " + statNames[i]);
			while (statLevels[i] < 15) {
				ns.gymWorkout(gym, statNames[i]);
				await ns.sleep(5000)
				statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().agility, ns.getPlayer().dexterity];
			}
		}
		ns.stopAction();
	}

	//main
	while (true) {
		var str = ns.getPlayer().strength;
		var def = ns.getPlayer().defense;
		var agi = ns.getPlayer().agility;
		var dex = ns.getPlayer().dexterity;
		var oldKarma;
		var karma;
		var busy = 0;
		if (str < 15 || def < 15 || agi < 15 || dex < 15) {
			await trainStats();
		}
		var bestCrime;
		if (possibleArgs.includes(ns.args[0])) {
			bestCrime = crime(ns.args[0]);
		} else if (crimeList.includes(ns.args[0])) {
			bestCrime = ns.args[0];
		}
		else {
			bestCrime = crime(noArg);
		}
		var date = new Date(Date.now() + ns.getCrimeStats(bestCrime).time);
		var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");


		if (!ns.isBusy()) {
			oldKarma = ns.heart.break();
			ns.print("Attempting to commit " + bestCrime + ". Expecting finish at " + time);
			await ns.sleep(ns.commitCrime(bestCrime) - 500);
			if (!ns.isBusy()) {
				ns.print("Cancelled by player");
				return;
			}
			karma = ns.heart.break();
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
				else {
					await ns.sleep(1000);
				}
			}
		}
	}
}