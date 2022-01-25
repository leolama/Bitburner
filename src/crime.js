/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");
	//test each crime with a special thrown-together algorithm
	function crime() {
		var crimeList = [
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
			"shoplift"
		];
		let chance = 0;
		let time = 0;
		let stats = 0.0;
		let optimal = 0;
		let optimalCrime = "heist";

		for (let i = 0; i < crimeList.length; ++i) {
			chance = ns.getCrimeChance(crimeList[i]);
			if (chance < 0.85) {
				continue;
			}
			time = ns.getCrimeStats(crimeList[i]).time;
			stats =
				ns.getCrimeStats(crimeList[i]).strength_exp +
				ns.getCrimeStats(crimeList[i]).defense_exp +
				ns.getCrimeStats(crimeList[i]).dexterity_exp +
				ns.getCrimeStats(crimeList[i]).agility_exp;
			time /= stats;
			if (time > optimal) {
				optimal = time;
				optimalCrime = crimeList[i];
			}
		}
		return optimalCrime;
	}

	//main
	while (true) {
		var bestCrime;
		if (ns.args[0] != null) {
			bestCrime = ns.args[0];
		} else {
			bestCrime = crime();
		}
		
		var oldKarma;
		var karma;
		var date = new Date(Date.now() + ns.getCrimeStats(bestCrime).time);
		var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");
		var busy = 0;
		if (!ns.isBusy()) {
			oldKarma = ns.heart.break();
			ns.print("Attempting to commit " + bestCrime + ". Expecting finish at " + time);
			await ns.sleep(ns.commitCrime(bestCrime) + 500);
			karma = ns.heart.break();
			if (oldKarma > karma) {
				ns.print("Success!");
				ns.print("Current karma " + karma);
			}
			else {
				ns.print("Failure!");
			}
			ns.print(karma);
		}
		else {
			ns.print("Player is busy");
			busy = 0
			while (busy < 1) {
				if (!ns.isBusy())
					++busy;
				else {
					await ns.sleep(1000);
				}
			}
		}
	}
}