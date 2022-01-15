//* @param {NS} ns **/
import { nukeServer, hackTools } from "util.js"
export async function main(ns) {
    while (true) {
        ns.disableLog("ALL");
        ns.enableLog("sleep");
        var allServers = await findAllServers(ns);
        var multiarray = await findHackable(ns, allServers);
        var optimalServer = multiarray[2];

        var target = optimalServer;
        var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
        var securityThresh = ns.getServerMinSecurityLevel(target) + 8;
        let numThreads = 1;
        var numTimesToHack = 0.05;

        numTimesToHack += 1;

        //weakens/grows/hacks the optimal server from all rootable servers except home
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            ns.print("Weakening " + optimalServer)
            for (let i = 0; i < allServers.length; i++) {
                if (allServers[i] = "home") {
                    ns.scriptKill("weak.js", allServers[i]);
                    ns.scriptKill("grow.js", allServers[i]);
                    ns.scriptKill("hack.js", allServers[i]);
                }
                else {
                    ns.killall(allServers[i]);
                }
                numThreads = (ns.getServerMaxRam(allServers[i]) - ns.getServerUsedRam(allServers[i])) //free ram
                numThreads /= ns.getScriptRam("weak.js", "home");
                numThreads = Math.floor(numThreads);
                if (numThreads > 0 && allServers[i] != "home") {
                    ns.exec("weak.js", allServers[i], numThreads, target);
                }
                else if (allServers[i] = "home") {
                    numThreads = numThreads - 12;
                    if (numThreads > 0) {
                        ns.exec("weak.js", "home", numThreads, target);
                    }
                }
            }
            await ns.sleep(numTimesToHack * ns.getWeakenTime(target) + 300);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.print("Growing " + optimalServer)
            for (let i = 0; i < allServers.length; i++) {
                if (allServers[i] = "home") {
                    ns.scriptKill("weak.js", allServers[i]);
                    ns.scriptKill("grow.js", allServers[i]);
                    ns.scriptKill("hack.js", allServers[i]);
                }
                else {
                    ns.killall(allServers[i]);
                }
                numThreads = (ns.getServerMaxRam(allServers[i]) - ns.getServerUsedRam(allServers[i]))
                numThreads /= ns.getScriptRam("grow.js", "home");
                numThreads = Math.floor(numThreads);
                if (numThreads > 0 && allServers[i] != "home") {
                    ns.exec("grow.js", allServers[i], numThreads, target);
                }
                else if (allServers[i] = "home") {
                    numThreads = numThreads - 12;
                    if (numThreads > 0) {
                        ns.exec("weak.js", "home", numThreads, target);
                    }
                }
            }
            await ns.sleep(numTimesToHack * ns.getGrowTime(target) + 300);
        } else {
            ns.print("Hacking " + optimalServer)
            for (let i = 0; i < allServers.length; i++) {
                if (allServers[i] = "home") {
                    ns.scriptKill("weak.js", allServers[i]);
                    ns.scriptKill("grow.js", allServers[i]);
                    ns.scriptKill("hack.js", allServers[i]);
                }
                else {
                    ns.killall(allServers[i]);
                }
                numThreads = (ns.getServerMaxRam(allServers[i]) - ns.getServerUsedRam(allServers[i]))
                numThreads /= ns.getScriptRam("hack.js", "home");
                numThreads = Math.floor(numThreads);
                if (numThreads > 0 && allServers[i] != "home") {
                    ns.exec("hack.js", allServers[i], numThreads, target);
                }
                else if (allServers[i] = "home") {
                    numThreads = numThreads - 12;
                    if (numThreads > 0) {
                        ns.exec("weak.js", "home", numThreads, target);
                    }
                }
            }
            await ns.sleep(numTimesToHack * ns.getHackTime(target) + 300);
        }
    }

}

//Copies files in file list to all servers and returns an array of all servers
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

//Finds list of all hackable and all rootable servers. Also finds optimal server to hack.
async function findHackable(ns, allServers) {
    var hackableServers = [];
    var rootableServers = [];
    var numPortsPossible = hackTools(ns);

    for (let i = 0; i < allServers.length; i++) {
        //if your hacking level is high enough and you can open enough ports, add it to hackable servers list
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(allServers[i]) && numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])) {
            hackableServers.push(allServers[i]);
        }
        if (allServers[i] != "home" && (ns.hasRootAccess(allServers[i]) || (numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])))) {
            rootableServers.push(allServers[i]);
            //if you don't have root access, open ports and nuke it
            nukeServer(ns, allServers[i]);
            }
        }
    }

    //finds optimal server to hack
    let optimalServer = await findOptimal(ns, hackableServers);

    return [hackableServers, rootableServers, optimalServer];
}

//Finds the best server to hack
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
