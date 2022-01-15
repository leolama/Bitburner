/** @param {NS} ns **/
import { hackTools } from "util.js"
export async function main(ns) {
    ns.disableLog("ALL");
    ns.enableLog("sleep");
    while (true) {
        var allServers = await findAllServers(ns);  // finds all servers and clones grow hack and weaken files
        var multiarray = await findHackable(ns, allServers);    // finds and nukes optimal, hackable, and rootale servers.
        var hackableServers = multiarray[0];
        var rootableServers = multiarray[1];
        var optimalServer = multiarray[2];

        var target = optimalServer;
        var moneyThresh = ns.getServerMaxMoney(target) * 0.9;   //change thresholds to whatever values you prefer
        var securityThresh = ns.getServerMinSecurityLevel(target) + 3;
        let numThreads = 1;
        var numTimesToHack = 0.05;

        //Number of times the code weakens/grows/hacks in a row once it decides on which one to do.
        //Change to the value you prefer.
        //Higher number means longer time without updating list of all servers and optimal server, but also less time lost in buffer time in between cycles.
        //I would recommend having it at 1 at the start of the run and gradually increasing it as the rate at which you get more servers you can use decreases.
        //Don't increase it too far tho, as weaken/hack/grow times also tend to increase throughout a run.
        numTimesToHack += 1;

        //weakens/grows/hacks the optimal server from all rootable servers except home
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            ns.print("Weakening " + target)
            for (let i = 0; i < rootableServers.length; i++) {
                ns.killall(rootableServers[i]);
                numThreads = (ns.getServerMaxRam(rootableServers[i]) - ns.getServerUsedRam(rootableServers[i])) //free ram
                numThreads /= ns.getScriptRam("weak.js", "home");
                numThreads = Math.floor(numThreads);
                if (numThreads > 0) {
                    ns.exec("weak.js", rootableServers[i], numThreads, target);
                }
            }
            await ns.sleep(numTimesToHack * ns.getWeakenTime(target) + 300);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.print("Growing " + target)
            for (let i = 0; i < rootableServers.length; i++) {
                ns.killall(rootableServers[i]);
                numThreads = (ns.getServerMaxRam(rootableServers[i]) - ns.getServerUsedRam(rootableServers[i]))
                numThreads /= ns.getScriptRam("grow.js", "home");
                if (numThreads > 0) {
                    ns.exec("grow.js", rootableServers[i], numThreads, target);
                }
            }
            await ns.sleep(numTimesToHack * ns.getGrowTime(target) + 300);
        } else {
            ns.print("Hacking " + target)
            for (let i = 0; i < rootableServers.length; i++) {
                ns.killall(rootableServers[i]);
                numThreads = (ns.getServerMaxRam(rootableServers[i]) - ns.getServerUsedRam(rootableServers[i]))
                numThreads /= ns.getScriptRam("hack.js", "home");
                if (numThreads > 0) {
                    ns.exec("hack.js", rootableServers[i], numThreads, target);
                }
            }
            await ns.sleep(numTimesToHack * ns.getHackTime(target) + 300);
        }
    }

}

/**
* Copies files in file list to all servers and returns an array of all servers
*/
async function findAllServers(ns) {
    const fileList = ["hack.js", "weak.js", "grow.js"];   //These files just infinitely hack, weaken, and grow respectively.
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
                await ns.scp(fileList, "home", edges[i]);
            }
        }
    }
    return Object.keys(serverDiscovered);
}

/**
* Finds list of all hackable and all rootable servers. Also finds optimal server to hack.
* A hackable server is one which you can hack, grow, and weaken.
* A rootable server is one which you can nuke.
* Returns a 2d array with list of hackable, rootable, and the optimal server to hack
*/
async function findHackable(ns, allServers) {
    var hackableServers = [];
    var rootableServers = [];
    var numPortsPossible = 0;

    if (ns.fileExists("BruteSSH.exe", "home")) {
        numPortsPossible += 1;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        numPortsPossible += 1;
    }
    if (ns.fileExists("RelaySMTP.exe", "home")) {
        numPortsPossible += 1;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        numPortsPossible += 1;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        numPortsPossible += 1;
    }


    for (let i = 0; i < allServers.length; i++) {
        //if your hacking level is high enough and you can open enough ports, add it to hackable servers list
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(allServers[i]) && numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])) {
            hackableServers.push(allServers[i]);
        }
        //if it isn't home(this makes sure that you don't kill this script) and you either
        //already have root access(this is useful for servers bought by the player as you have access to those even if the security is higher than you can nuke)
        //  or you can open enough ports
        if (allServers[i] != "home" && (ns.hasRootAccess(allServers[i]) || (numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])))) {
            rootableServers.push(allServers[i]);
            //if you don't have root access, open ports and nuke it
            if (!ns.hasRootAccess(allServers[i])) {
                if (ns.fileExists("BruteSSH.exe")) {
                    ns.brutessh(allServers[i]);
                }
                if (ns.fileExists("FTPCrack.exe")) {
                    ns.ftpcrack(allServers[i]);
                }
                if (ns.fileExists("RelaySMTP.exe")) {
                    ns.relaysmtp(allServers[i]);
                }
                if (ns.fileExists("HTTPWorm.exe")) {
                    ns.httpworm(allServers[i]);
                }
                if (ns.fileExists("SQLInject.exe")) {
                    ns.sqlinject(allServers[i]);
                }
                ns.nuke(allServers[i]);
            }
        }
    }

    //finds optimal server to hack
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
