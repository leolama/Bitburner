/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var count = 0;
	var programs = ["BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe"];
	var reqLevel = [50,100,250,500,750]; //program unlock levels (except with darkweb)
	var playerLevel = ns.getPlayer().hacking; //get hacking level

	var availMoney = ns.getPlayer().money;
	var maxServers = ns.getPurchasedServerLimit();
	var currentServers = ns.getPurchasedServers();

    let data = ns.read("/data/purchasedserver-data.txt"); //read data file and split it into an array
	let dataSplit = data.split(',').map(Number);

	var serverRam = []; //push the array into vars
    serverRam.push(dataSplit[0]);
    serverRam.push(dataSplit[1]);
    serverRam.push(dataSplit[2]);

    var serverCost = []; //push the array into vars
    serverCost.push(dataSplit[3]);
    serverCost.push(dataSplit[4]);
    serverCost.push(dataSplit[5]);	

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
			//create the program if above failed
			else if (playerLevel >= reqLevel[0]) {
				ns.print("Busy? " + ns.isBusy());
				if (!ns.fileExists(programs[0]) && !ns.isBusy()) { //check that the player isn't already busy
					ns.createProgram(programs[0]);
					ns.print("Creating " + programs[0]);
					programs.splice(0,1);
					reqLevel.splice(0,1);
					++count;
				}
			}
			else {
				ns.print("Need hacking level " + reqLevel[0] + " for " + programs[0]);
			}
			await ns.sleep(2000);
			playerLevel = ns.getPlayer().hacking; //refresh hacking level
		}
	}

	/*
			Server autobuy
	*/

	while (currentServers.length < maxServers) {
		if (availMoney > serverCost[0]) {
			if (serverRam[0] === 1024) {
			ns.run("scripts/buyserver.js",1,serverRam[0]);
			await ns.write("/data/purchasedserver-data.txt","16384,1048576,5000000000,1200000000000","w"); 
			serverRam.splice(0,1);
			serverCost.splice(0,1);
			await ns.sleep(2000);
			}
			if (serverRam[0] === 16384) {
				ns.run("scripts/buyserver.js",1,serverRam[0]);					
				await ns.write("/data/purchasedserver-data.txt","1048576,1200000000000","w");
				serverRam.splice(0,1);
				serverCost.splice(0,1);
				await ns.sleep(2000);
			}
			else {
				ns.run("scripts/buyserver.js",1,serverRam[0]);
				await ns.sleep(2000);
			}
		}															
		else {
			ns.print("Can't afford a " + serverRam[0] + "GB server");
			await ns.sleep(2000)
		}
	}
	var currentServers = ns.getPurchasedServers();
	await ns.sleep(10000);
}
	
