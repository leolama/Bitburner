/** @param {NS} ns **/
export function countTools(ns) {
	var programs = ["brutessh.exe","ftpcrack.exe","relaysmtp.exe","httpworm.exe","sqlinject.exe"]
	var numTools = 0

	for (let prog of programs) {
		if (ns.fileExists(prog)) {
			++numTools;
		}
	}
	return numTools;
}

export function playerStats(ns) {
	var hp = ns.getPlayer().max_hp;
	var money = ns.getPlayer().money;
	var hackingLvl = ns.getPlayer().hacking;
	var strengthLvl = ns.getPlayer().strength;
	var defenseLvl = ns.getPlayer().defense;
	var dexterityLvl = ns.getPlayer().dexterity;
	var agilityLvl = ns.getPlayer().agility;
	var charismaLvl = ns.getPlayer().charisma;

	
}
