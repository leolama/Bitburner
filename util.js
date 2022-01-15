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

export async function hackServer(ns, server) {
	ns.brutessh(server);
	ns.ftpcrack(server);
	ns.relaysmtp(server);
	ns.httpworm(server);
	ns.sqlinject(server);
	ns.nuke(server);

	if (await ns.prompt("Do you want to install a backdoor on " + server + "?")) {
		ns.run("scripts/connect.js", 1, server);
		//ns.installBackdoor(); //SF 4.1
		//ns.tprint("Got backdoor on " + server);
	}
	else {
		ns.tprint("Got root on " + server);
	}
}
