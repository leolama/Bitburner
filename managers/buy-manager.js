/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");
	var count = 0;
	var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
	//var reqLevel = [50, 100, 250, 500, 750]; //program unlock levels (except with darkweb)
	//var playerLevel = ns.getPlayer().hacking; //get hacking level

	var availMoney = ns.getPlayer().money;
	var maxServers = ns.getPurchasedServerLimit();
	var currentServers = ns.getPurchasedServers();
	var serverRam = [128, 1024, 16384, 1048576];
	var serverCost = [];
	var cantAfford = false;

	for (let ram of serverRam) {
		serverCost.push(ns.getPurchasedServerCost(ram));
	}

	/*
			Hacking program autobuy
	*/

	while (count < 5) {
		for (let i = 0; i < programs.length; ++i) {
			//buy tor router and purchase program from darkweb
			if (ns.getPlayer().tor === true) {
				if (!ns.fileExists(programs[0])) {
					let check = ns.purchaseProgram(programs[0]);
					if (check === true) {
						ns.print("Bought " + programs[0]);
						programs.splice(0, 1);
						//reqLevel.splice(0, 1);
						++count;
					} else {
						ns.print("Can't afford " + programs[0]);
					}
				} else if (ns.fileExists(programs[0])) {
					ns.print("Already have " + programs[0]);
					programs.splice(0, 1);
					//reqLevel.splice(0, 1);
					++count;
				}
			} else if (!ns.purchaseTor()) {
				ns.print("Cannot afford a TOR router");
			}
			//create the program if above failed
			/*
			if (playerLevel >= reqLevel[0]) {
				ns.print("Busy? " + ns.isBusy());
				if (!ns.fileExists(programs[0]) && !ns.isBusy()) { //check that the player isn't already busy
					ns.createProgram(programs[0]);
					ns.print("Creating " + programs[0]);
					programs.splice(0, 1);
					reqLevel.splice(0, 1);
					++count;
				}
			} else {
				ns.print("Need hacking level " + reqLevel[0] + " for " + programs[0]);
			}
			*/
			await ns.sleep(2000);
			//playerLevel = ns.getPlayer().hacking; //refresh hacking level
			availMoney = ns.getPlayer().money; //refresh available money
		}
	}

	/*
			Server autobuy
	*/

	while (currentServers.length < maxServers) {
		if (serverRam[0] === 1048576) {
			while (currentServers.length < maxServers) {
				if (availMoney > serverCost[0]) {
					ns.run("src/buyserver.js", 1, serverRam[0]);
					ns.print("Bought a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
					await ns.sleep(10000);
				} else {
					ns.print("Need " + ns.nFormat(serverCost[0], "($0.000a)") + " to buy a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
					cantAfford = true;
					while (cantAfford === true) {
						if (availMoney < serverCost[0]) cantAfford = false;
						else {
							await ns.sleep(100000);
						}
						await ns.sleep(500);
					}
				}
				availMoney = ns.getPlayer().money;
				maxServers = ns.getPurchasedServerLimit();
				currentServers = ns.getPurchasedServers();
				let prompt = await ns.prompt("Keep buying servers?");
				if (prompt === false) {
					return;
				}
			}
		}

		if (availMoney > serverCost[0]) {
			ns.run("src/buyserver.js", 1, serverRam[0]);
			ns.print("Bought a " + ns.nFormat(serverRam[0], "0,0") + " server");
			serverRam.splice(0, 1);
			serverCost.splice(0, 1);
			await ns.sleep(10000);
		} else {
			ns.print("Need " + ns.nFormat(serverCost[0], "($0.000a)") + " to buy a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
			cantAfford = true;
			while (cantAfford === true) {
				if (availMoney < serverCost[0]) cantAfford = false;
				else {
					await ns.sleep(100000);
				}
				await ns.sleep(500);
			}
		}
		availMoney = ns.getPlayer().money;
		maxServers = ns.getPurchasedServerLimit();
		currentServers = ns.getPurchasedServers();
	}
}