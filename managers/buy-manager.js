import { buyServer, log, getNsDataThroughFile } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");
	var count = 0;
	var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];

	var availMoney = ns.getPlayer().money;
	var maxServers = ns.getPurchasedServerLimit();
	var currentServers = await getNsDataThroughFile(ns, 'ns.getPurchasedServers()', '/data/purchased-server-ram.txt');
	var cantAfford = false;
	var buyPrompt;
	var serverRam = [128,1024,16384,1048576]
	var serverCost = [];
	var serverRamIndex = ns.read('/data/purchased-server-ram.txt');
	

	for (let ram of serverRam) {
		serverCost.push(ns.getPurchasedServerCost(ram)); //push server costs corrosponding to the ram into an array
	}

	/*
			Hacking program autobuy
	*/
	log(ns, "INFO: Started program autobuy");
	while (count < 5) {
		for (let i = 0; i < programs.length; ++i) {
			//check if we have a tor router
			if (ns.getPlayer().tor === true) {
				if (!ns.fileExists(programs[0])) {
					if (ns.purchaseProgram(programs[0])) {
						//if we don't have the program, try to buy it
						log(ns, "SUCCESS: Bought " + programs[0]);
						programs.splice(0, 1);
						++count;
					} else {
						log(ns, "INFO: Can't afford " + programs[0]);
					}
				} else if (ns.fileExists(programs[0])) {
					//if we have the file, skip it
					log(ns, "INFO: Already have " + programs[0]);
					programs.splice(0, 1);
					++count;
				}
			} else if (!ns.purchaseTor()) {
				//try to buy a tor router
				log(ns, "INFO: Cannot afford a TOR router");
			}
			await ns.sleep(500);
			availMoney = ns.getPlayer().money; //refresh available money
		}
	}

	/*
			Server autobuy
	*/
	log(ns, "INFO: Started server autobuy");
	while (currentServers.length < maxServers) {
		if (serverCost[serverRamIndex] == 'Infinity' || serverCost[serverRamIndex] == null) {
			log(ns, 'WARN: Next server RAM not available, retrying previous amount');
			serverRam.splice(serverRamIndex, 1)
			serverCost.splice(serverRamIndex, 1)
			--serverRamIndex;
		}
		if (availMoney > serverCost[serverRamIndex]) {
			//if we have more money than the server cost, buy it and update data file
			if (await buyServer(ns, serverRam[serverRamIndex], serverRamIndex + 1)) {
				log(ns, 'SUCCESS: Bought a ' + serverRam[serverRamIndex] + 'GB server');
				if (serverRamIndex < serverRam.length) {
					++serverRamIndex;
					await ns.write("/data/purchased-server-ram.txt", serverRamIndex, "w");
				} else {
					if (buyPrompt == null) {
						if (await ns.prompt('Keep buying servers?')) {
							log(ns, 'Buying servers to limit');
							buyPrompt = true;
						} else {
							log(ns, 'Stopped by player');
							return;
						}
					}
					
				}
			} else {
				log(ns, 'ERROR: Failed to buy a ' + serverRam[serverRamIndex] + 'GB server', true);
				return;
			}
		} else {
			log(ns, "INFO: Need " + ns.nFormat(serverCost[serverRamIndex], "($0.000a)") + " to buy a " + ns.nFormat(serverRam[serverRamIndex], "0,0") + "GB server");
			cantAfford = true;
			while (cantAfford == true) {
				if (availMoney < serverCost[serverRamIndex]) cantAfford = false;
				await ns.sleep(5000);
			}
		}
		//refresh vars
		availMoney = ns.getPlayer().money;
		maxServers = ns.getPurchasedServerLimit();
		currentServers = await getNsDataThroughFile(ns, 'ns.getPurchasedServers()', '/data/purchased-server-ram.txt');
	}
}