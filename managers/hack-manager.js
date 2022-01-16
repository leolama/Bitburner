/** @param {NS} ns **/
import { hackTools, nukeServer } from "util.js"
export async function main(ns) {
    ns.disableLog("ALL");
    ns.enableLog("sleep");
    while (true) {
        var allServers = await findAllServers(ns);
        var multiarray = await findHackable(ns, allServers);
        var hackableServers = multiarray[0];
        var rootableServers = multiarray[1];
        var optimalServer = multiarray[2];
        var target = optimalServer;
        var moneyThresh = ns.getServerMaxMoney(target) * 0.9;
        var securityThresh = ns.getServerMinSecurityLevel(target) + 3;
        let numThreads = 1;
        var numTimesToHack = 0.05;
        numTimesToHack += 1;

        //weak/grow/hack optimal
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
                await ns.scp(fileList, "home", edges[i]);
            }
        }
    }
    return Object.keys(serverDiscovered);
}

async function findHackable(ns, allServers) {
    var hackableServers = [];
    var rootableServers = [];
    var numPortsPossible = hackTools(ns);

    for (let i = 0; i < allServers.length; i++) {
        //if hacking level & hacking tools equal or higher then add to hackable
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(allServers[i]) && numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])) {
            hackableServers.push(allServers[i]);
        }
        if (allServers[i] != "home" && (ns.hasRootAccess(allServers[i]) || (numPortsPossible >= ns.getServerNumPortsRequired(allServers[i])))) {
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