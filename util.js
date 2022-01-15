//1
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

export async function nukeServer(ns, server) {
	ns.brutessh(server);
	ns.ftpcrack(server);
	ns.relaysmtp(server);
	ns.httpworm(server);
	ns.sqlinject(server);
	ns.nuke(server);
	ns.print("Got root on " + server);
}
