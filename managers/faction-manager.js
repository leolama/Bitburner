import { hackTools, nukeServer, terminalInput, log, getNsDataThroughFile, runCommand } from 'util.js';
const doc = eval("document");
const scriptArgs = [
    ['nogang', false],
    ['nocorp', false],
    ['nostocks', false]
];
export function autocomplete(data, args) {
    data.flags(scriptArgs);
    return [];
}
/** @param {import("../.").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.print("Script started");
    async function checkFactionInvites() {
        let factionInvites = await getNsDataThroughFile(ns, `ns.singularity.checkFactionInvitations()`, '/data/player-faction-invites.txt');
        //check for invitations from main factions
        for (let fac of factionNames) {
            if (factionInvites.includes(fac)) {
                await runCommand(ns, `ns.singularity.joinFaction('${fac}')`);
                log(ns, "SUCCESS: Joined " + fac);
            }
        }
        //check for invitations from other factions
        for (let fac of otherFactionNames) {
            if (factionInvites.includes(fac)) {
                await runCommand(ns, `ns.singularity.joinFaction('${fac}')`);
                log(ns, "SUCCESS: Joined " + fac);
            }
        }
    }
    async function checkTerminal() {
        //check if we're on the terminal screen
        if (doc.getElementById("terminal-input") == null) {
            log(ns, "WARN: Player isn't on the terminal screen");
            while (doc.getElementById("terminal-input") == null) {
                await checkFactionInvites();
                await runOtherManagers();
                await ns.sleep(100);
            }
        }
    }
    async function runOtherManagers() {
        //since this script will be running until we finish the bitnode, we use this to run some other managers
        //gangs
        if (skipManagers.gang == false) {
            let karma = ns.heart.break();
            if (karma < -54000) {
                let checkProcess = (await getNsDataThroughFile(ns, `ns.ps()`, '/data/process-list.txt')).filter(p => p.filename == '/managers/gang-manager.js');
                if (checkProcess.length > 0) {
                    log(ns, 'WARN: Another version of /managers/gang-manager.js is already running, skipping');
                    skipManagers.gang = true;
                }
                else {
                    log(ns, 'SUCCESS: Starting gang-manager.js');
                    ns.run('/managers/gang-manager.js');
                    skipManagers.gang = true;
                }
            }
        }
        //corp
        if (skipManagers.corp == false) {
            if (ns.getPlayer().money > 150e9) {
                let checkProcess = (await getNsDataThroughFile(ns, `ns.ps()`, '/data/process-list.txt')).filter(p => p.filename == '/managers/corp-manager.js');
                if (checkProcess.length > 0) {
                    log(ns, 'WARN: Another version of /managers/corp-manager.js is already running, skipping');
                    skipManagers.corp = true;
                }
                else {
                    log(ns, 'SUCCESS: Starting corp-manager.js');
                    ns.run('/managers/corp-manager.js');
                    skipManagers.corp = true;
                }
            }
        }
        //stocks
        if (skipManagers.stocks == false) {
            if (ns.getPlayer().hasWseAccount && ns.getPlayer().hasTixApiAccess) {
                //if we have a stocks account and API acces then start the manager for it
                let checkProcess = (await getNsDataThroughFile(ns, `ns.ps()`, '/data/process-list.txt')).filter(p => p.filename == '/managers/stock-manager.js');
                if (checkProcess.length > 0) {
                    log(ns, 'WARN: Another version of /managers/stock-manager.js is already running, skipping');
                    skipManagers.stocks = true;
                }
                else {
                    log(ns, 'SUCCESS: Starting stock-manager.js');
                    ns.run('/managers/stock-manager.js');
                    skipManagers.stocks = true;
                }
            }
        }
    }
    const flags = ns.flags(scriptArgs);
    const factionNames = ["CyberSec", "NiteSec", "The Black Hand", "BitRunners", "w0r1d_d43m0n"]; //backdoor based factions
    const otherFactionNames = [
        "Daedalus",
        "Tian Di Hui",
        "Netburners",
        "ECorp",
        "MegaCorp",
        "KuaiGong International",
        "Four Sigma",
        "NWO",
        "Blade Industries",
        "ImnoTek Incorporated",
        "Bachman & Associates",
        "Clarke Incorporated",
        "Fulcrum Secret Technologies",
        "OmniTek Incorporated",
        "Slum Snakes",
        "Tetrads",
        "Silhouette",
        "Speakers for the Dead",
        "The Dark Army",
        "The Syndicate",
        "The Covenant",
        "Illuminati",
        "Bladeburners"
    ]; //factions that don't stop us from joining other factions
    const factionServerNames = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"]; //backdoor based faction server names
    const factionHackLvl = []; //required hacking levels
    const factionTools = ["1", "2", "3", "4", "5"]; //number of programs needed to root
    var numTools = hackTools(ns); //number of hacking tools that we have
    var count = 0;
    var hackingLvl = ns.getPlayer().hacking; //player hacking level
    var playerAugs = ns.read('/data/player-augs-purchased.txt');
    //function vars
    var skipManagers = {
        gang: false,
        corp: false,
        stocks: false
    };
    if (flags.nogang) {
        skipManagers.gang = true;
        log(ns, 'WARN: Skipping gang-manager.js');
    }
    if (flags.nocorp) {
        skipManagers.corp = true;
        log(ns, 'WARN: Skipping corp-manager.js');
    }
    if (flags.nostocks) {
        skipManagers.stocks = true;
        log(ns, 'WARN: Skipping stock-manager.js');
    }
    //get the paths to the faction servers
    var temp_factionPaths = ns.read('/data/faction-paths.txt');
    var factionPaths = temp_factionPaths.split(",");
    log(ns, "SUCCESS: Got faction server paths");
    for (let faction of factionServerNames) {
        //get faction hacking level requirement
        factionHackLvl.push(ns.getServerRequiredHackingLevel(faction));
    }
    while (count < factionServerNames.length) {
        if (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
            //if backdoor hasn't been installed, start a loop
            while (ns.getServer(factionServerNames[count]).backdoorInstalled === false) {
                if (factionHackLvl[count] <= hackingLvl && numTools >= factionTools[count]) {
                    //if our hacking level and hacking tools are higher than the server needs
                    if (factionServerNames[count] == "w0r1d_d43m0n") {
                        //if we're waiting to backdoor world_daemon, check that we have The Red Pill
                        while (!playerAugs.includes("The Red Pill")) {
                            await checkFactionInvites();
                            await ns.sleep(1000);
                        }
                    }
                    await nukeServer(ns, factionServerNames[count]); //make sure we have root access on the target
                    await checkTerminal(); //check that we're on the terminal
                    await terminalInput(factionPaths[count]);
                    await ns.sleep(100);
                    log(ns, "INFO: Installing backdoor on " + factionServerNames[count] + "...", true);
                    await checkTerminal();
                    await ns.installBackdoor();
                    if (ns.getServer(factionServerNames[count]).backdoorInstalled === true) {
                        log(ns, "SUCCESS: Successfully backdoored " + factionServerNames[count], true);
                        await terminalInput("home");
                        ++count;
                    }
                    else {
                        log(ns, "ERROR: Failed backdoor", true);
                        log(ns, "INFO: Returning home and retrying", true);
                        await terminalInput("home");
                    }
                }
                else {
                    log(ns, "WARN: Trying to backdoor " + factionServerNames[count] + ". Need hacking level " + factionHackLvl[count] + ", and " + factionTools[count] + " hacking tools");
                    while (hackingLvl <= factionHackLvl[count] || numTools <= factionTools[count]) {
                        //reduce log spam and refresh vars
                        numTools = hackTools(ns);
                        hackingLvl = ns.getPlayer().hacking;
                        await checkFactionInvites();
                        await runOtherManagers();
                        await ns.sleep(1000);
                    }
                }
                //refresh vars
                numTools = hackTools(ns);
                hackingLvl = ns.getPlayer().hacking;
                await checkFactionInvites();
                await runOtherManagers();
                await ns.sleep(1000);
            }
        }
        else {
            log(ns, "INFO: Already backdoored " + factionServerNames[count]);
            ++count;
        }
    }
}