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
	if (ns.fileExists("brutessh.exe") {
		ns.brutessh(server);
	}
	if (ns.fileExists("ftpcrack.exe") {
		ns.ftpcrack(server);
	}
	if (ns.fileExists("relaysmtp.exe") {
		ns.relaysmtp(server);
	}
	if (ns.fileExists("httpworm.exe") {
		ns.httpworm(server);
	}
	if (ns.fileExists("sqlinject.exe") {
		ns.sqlinject(server);
	}
	ns.nuke(server);
	ns.print("Got root on " + server);
}
