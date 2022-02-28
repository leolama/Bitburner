import { getServerPath } from 'util.js';

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"];
	const scripts = ["hack-manager.js", "buy-manager.js", "faction-manager.js", "crime-manager.js", "sleeve-manager.js", "gang-manager.js", "corp-manager.js", "stock-manager.js"];
    var scriptsRam = [];
    var execRam = ns.getScriptRam("bin/exec.js");
    var playerRam = ns.getServerMaxRam("home") - execRam;
	var scriptsToStart = [];
	var factionPaths = [];


	//get required ram of each script
	for (let script of scripts) {
		let ram = ns.getScriptRam("/managers/" + script);
		ns.print(script + " - " + ram + "GB");
        scriptsRam.push(ram);
	}

    for (let i in scriptsRam) {
        if (playerRam > scriptsRam[i])  {
            scriptsToStart.push("/managers/" + scripts[i]);
            playerRam = playerRam - scriptsRam[i];
            ns.print(playerRam);
        }
    }

    if (scriptsToStart.includes("/managers/buy-manager.js")) {
        await ns.write("/data/purchased-servers.txt", "128,1024,16384,1048576", "w");
    }

    if (scriptsToStart.includes("/managers/faction-manager.js")) {
        for (let faction of factionServerNames) {		
            let path = getServerPath(ns, faction);
            factionPaths.push(path);
        }
        await ns.write("/data/faction-paths.txt",factionPaths, "w")	
    }

    ns.run("bin/exec.js",1,scriptsToStart.join())
}