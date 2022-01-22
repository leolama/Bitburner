/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("commitCrime");
	while (true) {
		var bestCrime = await crime(ns);
		var karma = ns.heart.break();
		await ns.sleep(ns.commitCrime(bestCrime) + 500);
		ns.print(karma);
	}
}

//test each crime with a special thrown-together algorithm
async function crime(ns) {
	var crimeList = [
		"heist",
		"assassinate",
		"kidnap and ransom",
		"grand theft auto",
		"traffick illegal arms",
		"bond forgery",
		"deal drugs",
		"larceny",
		"mug someone",
		"rob store",
		"shoplift",
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
