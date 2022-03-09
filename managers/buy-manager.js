import { log } from 'util.js'

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");
	var count = 0;
	var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];

	var availMoney = ns.getPlayer().money;
	var maxServers = ns.getPurchasedServerLimit();
	var currentServers = ns.getPurchasedServers();
	var serverCost = [];
	var cantAfford = false;
	var buyPrompt;
	var serverRam = [];

	let ramData = ns.read("/data/purchased-servers.txt").split(","); //read data file and split it into an array
	
	for (let split in ramData) {
		serverRam.push(ramData[split]); //push the array into a var
	}
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
		if (serverRam[0] == 1048576) {
			//highest ram server
			if (buyPrompt == false) {
				return;
			}
			await ns.write("/data/purchased-servers.txt", serverRam, "w");
			while (currentServers.length < maxServers) {
				if (availMoney > serverCost[0]) {
					ns.run("src/buyserver.js", 1, serverRam[0]);
					log(ns, "SUCCESS: Bought a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
					if (buyPrompt == null) {
						buyPrompt = await ns.prompt("Keep buying servers?");
					}
				} else {
					log(ns, "INFO: Need " + ns.nFormat(serverCost[0], "($0.000a)") + " to buy a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
					cantAfford = true;
					while (cantAfford == true) {
						if (availMoney > serverCost[0]) cantAfford = false;
						await ns.sleep(5000);
					}
				}
				availMoney = ns.getPlayer().money;
				maxServers = ns.getPurchasedServerLimit();
				currentServers = ns.getPurchasedServers();
			}
		}

		if (availMoney > serverCost[0]) {
			//if we have more money than the server cost, buy it and update data file
			ns.run("src/buy-server.js", 1, serverRam[0]);
			log(ns, "SUCCESS: Bought a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
			serverRam.splice(0, 1);
			serverCost.splice(0, 1);
			await ns.write("/data/purchased-servers.txt", serverRam, "w");
		} else {
			log(ns, "INFO: Need " + ns.nFormat(serverCost[0], "($0.000a)") + " to buy a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
			cantAfford = true;
			while (cantAfford == true) {
				if (availMoney < serverCost[0]) cantAfford = false;
				await ns.sleep(5000);
			}
		}
		//refresh vars
		availMoney = ns.getPlayer().money;
		maxServers = ns.getPurchasedServerLimit();
		currentServers = ns.getPurchasedServers();
	}
}