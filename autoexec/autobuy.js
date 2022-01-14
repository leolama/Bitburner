//https://github.com/leolama/Bitburner
/** @param {NS} ns **/
export async function main(ns) {
	var count = 0;
	var programs = ["BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe"];
	var reqLevel = [50,100,250,500,750]; //program unlock levels (except with darkweb)
	var playerLevel = ns.getPlayer().hacking; //get hacking level
	var programsLen = programs.length - 1;
	ns.disableLog("ALL");

	while (count <= 4) {
		for (let i = 0; i <= programsLen; ++i) {
			//create the program
			if (playerLevel >= reqLevel[0]) {
				ns.print("Busy? " + ns.isBusy());
				if (!ns.fileExists(programs[0]) && !ns.isBusy()) {
					ns.createProgram(programs[0]);
					ns.tprint("Creating " + programs[0]);
					programs.splice(0,1);
					reqLevel.splice(0,1);
					++count;
				}
			}
			else {
				ns.print("Need hacking level " + reqLevel[0] + " for " + programs[0]);
			}

			//purchase from darkweb
			if (ns.getPlayer().tor === true) {
				if (!ns.fileExists(programs[0])) {
					let check = ns.purchaseProgram(programs[0]);
					if (check === true) {
						ns.print("Bought " + programs[0]);
						programs.splice(0,1);
						reqLevel.splice(0,1);
						++count;
					}
					else {
						ns.print("Can't afford " + programs[0]);
					}
				}
				else if (ns.fileExists(programs[0])) {
					ns.print("Already have " + programs[0])
					programs.splice(0,1);
					reqLevel.splice(0,1);
					++count;
				}
			}
			else if (!ns.purchaseTor()){
				ns.print("Cannot afford a TOR router");
			}
			await ns.sleep(10000);
			playerLevel = ns.getPlayer().hacking; //get hacking level again
		}
	}
}
