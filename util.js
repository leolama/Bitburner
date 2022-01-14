//https://github.com/leolama/Bitburner
/** @param {NS} ns **/
export function countTools(ns) {
	let hTools = ["brutessh.exe","ftpcrack.exe","relaysmtp.exe","httpworm.exe","sqlinject.exe"]
	let numTools = 0

	for (let i = 0;i < 4; ++i) {
		if (ns.fileExists(hTools[i])) {
			++numTools;
		}
	}
	return numTools;
}
