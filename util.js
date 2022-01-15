/** @param {NS} ns **/
export function hackTools(ns) {
	var programs = ["brutessh.exe","ftpcrack.exe","relaysmtp.exe","httpworm.exe","sqlinject.exe"]
	var numTools = 0

	for (let prog of programs) {
		if (ns.fileExists(prog)) {
			++numTools;
		}
	}
	return numTools;
}

export function hackServer(ns, server) {
	var backdoorCheck = await ns.prompt("Do you want to install a backdoor on " + server + "?");

	ns.brutessh(server);
	ns.ftpcrack(server);
	ns.relaysmtp(server);
	ns.httpworm(server);
	ns.sqlinject(server);
	ns.nuke(server);

	if (backdoorCheck === true) {
		ns.run("scripts/connect.js", 1, factionNames[count]);
		ns.installBackdoor();
		ns.tprint("Got backdoor on " + server);
	}
	ns.tprint("Got root on " + server);
}
