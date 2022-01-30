/*
	by default does the best crime for stats
	'money', 'karma' or the crime name as an argument to override the default
*/

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
	const possibleArgs = ["money", "karma"];

	//test each crime with a 'special' thrown-together algorithm
	function crime(arg) {
		let chance = 0;
		let time = 0;
		let stats = 0.0;
		let optimal = 0;
		let optimalCrime = "heist";

		if (arg == "noArg") {
			for (let i = 0; i < crimeList.length; ++i) {
				chance = ns.getCrimeChance(crimeList[i]);
				if (chance < 0.8) {
					//if chance to do crime is under 80% then skip it
					continue;
				}
				time = ns.getCrimeStats(crimeList[i]).time; //time to complete the crime
				stats = //stat exp received if successful
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
		} else if (arg == "money") {
			for (let i = 0; i < crimeList.length; ++i) {
				chance = ns.getCrimeChance(crimeList[i]);
				if (chance < 0.8) {
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
		} else if (arg == "karma") {
			for (let i = 0; i < crimeList.length; ++i) {
				chance = ns.getCrimeChance(crimeList[i]);
				if (chance < 0.8) {
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
				await ns.sleep(5000);
				statLevels = [ns.getPlayer().strength, ns.getPlayer().defense, ns.getPlayer().agility, ns.getPlayer().dexterity];
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
	oldKarma = karma;
	while (true) {
		if (possibleArgs.includes(ns.args[0])) {
			//checking for money or karma args
			bestCrime = crime(ns.args[0]);
		} else if (crimeList.includes(ns.args[0])) {
			//checking for heistname arg
			bestCrime = ns.args[0];
		} else {
			bestCrime = crime("noArg");
		}

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
