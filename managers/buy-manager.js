/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var count = 0;
	var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
	//var reqLevel = [50, 100, 250, 500, 750]; //program unlock levels (except with darkweb)
	//var playerLevel = ns.getPlayer().hacking; //get hacking level

	var availMoney = ns.getPlayer().money;
	var maxServers = ns.getPurchasedServerLimit();
	var currentServers = ns.getPurchasedServers();

	let ramData = ns.read("/data/serverram-data.txt"); //read data file and split it into an array
	let costData = ns.read("/data/servercost-data.txt"); //read data file and split it into an array
	let ramDataSplit = ramData.split(",").map(Number);
	let costDataSplit = costData.split(",").map(Number);

	var serverRam = []; //push the array into vars
	serverRam.push(ramDataSplit[0]);
	serverRam.push(ramDataSplit[1]);
	serverRam.push(ramDataSplit[2]);
	serverRam.push(ramDataSplit[3]);

	var serverCost = []; //push the array into vars
	serverCost.push(costDataSplit[0]);
	serverCost.push(costDataSplit[1]);
	serverCost.push(costDataSplit[2]);
	serverCost.push(costDataSplit[3]);

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
		if (availMoney > serverCost[0]) {
			if (serverRam[0] === 128) {
				ns.run("src/buyserver.js", 1, serverRam[0]);
				await ns.write("/data/serverram-data.txt", "1024,16384,1048576", "w");
				await ns.write("/data/servercost-data.txt", "8448000,5000000000,1200000000000", "w");
				serverRam.splice(0, 1);
				serverCost.splice(0, 1);
				await ns.sleep(2000);
			}
			if (serverRam[0] === 1024) {
				ns.run("src/buyserver.js", 1, serverRam[0]);
				await ns.write("/data/serverram-data.txt", "16384,1048576", "w");
				await ns.write("/data/servercost-data.txt", "5000000000,1200000000000", "w");
				serverRam.splice(0, 1);
				serverCost.splice(0, 1);
				await ns.sleep(2000);
			}
			if (serverRam[0] === 16384) {
				ns.run("src/buyserver.js", 1, serverRam[0]);
				await ns.write("/data/serverram-data.txt", "1048576", "w");
				await ns.write("/data/servercost-data.txt", "1200000000000", "w");
				serverRam.splice(0, 1);
				serverCost.splice(0, 1);
				await ns.sleep(2000);
			} else {
				ns.run("src/buyserver.js", 1, serverRam[0]);
				await ns.sleep(2000);
			}
		} else {
			let neededMoney = serverCost[0] - availMoney;

			ns.print("Need " + ns.nFormat(neededMoney, "($0.000a)") + " to buy a " + ns.nFormat(serverRam[0], "0,0") + "GB server");
			await ns.sleep(2000);
		}
		availMoney = ns.getPlayer().money;
		maxServers = ns.getPurchasedServerLimit();
		currentServers = ns.getPurchasedServers();
	}
	await ns.sleep(10000);
}