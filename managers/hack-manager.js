/**
 * original from MurataMain on reddit
 * accepts an argument to specify target server
 * eg: run hack-manager.js --target foodnstuff
**/
import { hackTools, nukeServer, log } from "util.js";

const scriptArgs = [
	['target', '']
];

export function autocomplete(data, args) {
	data.flags(scriptArgs);
	return [];
}

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	ns.disableLog("ALL");
	const flags = ns.flags(scriptArgs);
	while (true) {
		var allServers = await findAllServers(ns);
		var multiarray = await findHackable(ns, allServers);
		var hackableServers = multiarray[0];
		var rootableServers = multiarray[1];
		var optimalServer = multiarray[2];
		var target = optimalServer;
		if (flags.target != '') {
			//override the algorithm
			log(ns, 'INFO: Overriding target server with: ' + flags.target);
			target = flags.target;
		}
		var moneyThresh = ns.getServerMaxMoney(target) * 0.9;
		var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
		let numThreads = 1;
		var numTimesToHack = 0.05;
		numTimesToHack += 1;

		//weak/grow/hack optimal
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			log(ns, "INFO: Weakening " + target);
			for (let i = 0; i < rootableServers.length; i++) {
				ns.killall(rootableServers[i]);
				numThreads = ns.getServerMaxRam(rootableServers[i]) - ns.getServerUsedRam(rootableServers[i]); //free ram of the server
				numThreads /= ns.getScriptRam("weak.js", "home"); //number of threads the script can use
				numThreads = Math.floor(numThreads); //round the number down
				if (numThreads > 0) {
					ns.exec("weak.js", rootableServers[i], numThreads, target);
				}
			}
			var date = new Date(Date.now() + numTimesToHack * ns.getWeakenTime(target) + 300);
			var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");
			log(ns, 'INFO: Expecting finish at: ' + time);
			await ns.sleep(numTimesToHack * ns.getWeakenTime(target) + 300);
			log(ns, 'SUCCESS: Finished weakening');
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			log(ns, "INFO: Growing " + target);
			for (let i = 0; i < rootableServers.length; i++) {
				ns.killall(rootableServers[i]);
				numThreads = ns.getServerMaxRam(rootableServers[i]) - ns.getServerUsedRam(rootableServers[i]);
				numThreads /= ns.getScriptRam("grow.js", "home");
				if (numThreads > 0) {
					ns.exec("grow.js", rootableServers[i], numThreads, target);
				}
			}
			var date = new Date(Date.now() + numTimesToHack * ns.getGrowTime(target) + 300);
			var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");
			log(ns, 'INFO: Expecting finish at: ' + time);
			await ns.sleep(numTimesToHack * ns.getGrowTime(target) + 300);
			log(ns, 'SUCCESS: Finished growing');
		} else {
			log(ns, "INFO: Hacking " + target);
			for (let i = 0; i < rootableServers.length; i++) {
				ns.killall(rootableServers[i]);
				numThreads = ns.getServerMaxRam(rootableServers[i]) - ns.getServerUsedRam(rootableServers[i]);
				numThreads /= ns.getScriptRam("hack.js", "home");
				if (numThreads > 0) {
					ns.exec("hack.js", rootableServers[i], numThreads, target);
				}
			}
			//get and format the time into 24h
			var date = new Date(Date.now() + numTimesToHack * ns.getHackTime(target) + 300);
			var time = ns.nFormat(date.getHours(), "00") + ":" + ns.nFormat(date.getMinutes(), "00") + ":" + ns.nFormat(date.getSeconds(), "00");
			log(ns, 'INFO: Expecting finish at: ' + time);
			await ns.sleep(numTimesToHack * ns.getHackTime(target) + 300);
			log(ns, 'SUCCESS: Finished hacking');
		}
	}
}

async function findAllServers(ns) {
	const fileList = ["hack.js", "weak.js", "grow.js"];
	var q = [];
	var serverDiscovered = [];
	q.push("home");
	serverDiscovered["home"] = true;

	while (q.length) {
		let v = q.shift();
		let edges = ns.scan(v);

		for (let i = 0; i < edges.length; i++) {
			if (!serverDiscovered[edges[i]]) {
				serverDiscovered[edges[i]] = true;
				q.push(edges[i]);
				await ns.scp(fileList, edges[i], "home");
			}
		}
	}
	return Object.keys(serverDiscovered);
}

async function findHackable(ns, allServers) {
	var hackableServers = [];
	var rootableServers = [];
	var numPortsPossible = hackTools(ns);
	var hashnetServers = getHashnetServers();
	var num = 0;

	for (let i = 0; i < allServers.length; i++) {
		if (allServers[i] == "hacknet-node-" + num) {
			++num;
			continue;
		}
		//if hacking level & hacking tools equal or higher then add to hackable
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(allServers[i]) && numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])) {
			hackableServers.push(allServers[i]);
		}
		if (allServers[i] != "home" && (ns.hasRootAccess(allServers[i]) || numPortsPossible >= ns.getServerNumPortsRequired(allServers[i]))) {
			rootableServers.push(allServers[i]);
			//if you don't have root access, open ports and nuke it
			if (!ns.hasRootAccess(allServers[i])) {
				nukeServer(ns, allServers[i]);
			}
		}
	}
	let optimalServer = await findOptimal(ns, hackableServers);
	return [hackableServers, rootableServers, optimalServer];
}

async function findOptimal(ns, hackableServers) {
	let optimalServer = "n00dles";
	let optimalVal = 0;
	let currVal;
	let currTime;

	for (let i = 0; i < hackableServers.length; i++) {
		currVal = ns.getServerMaxMoney(hackableServers[i]);
		currTime = ns.getWeakenTime(hackableServers[i]) + ns.getGrowTime(hackableServers[i]) + ns.getHackTime(hackableServers[i]);
		currVal /= currTime;
		if (currVal >= optimalVal) {
			optimalVal = currVal;
			optimalServer = hackableServers[i];
		}
	}
	return optimalServer;
}

function getHashnetServers() {
	let start = "hacknet-node-"
	let servers = [];

	for (let i = 0; i < 24; ++i) {
		servers.push(start + i);
	}
	return servers;
}