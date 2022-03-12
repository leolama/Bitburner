/**
 * Manages the launching of scripts and managers
 * accepts arguments to skip launching a specific program
 * eg: run setup.js --no_hack --no_corp
**/

import { getServerPath, log } from 'util.js';

const scriptArgs = [
    ['no_hack', false],
    ['no_buy', false],
    ['no_faction', false],
    ['no_crime', false],
    ['no_sleeve', false],
    ['no_stock', false],
    ['no_corp', false]
];

export function autocomplete(data, args) {
    data.flags(scriptArgs);
    return [];
}

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.print("Script started");
    //ns.disableLog('ALL');
    const flags = ns.flags(scriptArgs);
	const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"];
	const scripts = ["hack-manager.js", "buy-manager.js", "faction-manager.js", "crime-manager.js", "sleeve-manager.js", "stock-manager.js"];
    const scriptsRam = [];
    const execRam = ns.getScriptRam("bin/exec.js");
    var playerRam = ns.getServerMaxRam("home") - execRam;
	var scriptsToStart = [];
	var factionPaths = [];

    if (ns.getPlayer().hasCorporation) {
        //if we have a corporation start the manager for it
        scripts.push('corp-manager.js')
    } else {
        //else overwrite the data file so we don't start from stage 4
        await ns.write('/data/corp-stage.txt', '1', 'w')
    }

    //argument processing
    if (flags.no_hack) {
        scripts.splice(0,1);
        log(ns, 'INFO: Skipping hack-manager.js');
    } if (flags.no_buy) {
        scripts.splice(1,1);
        log(ns, 'INFO: Skipping buy-manager.js');
    } if (flags.no_faction) {
        scripts.splice(2,1);
        log(ns, 'INFO: Skipping faction-manager.js');
    } if (flags.no_crime) {
        scripts.splice(3,1);
        log(ns, 'INFO: Skipping crime-manager.js');
    } if (flags.no_sleeve) {
        scripts.splice(4,1);
        log(ns, 'INFO: Skipping sleeve-manager.js');
    } if (flags.no_stock) {
        scripts.splice(5,1);
        log(ns, 'INFO: Skipping stock-manager.js');
    } if (flags.no_corp && scripts.length > 6) {
        scripts.splice(6,1);
        log(ns, 'INFO: Skipping corp-manager.js');
    }

	//get required ram of each script
	for (let script of scripts) {
		let ram = ns.getScriptRam("/managers/" + script);
		ns.print(script + " - " + ram + "GB");
        scriptsRam.push(ram);
	}

    //calculate how many scripts we can run with our system RAM
    for (let i in scriptsRam) {
        if (playerRam > scriptsRam[i])  {
            scriptsToStart.push("/managers/" + scripts[i]);
            playerRam = playerRam - scriptsRam[i];
        }
    }

    if (scriptsToStart.includes("/managers/buy-manager.js")) {
        await ns.write("/data/purchased-servers.txt", "0", "w");
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